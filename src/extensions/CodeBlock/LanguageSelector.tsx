import { ChevronDownIcon } from "@radix-ui/react-icons";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Select } from "antd";
import { useCallback, useMemo } from "react";

export function LanguageSelector({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}: any) {
  const languages = extension.options.lowlight.listLanguages() as string[];

  const options = useMemo(() => {
    return [
      { value: "", label: "-" },
      ...languages.map((language) => {
        return { value: language, label: language };
      }),
    ];
  }, [languages]);


  const filterOption = useCallback(
    (input: string, option?: { label: string; value: string }) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
    []
  );

  return (
    <NodeViewWrapper className="code-block">
      <pre>
        <NodeViewContent as="code" />
      </pre>

      <Select
        defaultValue={defaultLanguage}
        className="code-block-lang-select"
        style={{ width: 120 }}
        showSearch
        bordered={false}
        options={options}
        onChange={(language) => updateAttributes({ language })}
        filterOption={filterOption}
        suffixIcon={<ChevronDownIcon />}
      />
    </NodeViewWrapper>
  );
}
