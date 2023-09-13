import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Select } from "antd";
import { useCallback, useMemo } from "react";
import { LuChevronDown, LuCopy } from "react-icons/lu";
import { copyText } from "./utils";

export function CodeToolbar({ node, updateAttributes, extension }: any) {
  const {
    attrs: { language: defaultLanguage },
  } = node;

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
      <div
        className="code-block-copy"
        onClick={() => copyText(node.textContent)}
      >
        <LuCopy />
      </div>
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
        suffixIcon={<LuChevronDown />}
      />
    </NodeViewWrapper>
  );
}
