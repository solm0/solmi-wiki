import { NextResponse } from "next/server";
import {
  buildShopFontZip,
  filterDownloadableFonts,
} from "@/app/lib/server/shop-font-zip";

type RequestBody = {
  fileNames?: string[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody;
  const requestedFileNames = Array.isArray(body.fileNames) ? body.fileNames : [];
  const fileNames = filterDownloadableFonts(requestedFileNames);

  if (!fileNames.length) {
    return NextResponse.json(
      { message: "No fonts selected." },
      { status: 400 },
    );
  }

  const zipBuffer = await buildShopFontZip(fileNames);

  return new NextResponse(new Uint8Array(zipBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="solmi-fonts.zip"',
    },
  });
}
