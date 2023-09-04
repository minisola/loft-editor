import { Link1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Input, InputRef } from "antd";
import { useRef } from "react";
import { IBubbleCompsProps } from "../types";

export const linkComps: IBubbleCompsProps = (props, setOpen) => {
  const linkInputRef = useRef<InputRef>(null);
  const link = {
    name: "link",
    isActive: () => props.editor.isActive("link"),
    command: (href: string) =>
      props.editor.chain().focus().setLink({ href }).run(),
    icon: (
      <Link1Icon
        style={{
          width: 14,
          height: 14,
        }}
      />
    ),
  };

  const linkInput = (
    <div style={{ width: 300 }}>
      <Input
        ref={linkInputRef}
        defaultValue={props.editor.getAttributes("link").href || ""}
        onClick={() => linkInputRef.current?.focus()}
        placeholder="Insert Link"
        onPressEnter={(e) => {
          if (e.currentTarget.value.trim()) {
            const url = e.currentTarget.value;

            link.command(url);
            setOpen(false);
          } else {
            e.currentTarget.value = "";
            props.editor.chain().focus().unsetLink().run();
          }
        }}
        addonAfter={
          <TrashIcon
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              props.editor.chain().focus().unsetLink().run();
              setOpen(false);
            }}
          />
        }
      />
    </div>
  );

  return { obj: link, boxContent: linkInput };
};
