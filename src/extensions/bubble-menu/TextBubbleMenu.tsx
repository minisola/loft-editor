import { Button, Divider, Space } from "antd";
import { BubbleMenuProps } from "@tiptap/react";
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
import { LuTable,LuCode } from "react-icons/lu";
import { CommonBubbleMenu } from "./common/CommonBubbleMenu";

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: React.ReactNode;
}

export function EditorBubbleMenu(props: EditorBubbleMenuProps) {
  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => {
      if (!editor.isEditable) {
        return false;
      }
      // 图片、代码、表格无需弹出
      if (
        editor.isActive("image") ||
        editor.isActive("codeBlock") ||
        editor.isActive("table")
      ) {
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
    <CommonBubbleMenu {...bubbleMenuProps}>
      <InlineTools editor={props.editor} />
    </CommonBubbleMenu>
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
      icon: <LuCode style={{ width: 14, height: 14 }} />,
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
        <Button
          type={"text"}
          className="loft-editor-icon-adapt"
          icon={<LuTable />}
        ></Button>
      </InsertTableButton>
    </Space>
  );
}
