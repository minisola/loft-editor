import * as React from "react";
import type { Locale } from "./context";
import LocaleContext from "./context";
import localeValues from "./default";

const LocaleProvider: React.FC<{
  locale?: Locale;
  children?: React.ReactNode;
}> = (props) => {
  const { locale, children } = props;

  const getMemoizedContextValue = React.useMemo<Locale>(() => {
    if (!locale) {
      return {
        ...localeValues,
      };
    }
    return locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={getMemoizedContextValue}>
      {children}
    </LocaleContext.Provider>
  );
};

export default LocaleProvider;
