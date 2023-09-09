import "../../../dist/style.css";
import { useEffect, useRef } from "react";
import { Button } from "antd";
import { EditorRender, LoftEditor, onUploadImageType } from "../../../dist/esm";
import { uploadImg } from "./utils/uploadImg";
import "./index.css";
// import { enUS } from "../../../dist/esm/view/locale/lang";

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
      <div>
        <Button
          onClick={() => {
            const json = editorRef.current!.getJSON();
            console.log(".json: ", json);
          }}
        >
          获得JSON
        </Button>
        <Button
          onClick={() => {
            console.log(".md: ", editorRef.current?.getMarkdown());
          }}
        >
          获得markdown
        </Button>
        <Button
          onClick={() => {
            editorRef.current?.setEditable(false);
          }}
        >
          只读
        </Button>
      </div>
      <div id="content">
        <EditorRender
          content={content!}
          onReady={(editor) => {
            editorRef.current = editor;
          }}
          onUploadImage={onUploadImage}
          onUpdate={(editor) => {
            // console.log(editor);
          }}
          // locale={enUS}
          showToolbar={false}
          showOutline={false}
        ></EditorRender>
      </div>
    </div>
  );
}

export default App;
