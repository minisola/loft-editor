import { Button, Divider, Space } from "antd";
import { BubbleMenuProps } from "@tiptap/react";
import { Editor, isTextSelection } from "@tiptap/core";
import { InsertLink } from "./menus/InsertLink";
import { InsertTableButton } from "../Table";
import { LuCode, LuItalic, LuStrikethrough, LuTag } from "react-icons/lu";
import { BsTypeBold } from "react-icons/bs";
import { CommonBubbleMenu } from "./common/CommonBubbleMenu";
import { FontColor } from "./menus/FontColor";
import { IconButton } from "../../view/Button";

export type BubbleBtnExtensionProps = {
  editor: Editor;
};

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
    shouldShow: ({ editor, view, state, from, to }) => {
      // 图片、代码、无需弹出
      if (editor.isActive("image") || editor.isActive("codeBlock")) {
        return false;
      }
      const { doc, selection } = state;
      const { empty } = selection;

      const isEmptyTextBlock =
        !doc.textBetween(from, to).length && isTextSelection(state.selection);
      const hasEditorFocus = view.hasFocus();

      if (
        !hasEditorFocus ||
        empty ||
        isEmptyTextBlock ||
        !isTextSelection(state.selection) ||
        !editor.isEditable
      ) {
        return false;
      }

      const selectionContent = editor.view.state.selection.content();
      return selectionContent.size > 0;
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
    //   icon: (
    //     <span>
    //       <LuTag />
    //     </span>
    //   ),
    // },
    {
      name: "bold",
      isActive: () => props.editor.isActive("bold"),
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: (
        <BsTypeBold
          style={{
            fontSize: 16,
          }}
        />
      ),
    },
    {
      name: "italic",
      isActive: () => props.editor.isActive("italic"),
      command: () => props.editor.chain().focus().toggleItalic().run(),
      icon: <LuItalic />,
    },
    {
      name: "strike",
      isActive: () => props.editor.isActive("strike"),
      command: () => props.editor.chain().focus().toggleStrike().run(),
      icon: <LuStrikethrough />,
    },
    {
      name: "code",
      isActive: () => props.editor.isActive("code"),
      command: () => props.editor.chain().focus().toggleCode().run(),
      icon: <LuCode />,
    },
  ];

  return (
    <Space size={4}>
      {items.map((item) => {
        return (
          <IconButton
            key={item.name}
            type={item.isActive() ? "primary" : "text"}
            onClick={item.command}
            icon={item.icon}
          ></IconButton>
        );
      })}
      <Divider type="vertical" />
      <InsertLink editor={props.editor} />
      <FontColor editor={props.editor} />
      <InsertTableButton editor={props.editor} />
    </Space>
  );
}
