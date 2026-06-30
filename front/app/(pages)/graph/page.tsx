import type { Metadata } from "next";
import GlobalGraphRenderer from "../../component/hyperlink-map/graph-global-renderer";
import { Suspense } from "react";
import BackButton from "../../component/atoms/back-button";
import ToolBox from "@/app/component/hyperlink-map/ToolBox";

export const metadata: Metadata = {
  title: "Graph",
  description: "하이퍼링크 그래프",
};

export default async function GraphPage() {
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
      <ToolBox />
    </>
  )
}
