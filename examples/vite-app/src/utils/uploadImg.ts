import { create } from "./oss";

const getUploadCredential = async ({ filename }: { filename: string }) => {
  return new Promise((resolve) => {
    fetch(
      `${import.meta.env.VITE_API_IMG_UPLOADER_STS}?type=3&filename=${filename}`,
      {
        mode: "cors",
        method: "GET",
        credentials: "include", // 默认请求是否带上cookie
      }
    ).then((res) => {
      resolve(res.json());
    });
  });
};

export const uploadImg = async (filename: string, file: File) => {
  const res = (await getUploadCredential({
    filename,
  })) as any;

  const clientOptions = {
    accessKeyId: res.data.accessKeyId,
    accessKeySecret: res.data.accessKeySecret,
    expiration: res.data.expiration,
    securityToken: res.data.securityToken,
    bucket: res.data.bucket,
    region: res.data.region,
  };
  const client = create({
    request: () => clientOptions,
  });
  const uploadRes = await client.commonUpload(file, {
    name: res.data.filename,
  });
  return uploadRes;
};
