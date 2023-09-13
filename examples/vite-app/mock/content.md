# LoftEditor

LoftEditor是一个基于react + antd + [tiptap](https://tiptap.dev/) 的所见即所得的兼容markdown的编辑器，专为创建程序、接口文档内容所开发。

- **所见即所得编辑**：实时预览 Markdown，自定义组件渲染结果，提供直观的编辑体验。
- **Slash 菜单**和 **Bubble 菜单**：通过 Slash 命令菜单和 Bubble 菜单访问常用的格式化选项和命令。
- **支持国际化**：可自定义语言

## 安装和使用

1. 安装依赖项。

```shell
npm install LoftEditor
```

2. 使用方法

```tsx
function App() {
  const content = JSON.parse(import.meta.env.VITE_CONTENT_STRING);
  const editorRef = useRef<LoftEditor>();

  useEffect(() => {
    // 禁止拼写检查
    const contentDOM = document.getElementById("content");
    contentDOM!.spellcheck = false;
  }, []);

  // 上传图片并返回url
  const onUploadImage: onUploadImageType = async (file: File) => {
    const res = await uploadImg(file.name, file);
    return {
      url: res.url,
    };
  };

  return (
    <div style={{ padding: 25 }}>
      <div id="content">
        <EditorRender
          content={content!}
          onReady={(editor) => {
            editorRef.current = editor;
          }}
          onUploadImage={onUploadImage}
        ></EditorRender>
      </div>
    </div>
  );
}

export default App;
```

## 示例

#### 图文示例

![20230817144208.jpg](https://dev-fe-pkg.oss-cn-hangzhou.aliyuncs.com/sl/wallpaper/1693290433756ECvA2Q1c.jpg "20230817144208.jpg")

### 表格示例

|                   |        |        |                                                                                                                                                                                                                                                               |
| ----------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **名称**            | **必填** | **类型** | **描述**                                                                                                                                                                                                                                                        |
| **Authorization** | ✅      | string | **tenant\_access\_token****值格式**："Bearer `access_token`"**示例值**："Bearer t-7f1bcd13fc57d46bac21793a18e560"[了解更多：如何选择与获取 access token](https://open.feishu.cn/document/uAjLw4CM/ugTN1YjL4UTN24CO1UjN/trouble-shooting/how-to-choose-which-type-of-token-to-use) |
| **Content-Type**  | -      | string | **固定值**："application/json; charset=utf-8"                                                                                                                                                                                                                     |