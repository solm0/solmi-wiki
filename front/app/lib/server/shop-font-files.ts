import fs from "node:fs/promises";
import path from "node:path";
import { shopFonts } from "@/app/lib/data/shop-fonts";

const allowedFonts = new Map(
  shopFonts.map((font) => [font.fileName, font]),
);

export function filterDownloadableFonts(fileNames: string[]) {
  return fileNames.filter((fileName) => allowedFonts.has(fileName));
}

function getMimeType(fileName: string) {
  if (fileName.endsWith(".ttf")) return "font/ttf";
  if (fileName.endsWith(".otf")) return "font/otf";
  if (fileName.endsWith(".woff")) return "font/woff";
  if (fileName.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

export async function readShopFontFiles(fileNames: string[]) {
  return Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(process.cwd(), "public", "fonts", "shop", fileName);
      const content = await fs.readFile(filePath);

      return {
        filename: fileName,
        content,
        contentType: getMimeType(fileName),
      };
    }),
  );
}
