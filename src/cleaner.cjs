const fs = require("fs");
const path = require("path");

const exts = [".js", ".jsx", ".css"];

function removeComments(code) {
  let result = "";
  let inString = false;
  let stringChar = "";
  let inSingleComment = false;
  let inMultiComment = false;

  for (let i = 0; i < code.length; i++) {
    const curr = code[i];
    const next = code[i + 1];

    if (!inSingleComment && !inMultiComment) {
      if (!inString && (curr === '"' || curr === "'" || curr === "`")) {
        inString = true;
        stringChar = curr;
      } else if (inString && curr === stringChar && code[i - 1] !== "\\") {
        inString = false;
      }
    }

    if (inString) {
      result += curr;
      continue;
    }

    if (!inMultiComment && curr === "/" && next === "/") {
      inSingleComment = true;
      i++;
      continue;
    }

    if (!inSingleComment && curr === "/" && next === "*") {
      inMultiComment = true;
      i++;
      continue;
    }

    if (inSingleComment && curr === "\n") {
      inSingleComment = false;
      result += "\n";
      continue;
    }

    if (inMultiComment && curr === "*" && next === "/") {
      inMultiComment = false;
      i++;
      continue;
    }

    if (inSingleComment || inMultiComment) continue;

    result += curr;
  }

  return result;
}

function cleanBlankLines(code) {
  return code
    .split("\n")
    .reduce((acc, line) => {
      const isEmpty = line.trim() === "";
      const prevEmpty = acc.length && acc[acc.length - 1].trim() === "";

      if (isEmpty && prevEmpty) return acc;
      acc.push(line);
      return acc;
    }, [])
    .join("\n");
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  content = removeComments(content);
  content = cleanBlankLines(content);

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`✔ Cleaned: ${filePath}`);
}

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (exts.includes(path.extname(file))) {
      processFile(fullPath);
    }
  });
}

walk(".");