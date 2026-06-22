import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  filterDownloadableFonts,
  readShopFontFiles,
} from "@/app/lib/server/shop-font-files";

type RequestBody = {
  name?: string;
  email?: string;
  fileNames?: string[];
};

const senderEmail = "solmii.jeong@gmail.com";

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody;
  const name = body.name?.trim();
  const email = body.email?.trim();
  const requestedFileNames = Array.isArray(body.fileNames) ? body.fileNames : [];
  const fileNames = filterDownloadableFonts(requestedFileNames);
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM ?? "solmi.wiki <fonts@send.solmi.wiki>";

  if (!name || !email) {
    return NextResponse.json(
      { message: "Name and email are required." },
      { status: 400 },
    );
  }

  if (!fileNames.length) {
    return NextResponse.json(
      { message: "No fonts selected." },
      { status: 400 },
    );
  }

  if (!resendApiKey) {
    return NextResponse.json(
      { message: "Email transport is not configured." },
      { status: 500 },
    );
  }

  const resend = new Resend(resendApiKey);
  const attachments = await readShopFontFiles(fileNames);

  const { error } = await resend.emails.send({
    from: resendFrom,
    to: [email],
    replyTo: senderEmail,
    subject: "solmi.wiki 서체 배송",
    text: `${name}님 안녕하세요.\n주문하신 서체 파일을 보내드립니다.\nwww.solmi.wiki`,
    html: `<p>${name}님 안녕하세요.</p><p>주문하신 서체 파일을 보내드립니다.</p><p><a href="https://www.solmi.wiki">www.solmi.wiki</a></p>`,
    attachments,
  });

  if (error) {
    return NextResponse.json(
      { message: error.message || "메일 전송에 실패했습니다." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
