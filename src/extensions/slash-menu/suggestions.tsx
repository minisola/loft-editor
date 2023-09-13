import { Range, Editor } from "@tiptap/react";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuList,
  LuListChecks,
  LuListOrdered,
  LuText,
  LuCode2,
  LuQuote,
  LuImage,
  LuTable,
} from "react-icons/lu";
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
  const suggestions = getDefaultSuggestions(locale);
  return suggestions.filter((item) => {
    if (isTableActive && item.searchTerms.includes("table")) {
      return false;
    }
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
      icon: <LuText />,
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
      icon: <LuListChecks />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: locale.heading1.title,
      searchTerms: ["title", "big", "large"],
      icon: <LuHeading1 />,
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
      icon: <LuHeading2 />,
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
      icon: <LuHeading3 />,
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
      icon: <LuList />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: locale.numberedList.title,
      searchTerms: ["ordered"],
      icon: <LuListOrdered />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: locale.quote.title,
      searchTerms: ["blockquote"],
      icon: <LuQuote />,
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
      icon: <LuCode2 />,
      command: ({ editor, range }: CommandProps) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: locale.image.title,
      searchTerms: ["photo", "picture", "media"],
      icon: <LuImage />,
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
      icon: <LuTable />,
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
