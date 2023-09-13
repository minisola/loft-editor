import React, { useCallback, useRef, useState } from "react";
import { sticky } from "tippy.js";
import { PluginKey } from "@tiptap/pm/state";
import { Editor, posToDOMRect } from "@tiptap/core";
import { BubbleMenuProps } from "@tiptap/react";
import {
  getCellsInColumn,
  getCellsInRow,
  getSelectedCells,
  isCellSelection,
  isColumnSelected,
  isRowSelected,
  isTableSelected,
} from "../utilities";
import {
  LuAlignCenter,
  LuAlignLeft,
  LuAlignRight,
  LuCopy,
  LuTrash2,
} from "react-icons/lu";
import { RiMergeCellsHorizontal, RiSplitCellsHorizontal } from "react-icons/ri";
import { AiOutlineDeleteColumn, AiOutlineDeleteRow } from "react-icons/ai";
import { TbCut } from "react-icons/tb";
import { Divider } from "antd";
import { CommonBubbleMenu } from "../../BubbleMenu/common/CommonBubbleMenu";
import { IconButton } from "../../../view/Button";
import { ExtensionDefaultProps } from "../../..";


export const tableCellBubbleMenuPluginKey = new PluginKey(
  "tableCellBubbleMenu"
);

export const TableCellBubbleMenu: React.FC<ExtensionDefaultProps> = ({
  editor,
}) => {
  const [selectedCells, setSelectedCells] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<{
    rowSelected: boolean;
    columnSelected: boolean;
    tableSelected: boolean;
  }>({
    rowSelected: false,
    columnSelected: false,
    tableSelected: false,
  });

  const selectedStateRef = useRef(selectedState);
  selectedStateRef.current = selectedState;

  const shouldShow = useCallback<any>(
    (props: { editor: Editor }) => {
      if (!props) {
        return false;
      }
      const { editor } = props;
      if (!editor.isEditable) {
        return false;
      }

      // selected row
      const cellsInColumn = getCellsInColumn(0)(editor.state.selection) || [];
      let rowIndex = 0;
      const cellRowIndexMap: number[] = [];
      cellsInColumn.forEach(({ node }) => {
        const rowspan = node!.attrs.rowspan || 1;
        cellRowIndexMap.push(rowIndex);
        rowIndex += rowspan;
      });
      const hasRowSelected = !!cellsInColumn.some((_cell, index) =>
        isRowSelected(cellRowIndexMap[index])(editor.state.selection)
      );
      // selected column
      const cellsInRow = getCellsInRow(0)(editor.state.selection) || [];
      let columnIndex = 0;
      const cellColumnIndexMap: number[] = [];
      cellsInRow.forEach(({ node }) => {
        const colspan = node!.attrs.colspan || 1;
        cellColumnIndexMap.push(columnIndex);
        columnIndex += colspan;
      });
      const hasColumnSelected = !!cellsInRow.some((_cell, index) =>
        isColumnSelected(cellColumnIndexMap[index])(editor.state.selection)
      );
      // selected table
      const hasTableSelected = isTableSelected(editor.state.selection);

      setSelectedState({
        rowSelected: hasRowSelected,
        columnSelected: hasColumnSelected,
        tableSelected: hasTableSelected,
      });

      // selected cells
      const cells = getSelectedCells(editor.state.selection);
      setSelectedCells(cells || []);

      return isCellSelection(editor.state.selection);
    },
    [editor]
  );

  if (!editor.state.schema.nodes.table) {
    return null;
  }

  const tippyOptions: BubbleMenuProps["tippyOptions"] = {
    plugins: [sticky],
    sticky: true,
    interactive: true,
    placement: "top",
    offset: () => {
      if (
        selectedStateRef &&
        (selectedStateRef.current.tableSelected ||
          selectedStateRef.current.columnSelected)
      ) {
        return [0, 16];
      }
      return [0, 8];
    },
    arrow: false,
    getReferenceClientRect: () => {
      const { state, view } = editor;
      const { from, to } = state.selection;
      const selectedCells = getSelectedCells(state.selection);
      let posFrom = from;
      let posTo = to;
      if (selectedCells?.length) {
        const firstCell = selectedCells[0];
        const lastCell = selectedCells[selectedCells.length - 1];
        posFrom = firstCell ? firstCell.pos : posFrom;
        posTo = lastCell
          ? lastCell.pos + (lastCell?.node?.nodeSize || 0)
          : posTo;
      }
      const node = view.nodeDOM(posFrom) as HTMLElement;
      if (
        node &&
        selectedStateRef.current &&
        (selectedStateRef.current.tableSelected ||
          selectedStateRef.current.rowSelected)
      ) {
        return node.getBoundingClientRect();
      }
      return posToDOMRect(view, posFrom, posTo);
    },
  };

  const selectedCellsCount = selectedCells?.length || 0;
  const canSplitCell = editor.can().splitCell?.();
  const canMergeCells = editor.can().mergeCells?.();

  const mergeOrSplitItems = ((selectedCellsCount > 1 && canMergeCells) ||
    canSplitCell) && (
    <IconButton
      onClick={() => editor.commands.mergeOrSplit()}
      icon={
        canSplitCell ? <RiSplitCellsHorizontal /> : <RiMergeCellsHorizontal />
      }
    ></IconButton>
  );

  const textAlignItems = (
    <>
      <IconButton
        onClick={() => (editor.commands as any).unsetTextAlign?.()}
        icon={<LuAlignLeft />}
      ></IconButton>
      <IconButton
        onClick={() => (editor.commands as any).setTextAlign?.("center")}
        icon={<LuAlignCenter />}
      ></IconButton>
      <IconButton
        onClick={() => (editor.commands as any).setTextAlign?.("right")}
        icon={<LuAlignRight />}
      ></IconButton>
    </>
  );

  let deleteButton = null;
  if (selectedState.tableSelected) {
    deleteButton = (
      <IconButton
        onClick={() => editor.commands.deleteTable()}
        icon={<LuTrash2 />}
      ></IconButton>
    );
  } else if (selectedState.rowSelected) {
    deleteButton = (
      <IconButton
        onClick={() => editor.commands.deleteRow()}
        icon={<AiOutlineDeleteRow />}
      ></IconButton>
    );
  } else if (selectedState.columnSelected) {
    deleteButton = (
      <IconButton
        onClick={() => editor.commands.deleteColumn()}
        icon={<AiOutlineDeleteColumn />}
      ></IconButton>
    );
  }

  const copyAndCutItems = (
    <>
      <IconButton
        onClick={() => document.execCommand("copy")}
        icon={<LuCopy />}
      ></IconButton>
      <IconButton
        onClick={() => {
          document.execCommand("cut");
          editor.commands.deleteTable();
          editor.commands.focus();
        }}
        icon={<TbCut />}
      ></IconButton>
    </>
  );

  return (
    <CommonBubbleMenu
      pluginKey={tableCellBubbleMenuPluginKey}
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={tippyOptions}
      updateDelay={0}
    >
      {selectedState.tableSelected ? (
        <>
          {copyAndCutItems}
          <Divider type="vertical" />
          {deleteButton}
        </>
      ) : (
        <>
          {mergeOrSplitItems}
          {mergeOrSplitItems && <Divider type="vertical" />}
          {textAlignItems}
          {deleteButton && <Divider type="vertical" />}
          {deleteButton}
        </>
      )}
    </CommonBubbleMenu>
  );
};
