import { Code } from "lucide-react";
import { Button, Divider, Space, theme } from "antd";
import { BubbleMenu, BubbleMenuProps } from "@tiptap/react";
import {
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
} from "@radix-ui/react-icons";
import { Editor } from "@tiptap/core";
import BubbleItem from "./BubbleItem";
import { linkComps } from "./menus/link";
import { colorComps } from "./menus/color";
import { InsertTableButton } from "../table";

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: React.ReactNode;
}

export function EditorBubbleMenu(props: EditorBubbleMenuProps) {
  const { token } = theme.useToken();

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => {
      if (!editor.isEditable) {
        return false;
      }
      // 图片、代码无需弹出
      if (editor.isActive("image") || editor.isActive("codeBlock")) {
        return false;
      }
      return editor.view.state.selection.content().size > 0;
    },
    tippyOptions: {
      moveTransition: "transform 0.15s ease-out",
      onHidden: () => {
        // setLinkInputOpen(false);
      },
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      tippyOptions={{ maxWidth: "none", appendTo: "parent" }}
    >
      <div
        className="loft-editor-bubble-menu"
        style={{
          paddingTop: token.paddingXS,
          paddingBottom: token.paddingXS,
          paddingLeft: token.paddingSM,
          paddingRight: token.paddingSM,
          borderRadius: token.borderRadius,
          boxShadow: token.boxShadow,
          backgroundColor: token.colorBgElevated,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <InlineTools editor={props.editor} />
      </div>
    </BubbleMenu>
  );
}

export function InlineTools(props: { editor: Editor }) {
  const items: BubbleMenuItem[] = [
    // {
    //   name: "tag",
    //   isActive: () => false,
    //   command: () => {
    //     props.editor.chain().focus().toggleMarker({ class: "test-mark" }).run();
    //   },
    //   icon: <span style={{ fontWeight: 500 }}>TAG</span>,
    // },
    {
      name: "bold",
      isActive: () => props.editor.isActive("bold"),
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: <FontBoldIcon style={{ width: 14, height: 14 }} />,
    },
    {
      name: "italic",
      isActive: () => props.editor.isActive("italic"),
      command: () => props.editor.chain().focus().toggleItalic().run(),
      icon: <FontItalicIcon style={{ width: 14, height: 14 }} />,
    },
    {
      name: "strike",
      isActive: () => props.editor.isActive("strike"),
      command: () => props.editor.chain().focus().toggleStrike().run(),
      icon: <StrikethroughIcon />,
    },
    {
      name: "code",
      isActive: () => props.editor.isActive("code"),
      command: () => props.editor.chain().focus().toggleCode().run(),
      icon: <Code style={{ width: 14, height: 14 }} />,
    },
  ];

  return (
    <Space size={4}>
      {items.map((item) => {
        return (
          <Button
            className="loft-editor-icon-adapt"
            key={item.name}
            type={item.isActive() ? "primary" : "text"}
            onClick={item.command}
            icon={item.icon}
          ></Button>
        );
      })}
      <Divider type="vertical" />
      <BubbleItem comps={linkComps} props={props} />
      <BubbleItem comps={colorComps} props={props} />
      <InsertTableButton editor={props.editor}>
        <Button>表格</Button>
      </InsertTableButton>
    </Space>
  );
}
