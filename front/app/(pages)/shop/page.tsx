import type { Metadata } from "next";
import { Post } from "@/app/lib/type";
import ToolBox from "@/app/component/hyperlink-map/ToolBox";
import path from "path";
import fs from 'fs';

export const metadata: Metadata = {
  title: "Shop",
  description: "상점",
};

type Data = {
  posts: Post[]
}

export default async function ShopPage() {

  
  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <div className="relative w-full pt-[40vh] pb-8 overflow-y-scroll focus:outline-hidden custom-scrollbar">
        <div className="flex gap-4">
          <div className="w-full h-80 bg-button-100 rounded-3xl p-7 text-text-800">뭔가를 팔 예정이다.</div>
        </div>
      </div>
      {/* 오른쪽 사이드바 */}
      <ToolBox allPlaylists={playlists} />
    </>
  )
}