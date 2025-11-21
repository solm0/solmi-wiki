'use client'

import { Suspense, useEffect } from "react";
import { useToggleStore } from "@/app/lib/use-enabled";
import { pretendard } from "@/app/lib/localfont";
import clsx from "clsx";
import { Post } from "@/app/lib/type";
import GraphController from "./graph-controller";
import { Link2, X, TableOfContents } from "lucide-react";
import Toc from "../toc";
import GoToTop from "../go-to-top";

export function ToolComponents({
  icon,
  cmp,
  children
}: {
  icon?: React.ReactNode,
  cmp: {value?: string, name: string},
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-1 w-full items-start select-none'>
      <label
        className='flex items-center gap-2 text-text-800 w-full h-auto'
        htmlFor={`${cmp.value}-input`}
      >
        {icon}
        {cmp.name}

        {/* 닫기버튼 */}
        <button
          className="ml-auto h-6 w-6 rounded-sm hover:bg-button-100 flex items-center justify-center transition-colors duration-300"
          onClick={() => {}}
        >
          <X className='w-4 h-4'/>
        </button>
      </label>
      {children}
    </div>
  )
}

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
      `${pretendard.className} relative top-8 pb-8 md:flex flex-col gap-8 text-text-900 text-sm w-80 h-full transition-all duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)] z-10 hidden`,
      isEnabled ? 'translate-x-0' : 'translate-x-96',
    )}>
      {/* local graph */}
      <ToolComponents
        icon={<Link2 className='w-4 h-4' />}
        cmp={{ value: 'tag', name: '로컬 그래프' }}
      >
        <Suspense>
          <GraphController post={post} />
        </Suspense>
      </ToolComponents>

      {/* toc */}
      <ToolComponents
        icon={<TableOfContents className='w-4 h-4' />}
        cmp={{ value: 'toc', name: '목차' }}
      >
        <GoToTop title={post.title} />
        <Toc post={post} />
      </ToolComponents>

      {/* music */}
    </aside>
  )
}