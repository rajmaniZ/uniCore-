import fs from "fs";
import path from "path";

const input = fs.readFileSync("project.txt", "utf-8");

const files = input.split("

files.forEach((block) => {
  const match = block.match(/📁 (.+)/);

  if (match) {
    const filePath = match[1].trim();
    const content = block.split("\n").slice(2).join("\n");

    const fullPath = path.join(process.cwd(), filePath);

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);

    console.log("Created:", filePath);
  }
});