import { Editor } from "@tiptap/core";
import { Locale, LocaleKeyType } from "./view/locale/context";
import localeValues, { LocaleValuesType } from "./view/locale/lang/zh_CN";

export type onUploadImageType = (
  file: File,
  editor: Editor
) => Promise<{
  url: string;
  name?: string;
  title?: string;
}>;

export class UploadImageHandler {
  static EDITOR_TO_HANDLER = new WeakMap<
    Editor,
    onUploadImageType | undefined
  >();

  static set(editor: Editor, handler?: onUploadImageType) {
    UploadImageHandler.EDITOR_TO_HANDLER.set(editor, handler);
  }

  static get(editor: Editor) {
    return UploadImageHandler.EDITOR_TO_HANDLER.get(editor);
  }
}

export class LocaleStore {
  static LOCALE = new WeakMap<Editor, Locale | undefined>();

  static set(editor: Editor, locale?: Locale) {
    LocaleStore.LOCALE.set(editor, locale);
  }

  static get(editor: Editor, moduleName?: LocaleKeyType) {
    const module = moduleName || "global";
    let locale = LocaleStore.LOCALE.get(editor) as LocaleValuesType;
    if (locale) {
      locale = localeValues;
    }
    if (moduleName) {
      const moduleJson = locale?.[module];
      return moduleJson;
    }
    return locale;
  }
}
