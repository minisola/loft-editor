import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {common, createLowlight} from 'lowlight'
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import shell from "highlight.js/lib/languages/shell";
import rust from "highlight.js/lib/languages/rust";
import java from "highlight.js/lib/languages/java";
import python from "highlight.js/lib/languages/python";
import objectivec from "highlight.js/lib/languages/objectivec";
import ruby from "highlight.js/lib/languages/ruby";
import csharp from "highlight.js/lib/languages/csharp";
import php from "highlight.js/lib/languages/php";
import go from "highlight.js/lib/languages/go";
import cpp from "highlight.js/lib/languages/cpp";

import { CodeToolbar } from "./CodeToolbar";
const lowlight = createLowlight(common)


lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("jsx", js);
lowlight.register("ts", ts);
lowlight.register("tsx", ts);
lowlight.register("shell", shell);
lowlight.register("rust", rust);
lowlight.register("java", java);
lowlight.register("go", go);
lowlight.register("python", python);
lowlight.register("objectivec", objectivec);
lowlight.register("ruby", ruby);
lowlight.register("csharp", csharp);
lowlight.register("php", php);
lowlight.register("c++", cpp);

export const CodeBlockExtension = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeToolbar);
  },
}).configure({ lowlight });
