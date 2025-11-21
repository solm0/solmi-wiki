'use client'

import { Suspense, useEffect } from "react";
import { useToggleStore } from "@/app/lib/use-enabled";
import { pretendard } from "@/app/lib/localfont";
import clsx from "clsx";
import { Post } from "@/app/lib/type";
import GraphController from "./graph-controller";
import { Link2, X, TableOfContents, ChevronRight, Music2, SettingsIcon, Earth } from "lucide-react";
import Toc from "../toc";
import GoToTop from "../go-to-top";
import ExpandButton from "../atoms/expand-button";
import ThemeButton from "../atoms/theme-button";

export function ToolComponents({
  isEnabled, icon, cmp, children, setIsEnabled,
}: {
  isEnabled: boolean,
  icon?: React.ReactNode,
  cmp: {value: string, name: string},
  children: React.ReactNode;
  setIsEnabled: (tool: string, isEnabled: boolean) => void;
}) {
  if (!isEnabled) return null;

  else return (
    <div className='flex flex-col gap-1 w-full max-w-80 items-start select-none pointer-events-auto'>
      <label
        className='flex items-center gap-2 text-text-800 w-full h-auto'
        htmlFor={`${cmp.value}-input`}
      >
        {icon}
        {cmp.name}

        {/* 닫기버튼 */}
        <button
          className="ml-auto h-6 w-6 rounded-sm hover:bg-button-100 flex items-center justify-center transition-colors duration-300"
          onClick={() => setIsEnabled(cmp.value, false)}
        >
          <X className='w-4 h-4'/>
        </button>
      </label>
      {children}
    </div>
  )
}

export const tools = [
  { value: 'graph', name: '로컬 그래프' },
  { value: 'toc', name: '목차' },
  { value: 'music', name: '음악'},
  { value: 'map', name: '지도'},
]

export default function ToolBox({
  post
}: {
  post: Post;
}) {
  const initializeToggles = useToggleStore((s) => s.initializeToggles);

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const isOpen = useToggleStore((s) => s.toggles['toolBox']);
  const setIsEnabled = useToggleStore((s) => s.setToggle);
  const isEnabled = useToggleStore((s) => s.toggles);

  return (
    <>
      {/* 배경 */}
      {isOpen &&
        <div className='fixed top-0 left-0 w-screen h-screen z-60 opacity-50 bg-text-600 block md:hidden'></div>
      }

      {/* 설정 */}
      <div className="fixed top-3 right-4 scale-120 md:scale-100 origin-top-right md:top-1 md:right-6 z-70 w-8">
        {isOpen &&
          <ExpandButton name={<SettingsIcon className="w-4 h-4 shrink-0"/>}>

            {/* theme */}
            <ThemeButton />

            {/* tools */}
            {tools.map((tool, i) => 
              <div key={i} className="flex gap-2 leading-5 text-text-900 items-center">
                <button
                  className="rounded-full w-4 h-4 border border-text-600 hover:border-text-700 p-0.5"
                  onClick={() => setIsEnabled(tool.value, !isEnabled[tool.value])}
                >
                  {isEnabled[tool.value] &&
                    <div className="w-full h-full bg-green-400 rounded-full" />
                  }
                </button>
                <span>{tool.name}</span>
              </div>
            )}
          </ExpandButton>
        }
      </div>

      <aside className={clsx (
        `${pretendard.className}
        absolute md:relative right-0 md:right-auto z-60 pointer-events-none h-full flex flex-col pt-0 md:pt-8 items-start text-sm gap-8 text-text-900 w-80 transition-all duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)] shrink-0 overflow-y-scroll scrollbar-hide`,
        isOpen ? 'w-[calc(100%-3rem)] md:w-80 border-l border-text-600 md:border-0 translate-x-0 opacity-100 bg-background md:bg-transparent pointer-events-auto flex px-4 md:px-0' : 'w-0 md:w-20 translate-x-88 opacity-0 pointer-events-none flex'
      )}>
        {/* 작은화면 창닫기 */}
        <div
          onClick={() => setIsEnabled('toolBox', false)}
          className='flex md:hidden w-full h-8 shrink-0 mt-4'
        >
          <button className='mr-auto w-8 h-8 hover:text-text-700 pointer-events-auto transition-colors duration-200 bg-transparent hover:bg-button-100 rounded-sm flex items-center justify-center'>
            <ChevronRight />
          </button>
        </div>

        {/* local graph */}
        <ToolComponents
          isEnabled={isEnabled[tools[0].value]}
          icon={<Link2 className='w-4 h-4' />}
          cmp={tools[0]}
          setIsEnabled={setIsEnabled}
        >
          <Suspense>
            <GraphController post={post} />
          </Suspense>
        </ToolComponents>

        {/* toc */}
        <ToolComponents
          isEnabled={isEnabled[tools[1].value]}
          icon={<TableOfContents className='w-4 h-4' />}
          cmp={tools[1]}
          setIsEnabled={setIsEnabled}
        >
          <GoToTop title={post.title} />
          <Suspense>
            <Toc post={post} />
          </Suspense>
        </ToolComponents>

        {/* music */}
        <ToolComponents
          isEnabled={isEnabled[tools[2].value]}
          icon={<Music2 className='w-4 h-4'/>}
          cmp={tools[2]}
          setIsEnabled={setIsEnabled}
        >
          <div className="w-full h-auto p-4 bg-button-100 flex flex-col gap-4 rounded-sm">
            <div className="flex flex-col gap-1 items-center">
              <p className="opacity-60">이전가사</p>
              <p className="text-lg">현재가사</p>
              <p className="opacity-60">이후가사</p>
            </div>
            <div className="flex w-full justify-between">
              <button>이전곡</button>
              <button>재생,일시정지</button>
              <button>이후곡</button>
            </div>
            <div className="flex w-full justify-between">
              <p>노래이름</p>
              <p>가수이름</p>
            </div>
          </div>
        </ToolComponents>

        {/* map */}
        <ToolComponents
          isEnabled={isEnabled[tools[3].value]}
          icon={<Earth className='w-4 h-4' />}
          cmp={tools[3]}
          setIsEnabled={setIsEnabled}
        >
          <div className="h-50 w-full bg-button-100 rounded-sm flex items-center justify-center">여기에 지도가 표시됩니다..?</div>
        </ToolComponents>
      </aside>
    </>
  )
}