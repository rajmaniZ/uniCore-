const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "");
const outputFile = "project-blueprint.txt";

// ✅ Only allow these files
const allowedExt = [".js", ".jsx", ".css", ".json"];

function readDirRecursive(dir) {
  let result = "";

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);

    // ❌ skip unwanted folders
    if (file === "node_modules" || file === ".git") return;

    if (fs.statSync(fullPath).isDirectory()) {
      result += readDirRecursive(fullPath);
    } else {
      const ext = path.extname(file);

      // ❌ skip images / binary
      if (!allowedExt.includes(ext)) return;

      try {
        const content = fs.readFileSync(fullPath, "utf-8");

        const relativePath = path.relative(__dirname, fullPath);

        result += `\n📁 ${relativePath}\n`;
        result += "--------------------------------\n";
        result += content + "\n\n";
      } catch (err) {
        console.log("Skipped:", file);
      }
    }
  });

  return result;
}

const finalOutput = readDirRecursive(rootDir);

fs.writeFileSync(outputFile, finalOutput, "utf-8");

console.log("✅ Full Blueprint Created Successfully!");