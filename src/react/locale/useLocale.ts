import { useContext } from "react";
import LocaleContext from "./context";

const useLocale = () => {
  const locale = useContext(LocaleContext);
  return [locale?.global, locale];
};

export default useLocale;
