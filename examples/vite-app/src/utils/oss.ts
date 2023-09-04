import OSS from 'ali-oss';
import debounce from 'debounce-promise';

type CredentialInfoProps = {
  accessKeyId: string;
  accessKeySecret: string;
  expiration: Date | string | number;
  securityToken: string;
  bucket: string;
  region: string;
  secure?: boolean;
};

type MultipartUploadConfigType = {
  /** 设置并发上传的分片数量 默认4 */
  parallel?: number;
  /**  设置分片大小。默认值为1 MB，最小值为100 KB。*/
  partSize?: number;
  headers?: {
    /**  禁止文件覆盖 */
    'x-oss-forbid-overwrite'?: 'true' | 'false';
    'Cache-Control': 'no-cache' | string;
    [x: string]: any;
  };
  [x: string]: any;
};

type CommonUploadConfigType = {
  headers?: {
    /**  禁止文件覆盖 */
    'x-oss-forbid-overwrite'?: 'true' | 'false';
    'Cache-Control': 'no-cache' | string;
    [x: string]: any;
  };
  [x: string]: any;
};

class UploadClient {
  /**
   * 多个ali-oss实例;
   */
  uploadClients: Record<string, any>;

  /**
   * 分片上传文件的检查点;
   */
  checkpoints: Record<string, any>;

  /**
   * 缓存进度条处理函数
   */
  percents: Record<string, any>;

  /**
   * 分片上传设置;
   */
  multipartUploadConfig: MultipartUploadConfigType;

  /**
   * 普通上传设置;
   */
  commonUploadConfig: CommonUploadConfigType;

  /**
   * 上层工厂配置
   */
  ossClient: OSSClient;

  constructor(ossClient: OSSClient) {
    this.ossClient = ossClient;
    this.checkpoints = {};
    this.uploadClients = {};
    this.percents = {};
    this.multipartUploadConfig = {
      // 设置并发上传的分片数量。
      parallel: 4,
      // 设置分片大小。默认值为1 MB，最小值为100 KB。
      partSize: 1024 * 1024,
      headers: {
        'Cache-Control': 'no-cache',
        'x-oss-forbid-overwrite': 'true',
      },
    };
    this.commonUploadConfig = {
      headers: {
        'Cache-Control': 'no-cache',
        'x-oss-forbid-overwrite': 'true',
      },
    };
  }

  /**
   * 创建Client
   */
  private async createClient() {
    const info = this.ossClient.credentialInfo as CredentialInfoProps;
    return new OSS({
      region: info.region,
      accessKeyId: info.accessKeyId as string,
      accessKeySecret: info.accessKeySecret as string,
      stsToken: info.securityToken,
      bucket: info.bucket,
      secure: info.secure === undefined ? true : false,
    });
  }

