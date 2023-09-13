import * as fs from "fs";
import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

process.env.VITE_CONTENT_STRING = fs.readFileSync(
  path.join(__dirname, "./mock/content.json"),
  {
    encoding: "utf8",
  }
);
process.env.VITE_CONTENT_MD = fs.readFileSync(
  path.join(__dirname, "./mock/content.md"),
  {
    encoding: "utf8",
  }
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
  },
});
