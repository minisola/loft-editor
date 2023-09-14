import { Input, InputRef, Popover } from "antd";
import { useRef, useState } from "react";
import { LocaleStore } from "../../../cacheStore";
import { LocaleValuesType } from "../../../view/locale/lang/zh_CN";
import { IconButton } from "../../../view/Button";
import { BubbleBtnExtensionProps } from "../TextBubbleMenu";
import { LuLink, LuTrash } from "react-icons/lu";

export const InsertLink: React.FC<BubbleBtnExtensionProps> = ({ editor }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = LocaleStore.get(editor, "link") as LocaleValuesType["link"];
  const linkInputRef = useRef<InputRef>(null);

  return (
    <div
      ref={containerRef}
      style={{ display: "inline-flex" }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Popover
        arrow={false}
        placement="bottom"
        open={open}
        onOpenChange={setOpen}
        destroyTooltipOnHide={true}
        getPopupContainer={() => containerRef.current || document.body}
        align={{ offset: [8, 10] }}
        content={
          <div style={{ width: 300 }}>
            <Input
              ref={linkInputRef}
              defaultValue={editor.getAttributes("link").href || ""}
              onClick={() => linkInputRef.current?.focus()}
              placeholder={locale.insert.title}
              onPressEnter={(e) => {
                if (e.currentTarget.value.trim()) {
                  const url = e.currentTarget.value;
                  editor.chain().focus().setLink({ href: url }).run();
                  setOpen(false);
                } else {
                  e.currentTarget.value = "";
                  editor.chain().focus().unsetLink().run();
                }
              }}
              addonAfter={
                <LuTrash
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    setOpen(false);
                  }}
                />
              }
            />
          </div>
        }
      >
        <IconButton
          type={editor.isActive("link") ? "primary" : "text"}
          icon={<LuLink />}
        ></IconButton>
      </Popover>
    </div>
  );
};
