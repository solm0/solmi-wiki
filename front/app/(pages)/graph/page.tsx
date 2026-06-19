import type { Metadata } from "next";
import GlobalGraphRenderer from "../../component/hyperlink-map/graph-global-renderer";
import { Suspense } from "react";
import BackButton from "../../component/atoms/back-button";
import ToolBox from "@/app/component/hyperlink-map/ToolBox";
import path from "path";
import fs from 'fs';

export const metadata: Metadata = {
  title: "Graph",
  description: "하이퍼링크 그래프",
};

export default async function GraphPage() {
  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
        <Suspense fallback={<div>로딩 중</div>}>
          <GlobalGraphRenderer />
          <BackButton />
        </Suspense>
      </div>

      <div className="relative gap-8 w-full pointer-events-none"></div>
      {/* 오른쪽 사이드바 */}
      <ToolBox allPlaylists={playlists} />
    </>
  )
}
