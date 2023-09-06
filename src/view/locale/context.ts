import { createContext } from "react";
import { LocaleConstKeyType } from "./lang/zh_CN";

export type Locale = {
  [x in LocaleConstKeyType]: Record<string, any>;
} & {
  locale: string;
};

export type LocaleKeyType = keyof Locale;

const LocaleContext = createContext<Locale | undefined>(undefined);

export default LocaleContext;
