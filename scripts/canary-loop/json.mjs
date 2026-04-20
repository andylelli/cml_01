import fs from "fs/promises";

const UTF8_BOM = "\uFEFF";

export function stripUtf8Bom(text) {
  if (typeof text !== "string") {
    return text;
  }
  return text.startsWith(UTF8_BOM) ? text.slice(1) : text;
}

export function parseJsonText(text) {
  return JSON.parse(stripUtf8Bom(text));
}

export async function readJsonIfPresent(filePath) {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return parseJsonText(text);
  } catch {
    return null;
  }
}
