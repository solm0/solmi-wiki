import type { Metadata } from "next";
import ToolBox from "@/app/component/hyperlink-map/ToolBox";
import path from "path";
import fs from 'fs';
import FontShopClient from "@/app/component/shop/FontShopClient";
import { shopFonts } from "@/app/lib/data/shop-fonts";

export const metadata: Metadata = {
  title: "Shop",
  description: "가판대",
};

export default async function ShopPage() {
  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <div className="relative w-full pt-[40vh] pb-8 overflow-y-scroll focus:outline-hidden custom-scrollbar">
        <FontShopClient fonts={shopFonts} />
      </div>
      
      {/* 오른쪽 사이드바 */}
      <ToolBox allPlaylists={playlists} />
    </>
  )
}
