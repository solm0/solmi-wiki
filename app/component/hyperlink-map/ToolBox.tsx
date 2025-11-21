'use client'

import { Suspense, useEffect } from "react";
import { useToggleStore } from "@/app/lib/use-enabled";
import { pretendard } from "@/app/lib/localfont";
import clsx from "clsx";
import { Post } from "@/app/lib/type";
import GraphController from "./graph-controller";

export default function ToolBox({
  post
}: {
  post: Post;
}) {
  const initializeToggles = useToggleStore((s) => s.initializeToggles);

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const isEnabled = useToggleStore((s) => s.toggles['toolBox']);

  return (
    <aside className={clsx (
      `${pretendard.className} relative top-8 pb-8 md:flex flex-col gap-1 text-text-900 text-sm w-80 h-full transition-all duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)] z-10 hidden`,
      isEnabled ? 'translate-x-0' : 'translate-x-96',
    )}>
      {/* local graph */}
      <Suspense>
        <GraphController post={post} />
      </Suspense>

      {/* toc */}

      {/* music */}
    </aside>
  )
}