  /**
   * 检查分块上传凭证有效期
   * @param fileUid 上传文件标识Uid
   * @param invalidCallback 凭证过期时回调
   * @param afterUpdate 更新凭证后回调
   */
  public async checkValid(
    fileId: string,
    invalidCallback?: () => void,
    afterUpdate?: () => void,
  ) {
    // 未初始化过实例则创建
    if (!this.uploadClients[fileId]) {
      await this.ossClient.debounceGetCredentialInfo();
      const newUploadClient = await this.createClient();
      this.uploadClients[fileId] = newUploadClient;
      return this.uploadClients[fileId];
    }
    // 有凭证存在，检查过期时间
    const now = new Date().getTime();
    // 提前更新Policy
    const expire =
      Number(
        new Date(this.ossClient.credentialInfo?.expiration || '').getTime(),
      ) - this.ossClient.refreshTokenTime;
    if (now > expire) {
      try {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            'sts credential is about to expire, applying for a new credential',
          );
        }
      } catch (error) {
        console.log('error: ', error);
      }
      invalidCallback?.();
      await this.ossClient.debounceGetCredentialInfo();
      const newUploadClient = await this.createClient();
      this.uploadClients[fileId] = newUploadClient;
      afterUpdate?.();
    }
    return this.uploadClients[fileId];
  }

  // 普通上传
  public async commonUpload(
    file: File,
    options?:
      | (Record<string, any> & {
          /**
           * 自定义名称或路径
           * @example /abc/def.txt
           */
          name?: string;
        })
      | undefined,
  ): Promise<any> {
    const fileId = (file as any).fileId;
    await this.checkValid(fileId);
    return new Promise((resolve, reject) => {
      const fileName = options?.name || file.name;
      this.uploadClients[fileId]
        .put(fileName, file, {
          ...this.commonUploadConfig,
        })
        .then((result: any) => {
          delete this.uploadClients[fileId];
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  // 分片上传
  public async multipartUpload(
    file: File,
    options?:
      | (MultipartUploadConfigType & {
          /**
           * 自定义名称或路径
           * @example /abc/def.txt
           */
          name?: string;
        })
      | undefined,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const fileId = (file as any).uid;
      const client = await this.checkValid(fileId);
      // 缓存分片检查点
      const defaultProgressHandle = (
        percent: number,
        checkpoint: any,
        response: any,
      ) => {
        this.onMultipartUploadProgress(fileId, checkpoint, resolve, reject);
        if (options?.progress) {
          options.progress(percent, checkpoint, response);
        }
      };
      this.multipartUploadConfig = Object.assign(
        {},
        this.multipartUploadConfig,
        options,
      );
      this.percents[fileId] = defaultProgressHandle;
      const fileName = options?.name || file.name;
      client
        .multipartUpload(fileName, file, {
          ...this.multipartUploadConfig,
          progress: defaultProgressHandle,
        })
        .then((result: any) => {
          resolve({
            ...result,
            uid: fileId,
          });
          this.clearTask(fileId);
        })
        .catch((err: any) => {
          if (err?.name !== 'cancel') {
            reject(err);
          }
        });
    });
  }

  // 断点续传
  public async resumeMultipartUpload(fileId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const currentCheckpoint = this.checkpoints[fileId];
      if (!currentCheckpoint) {
        reject(new Error('checkpoint is null'));
        return;
      }
      const { uploadId, file } = currentCheckpoint;
      this.uploadClients[fileId]
        .multipartUpload(uploadId, file, {
          parallel: this.multipartUploadConfig.parallel,
          partSize: this.multipartUploadConfig.partSize,
          progress: this.percents[fileId],
          checkpoint: currentCheckpoint,
        })
        .then((result: any) => {
          resolve({
            ...result,
            uid: fileId,
          });
          this.clearTask(fileId);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  // 分片上传进度改变回调
  public async onMultipartUploadProgress(
    fileId: string,
    checkpoint: any,
    success: any,
    fail: any,
  ) {
    this.checkpoints[fileId] = checkpoint;
    await this.checkValid(
      fileId,
      () => {
        this.uploadClients[fileId].cancel();
      },
      async () => {
        try {
          const result = this.resumeMultipartUpload(fileId);
          success({
            ...result,
            uid: fileId,
          });
        } catch (error) {
          fail(error);
        }
      },
    );
  }

  // 暂停上传
  public stop(fileId: string) {
    this.uploadClients[fileId]?.cancel();
  }

  // 清除任务
  public clearTask(fileId: string) {
    this.stop(fileId);
    delete this.percents[fileId];
    delete this.checkpoints[fileId];
    delete this.uploadClients[fileId];
  }
}

class OSSClient {
  /**
   * sts服务器credential
   */
  credentialInfo: CredentialInfoProps | undefined;
  /**
   * sts token request
   */
  request: () => Promise<CredentialInfoProps> | CredentialInfoProps;
  /**
   * 刷新credential的间隔，小于服务器expire时间
   * @default 1000 * 60 * 14
   */
  refreshTokenTime: number;

  private constructor(options: Partial<OSSClient> = {}) {
    if (!options.request) {
      throw new Error('credential request is required');
    }
    this.request = options.request;
    this.refreshTokenTime = options.refreshTokenTime || 1000 * 60 * 14;
  }

  static create(options: Partial<OSSClient> = {}) {
    const instance = new OSSClient(options);
    return new UploadClient(instance);
  }

  /**
   * 获取凭证
   */
  public async getCredentialInfo() {
      const res: CredentialInfoProps = await this.request();
      this.credentialInfo = res;
  }

  public debounceGetCredentialInfo = debounce(this.getCredentialInfo, 300);
}

export const create = OSSClient.create;

export default OSSClient;
