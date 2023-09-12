import { Range, Editor } from "@tiptap/react";
import {
  BorderTopIcon,
  BorderBottomIcon,
  BorderLeftIcon,
  DividerVerticalIcon,
  DividerHorizontalIcon,
  BorderRightIcon,
} from "@radix-ui/react-icons";
import {
  Heading1,
  Heading2,
  Heading3,
  ListIcon,
  ListChecksIcon,
  ListOrderedIcon,
  TextIcon,
  Code2Icon,
  QuoteIcon,
  ImageIcon,
  TableIcon,
} from "lucide-react";
import { LocaleStore, UploadImageHandler } from "../../cacheStore";
import { EditorModifier } from "../../modifier";
import { SuggestionOptions } from "@tiptap/suggestion";
import { LocaleValuesType } from "../../view/locale/lang/zh_CN";

interface CommandProps {
  editor: Editor;
  range: Range;
}

type GetSuggestionItems = NonNullable<SuggestionOptions["items"]>;
type SuggestionItem = {
  title: string;
  searchTerms: string[];
  icon: React.ReactNode;
  command: ({ editor, range }: CommandProps) => void;
};

type SuggestionLocale = LocaleValuesType["slashSuggestion"];

export const getSuggestionItems: GetSuggestionItems = ({ query, editor }) => {
  const locale = LocaleStore.get(editor, "slashSuggestion") as SuggestionLocale;
  const isTableActive = editor.isActive("table");
  const suggestions = isTableActive
    ? getTableSuggestions(locale)
    : getDefaultSuggestions(locale);

  return suggestions.filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        (item.searchTerms &&
          item.searchTerms.some((term: string) => term.includes(search)))
      );
    }
    return true;
  });
};

const getDefaultSuggestions = (locale: SuggestionLocale): SuggestionItem[] => {
  return [
    {
      title: locale.text.title,
      searchTerms: ["p", "paragraph"],
      icon: <TextIcon />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .run();
      },
    },
    {
      title: locale.todo.title,
      searchTerms: ["todo", "task", "list", "check", "checkbox"],
      icon: <ListChecksIcon />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: locale.heading1.title,
      searchTerms: ["title", "big", "large"],
      icon: <Heading1 />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: locale.heading2.title,
      searchTerms: ["subtitle", "medium"],
      icon: <Heading2 />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: locale.heading3.title,
      searchTerms: ["subtitle", "small"],
      icon: <Heading3 />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
    },
    {
      title: locale.bulletList.title,
      searchTerms: ["unordered", "point"],
      icon: <ListIcon />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: locale.numberedList.title,
      searchTerms: ["ordered"],
      icon: <ListOrderedIcon />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: locale.quote.title,
      searchTerms: ["blockquote"],
      icon: <QuoteIcon />,
      command: ({ editor, range }: CommandProps) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
    },
    {
      title: locale.code.title,
      searchTerms: ["codeblock"],
      icon: <Code2Icon />,
      command: ({ editor, range }: CommandProps) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: locale.image.title,
      searchTerms: ["photo", "picture", "media"],
      icon: <ImageIcon />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();

        // upload image
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (event) => {
          const file = input.files?.[0];
          const uploader = UploadImageHandler.get(editor);
          if (file && uploader) {
            const { url, title, name } = await uploader(file, editor);
            EditorModifier.insertImage(
              editor,
              {
                url,
                title: title || file.name,
                alt: name || file.name,
              },
              event
            );
          }
        };
        input.click();
      },
    },
    {
      title: locale.table.title,
      searchTerms: ["table"],
      icon: <TableIcon />,
      command: ({ editor, range }: CommandProps) =>
        editor
          ?.chain()
          .focus()
          .deleteRange(range)
          .insertTable?.({
            rows: 2,
            cols: 2,
            withHeaderRow: false,
          })
          .run(),
    },
  ];
};

const getTableSuggestions = (locale: SuggestionLocale): SuggestionItem[] => {
  return [
    {
      title: locale.addRowAfter.title,
      searchTerms: ["row", "add", "after"],
      command: ({ editor }) => {
        editor.chain().focus().addRowAfter().run();
      },
      icon: <BorderBottomIcon style={{ width: 14, height: 14 }} />,
    },
    {
      title: locale.addRowBefore.title,
      searchTerms: ["row", "add", "before"],
      command: ({ editor }) => {
        editor.chain().focus().addRowBefore().run();
      },
      icon: <BorderTopIcon style={{ width: 14, height: 14 }} />,
    },
    {
      title: locale.addColAfter.title,
      searchTerms: ["col", "add", "after"],
      command: ({ editor }) => {
        editor.chain().focus().addColumnAfter().run();
      },
      icon: <BorderRightIcon style={{ width: 14, height: 14 }} />,
    },
    {
      title: locale.addColBefore.title,
      searchTerms: ["col", "add", "before"],
      command: ({ editor }) => {
        editor.chain().focus().addColumnBefore().run();
      },
      icon: <BorderLeftIcon style={{ width: 14, height: 14 }} />,
    },
    {
      title: locale.deleteRow.title,
      searchTerms: ["row", "delete"],
      command: ({ editor }) => {
        editor.chain().focus().deleteRow().run();
      },
      icon: <DividerHorizontalIcon style={{ width: 14, height: 14 }} />,
    },
    {
      title: locale.deleteCol.title,
      searchTerms: ["col", "delete"],
      command: ({ editor }) => {
        editor.chain().focus().deleteColumn().run();
      },
      icon: <DividerVerticalIcon style={{ width: 14, height: 14 }} />,
    },
  ];
};
