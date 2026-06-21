import type { Metadata } from "next";
import ToolBox from "@/app/component/hyperlink-map/ToolBox";
import path from "path";
import fs from 'fs';

export const metadata: Metadata = {
  title: "Inquiry",
  description: "작업 문의",
};

export default async function InquiryPage() {
  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <div className="relative w-full pt-[40vh] pb-8 overflow-y-scroll focus:outline-hidden custom-scrollbar">
        준비 중...
      </div>
      {/* 오른쪽 사이드바 */}
      <ToolBox allPlaylists={playlists} />
    </>
  )
}
