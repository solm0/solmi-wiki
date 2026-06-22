import JSZip from "jszip";
import { filterDownloadableFonts, readShopFontFiles } from "@/app/lib/server/shop-font-files";

export async function buildShopFontZip(fileNames: string[]) {
  const zip = new JSZip();
  const fontFiles = await readShopFontFiles(fileNames);

  fontFiles.forEach((fontFile) => {
    zip.file(fontFile.filename, fontFile.content);
  });

  return zip.generateAsync({ type: "nodebuffer" });
}

export { filterDownloadableFonts };
