import { Editor } from "@tiptap/core";
import { theme } from "antd";
import { InlineTools } from "./extensions/bubble-menu";

export type ToolbarProps = React.PropsWithChildren<{
  editor: Editor;
}>;

export function Toolbar(props: ToolbarProps) {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: token.borderRadius,
        padding: token.paddingXS,
        backgroundColor: token.colorBgElevated,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <InlineTools editor={props.editor} />
      </div>
    </div>
  );
}
