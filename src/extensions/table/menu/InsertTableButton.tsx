import React, { useRef, useState } from "react";
import { Editor } from "@tiptap/core";
import { TableGrid } from "../components/TableGrid";
import { LocaleStore } from "../../..";
import { LocaleValuesType } from "../../../view/locale/lang/zh_CN";
import { Button, Divider, Popover } from "antd";
import { LuTable } from "react-icons/lu";

export type InsertTableButtonProps = {
  editor: Editor;
};

export const InsertTableButton: React.FC<InsertTableButtonProps> = ({
  editor,
}) => {
  const isTableActive = editor.isActive("table");
  const locale = LocaleStore.get(editor, "table") as LocaleValuesType["table"];
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ rows: number; columns: number }>({
    rows: 0,
    columns: 0,
  });
  const [open, setOpen] = useState(false);

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
        open={isTableActive ? false : open}
        onOpenChange={setOpen}
        destroyTooltipOnHide={true}
        getPopupContainer={() => containerRef.current || document.body}
        align={{ offset: [8, 10] }}
        content={
          <div className="insert-table-popover">
            <div className="insert-table-popover-header">
              <span>{locale.toolPane.title}</span>
              <span className="insert-table-popover-size">
                {size.rows > 0 &&
                  size.columns > 0 &&
                  `${size.columns} x ${size.rows}`}
              </span>
            </div>
            <Divider
              style={{
                margin: "0 auto 6px",
              }}
            />
            <TableGrid
              rows={5}
              columns={5}
              onChange={(rows, columns) => setSize({ rows, columns })}
              onClick={() => {
                if (size.rows && size.columns) {
                  editor
                    ?.chain()
                    .focus()
                    .insertTable?.({
                      rows: size.rows,
                      cols: size.columns,
                      withHeaderRow: false,
                    })
                    .run();
                  setOpen(false);
                  setSize({ rows: 0, columns: 0 });
                }
              }}
            />
          </div>
        }
      >
        <Button
          disabled={isTableActive}
          type={"text"}
          className="loft-editor-icon-adapt"
          icon={<LuTable />}
        ></Button>
      </Popover>
    </div>
  );
};
