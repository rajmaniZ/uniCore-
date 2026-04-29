import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import generate from "@babel/generator";

const ROOT_DIR = process.cwd();

const IGNORE = ["node_modules", ".env", ".git", "dist", "build"];
const VALID_EXT = [".js", ".jsx", ".css", ".module.css"];

const removeJSComments = (content) => {
  try {
    const ast = parse(content, {
      sourceType: "module",
      plugins: ["jsx"],
      attachComment: false,
    });

    return generate(ast, { comments: false }).code;
  } catch (err) {
    console.warn("⚠ Skipping (parse error)");
    return content;
  }
};

const removeCSSComments = (content) => {
  // Safe enough for CSS
  return content.replace(/\/\*[\s\S]*?\*\//g, "");
};

const processDirectory = (dir) => {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);

    if (IGNORE.some((ignore) => fullPath.includes(ignore))) return;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else {
      const ext = path.extname(fullPath);

      if (VALID_EXT.includes(ext)) {
        try {
          const original = fs.readFileSync(fullPath, "utf-8");

          let cleaned = original;

          if (ext === ".js" || ext === ".jsx") {
            cleaned = removeJSComments(original);
          } else {
            cleaned = removeCSSComments(original);
          }

          if (original !== cleaned) {
            fs.writeFileSync(fullPath, cleaned, "utf-8");
            console.log(`✔ Cleaned: ${fullPath}`);
          }
        } catch (err) {
          console.error(`❌ Error processing: ${fullPath}`, err.message);
        }
      }
    }
  });
};

console.log("🚀 Cleaning started...\n");

processDirectory(ROOT_DIR);

console.log("\n✅ All JS / JSX / CSS files cleaned safely!");