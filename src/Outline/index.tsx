import { useEffect, useState } from "react";

interface IJsonProps {
  type: string;
  text?: string;
  attrs: { level: number };
  content: IJsonProps[];
}

type IProcessedJsonProps = Omit<IJsonProps, "content"> & { content: string };

interface IOutlineProps {
  data: {
    content: IJsonProps[];
  };
}

const Outline: React.FC<IOutlineProps> = ({ data }) => {
  const originContent: IJsonProps[] = data.content.filter(
    (ele: IJsonProps) => ele.type === "heading"
  );

  // 这里为了不影响原数据的content，做成简单的浅拷贝了
  const content: IProcessedJsonProps[] = originContent.map((e) => {
    return {
      type: e.type,
      attrs: e.attrs,
      content: e.content.reduce((a, b) => b.text + a, ""),
    };
  });

  const [currentKey, setCurrentKey] = useState(content[0].content + "@" + 0);

  const handleClick = (i: number) => {
    const heading = document.querySelectorAll("h1, h2, h3")[i];
    heading.scrollIntoView();
  };

  function throttle(fn: () => void, delay: number) {
    let timer: NodeJS.Timeout | null;
    return function () {
      if (timer) return;
      timer = setTimeout(function () {
        timer = null;
        fn();
      }, delay);
    };
  }

  // 找到第一个top大于0的heading, 选取其前一个heading作为currentKey
  const handleScroll = () => {
    let prevHTML: string = "";
    const headings = document.querySelectorAll("h1, h2, h3");
    for (let i = 0; i < headings.length; i++) {
      const HTMLEle = headings[i];
      const top = HTMLEle.getBoundingClientRect().top;
      if (i === 0 && top > 0) {
        setCurrentKey(HTMLEle.innerHTML + "@" + i);
        return;
      }
      if (top > 0) {
        setCurrentKey(prevHTML + "@" + (i - 1));
        return;
      }
      prevHTML = HTMLEle.innerHTML;
    }
  };

  useEffect(() => {
    const scrollEvent = throttle(handleScroll, 100);
    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        right: "6px",
        zIndex: 10000,
        top: "50%",
        transform: "translateY(-50%)",
        borderRadius: "5px",
        boxShadow: "0 0 10px 4px #e5e7eb",
        overflow: "auto",
        backgroundColor: "white",
        padding: "12px",
      }}
    >
      {content.map((ele, i) => {
        const key = ele.content + "@" + i;
        return (
          <div
            style={{
              marginLeft: (ele.attrs.level - 1) * 20,
              color: key === currentKey ? "#1677ff" : "",
              cursor: "pointer",
            }}
            onClick={() => handleClick(i)}
            key={key}
          >
            {ele.content}
          </div>
        );
      })}
    </div>
  );
};

export default Outline;
