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


      {/* 오른쪽 사이드바 */}
      <ToolBox allPlaylists={playlists} />
    </>
  )
}