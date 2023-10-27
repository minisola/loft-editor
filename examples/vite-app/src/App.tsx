import "../../../dist/css/style.css";
import { useRef } from "react";
import { Button, Input } from "antd";
import {
  EditorRender,
  LoftEditor,
  onUploadImageType,
  // useLoftEditor,
} from "../../../dist/esm";
import { uploadImg } from "./utils/uploadImg";
import "./index.css";
// import { enUS } from "../../../dist/esm/view/locale/lang";

function App() {
  const content = JSON.parse(import.meta.env.VITE_CONTENT_STRING);
  // const content = import.meta.env.VITE_CONTENT_HTML
  // const markdown = import.meta.env.VITE_CONTENT_MD;
  // const [innerHtml, setInnerHtml] = useState("");
  const editorRef = useRef<LoftEditor>();

  // 上传图片并返回url
  const onUploadImage: onUploadImageType = async (file: File) => {
    const res = await uploadImg(file.name, file);
    return {
      url: res.url,
    };
  };

  // 仅解析出html作为文本内容显示
  // useLoftEditor({
  //   content,
  //   onReady(editor) {
  //     setInnerHtml(editor.getHTML());
  //   },
  // });

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
      {/* <div className="loft-editor-content">
        <div
          className="ProseMirror"
          dangerouslySetInnerHTML={{ __html: innerHtml }}
        ></div>
      </div> */}
      <div id="content" spellCheck={false}>
        <EditorRender
          content={content!}
          // markdown={markdown}
          onReady={(editor) => {
            editorRef.current = editor;
          }}
          onUploadImage={onUploadImage}
          // onUpdate={(editor) => {
          // console.log(editor);
          // }}
          // locale={enUS}
          // showToolbar={false}
        ></EditorRender>
      </div>
    </div>
  );
}

export default App;
