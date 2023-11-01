import TiptapTaskItem from "@tiptap/extension-task-item";
import TiptapTaskList from "@tiptap/extension-task-list";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";

import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Code } from "@tiptap/extension-code";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Heading } from "@tiptap/extension-heading";
import { History } from "@tiptap/extension-history";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Italic } from "@tiptap/extension-italic";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Strike } from "@tiptap/extension-strike";
import { Text } from "@tiptap/extension-text";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Marker from "@yaskevich/extension-marker";
import { TextAlign } from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";

import { CodeBlockExtension } from "./CodeBlock";
import { MarkdownExtension } from "./Markdown";
import { LocaleValuesType } from "../view/locale/lang/zh_CN";
import { LocaleStore } from "../cacheStore";
import { Image } from "./Image";
import { Table, TableRow, TableCell } from "./Table";

const TaskList = TiptapTaskList.extend({
  parseHTML() {
    return [
      {
        tag: `ul[data-type="${this.name}"]`,
        priority: 51,
      },
      {
        tag: "ul.contains-task-list",
        priority: 51,
      },
    ];
  },
});

const TaskItem = TiptapTaskItem.extend({
  addAttributes() {
    return {
      checked: {
        default: false,
        parseHTML: (element) =>
          element
            .querySelector('input[type="checkbox"]')
            ?.hasAttribute("checked"),
        renderHTML: (attributes) => ({
          "data-checked": attributes.checked,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `li[data-type="${this.name}"]`,
        priority: 51,
      },
      {
        tag: `li.task-list-item`,
        priority: 51,
      },
    ];
  },
});

Color.configure({
  types: ["textStyle"],
});

const tableCellContent = [
  "paragraph",
  "blockquote",
  "horizontalRule",
  "list",
  "codeBlock",
  "image",
];

const TableCellExtension = TableCell.extend({
  content: `(${tableCellContent.join(" | ")})+`,
});

export const defaultTiptapExtensions = [
  MarkdownExtension,
  Highlight.configure({ multicolor: true }),
  Typography,
  TaskList.configure({
    HTMLAttributes: {
      class: "contains-task-list",
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: "task-list-item",
    },
    nested: true,
  }),
  Placeholder.configure({
    placeholder: ({ node, editor }) => {
      const locale = LocaleStore.get(
        editor,
        "placeholder"
      ) as LocaleValuesType["placeholder"];

      if (node.type.name === "heading") {
        return `${locale.heading.title} ${node.attrs.level}`;
      }
      return locale.quickMenu.title;
    },
    includeChildren: true,
  }),
  CharacterCount,
  Image,
  Link,
  CodeBlockExtension,
  Blockquote,
  Bold,
  BulletList,
  Code,
  Document,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Heading,
  History,
  HorizontalRule,
  Italic,
  ListItem,
  OrderedList,
  Paragraph,
  Strike,
  Text,
  TextStyle,
  Color,
  Marker,
  Table,
  TableRow,
  TableCellExtension,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];
