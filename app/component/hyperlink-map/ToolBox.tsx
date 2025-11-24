'use client'

import { Suspense, useEffect } from "react";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";
import { pretendard } from "@/app/lib/localfont";
import clsx from "clsx";
import { Post } from "@/app/lib/type";
import GraphController from "./graph-controller";
import { Link2, X, TableOfContents, ChevronRight, Music2, SettingsIcon, Earth } from "lucide-react";
import Toc from "../toc";
import GoToTop from "../go-to-top";
import ExpandButton from "../atoms/expand-button";
import ThemeButton from "../atoms/theme-button";
import LocalMap from "../map/LocalMap";

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
    <div className='flex flex-col gap-1 w-[320px] h-auto items-start select-none pointer-events-auto'>
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

export function NoPost({
  text = '선택된 글'
}: {
  text?: string
}) {
  return <div className="text-text-700">{text} 없음</div>
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
  post?: Post;
}) {
  const initializeToggles = useToggleStore((s) => s.initializeToggles);

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const isOpen = useToggleStore((s) => s.toggles['toolBox']);
  const setIsEnabled = useToggleStore((s) => s.setToggle);
  const isEnabled = useToggleStore((s) => s.toggles);
  const noOpenTools = Array.from(Object.entries(isEnabled)).filter(tool => Array.from(tools.map(t => t.value)).includes(tool[0])).filter(tool => tool[1] === true).length === 0;

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
                  className="rounded-full w-4 h-4 border border-text-600 hover:border-text-700 p-0.5 transition-colors duration-300"
                  onClick={() => setIsEnabled(tool.value, !isEnabled[tool.value])}
                  id={`${tool.value}-button`}
                >
                  <div className={`w-full h-full rounded-full ${isEnabled[tool.value] ? 'bg-green-400' : 'bg-transparent'} transition-colors duration-300`} />
                </button>
                <label htmlFor={`${tool.value}-button`}>{tool.name}</label>
              </div>
            )}
          </ExpandButton>
        }
      </div>

      <aside className={clsx(
        `${pretendard.className}
        absolute md:relative right-0 md:right-auto z-60 pointer-events-none h-full flex flex-col items-start text-sm gap-8 text-text-900 transition-all duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)] shrink-0 overflow-hidden`,
        isOpen ? 'w-[calc(100%-3rem)] md:w-80 border-l border-text-600 md:border-0 translate-x-0 opacity-100 bg-background md:bg-transparent pointer-events-auto flex px-4 md:px-0' : 'w-0 md:w-20 translate-x-88 opacity-0 pointer-events-none flex'
      )}>
        {/* 작은화면 창닫기 */}
        <button
          onClick={() => setIsEnabled('toolBox', false)}
          className='fixed top-4 left-4 md:hidden w-8 h-8 hover:text-text-700 pointer-events-auto transition-colors duration-200 bg-background hover:bg-button-100 border border-text-600 rounded-sm flex items-center justify-center z-80'
        >
          <ChevronRight />
        </button>

        {noOpenTools && <div className="text-text-700">열린 툴이 없습니다. <SettingsIcon className="inline pb-0.5 w-4.5 h-4.5" />를 클릭해 툴을 활성화하세요.</div>}

        <div className="w-full h-auto flex flex-col gap-8 pt-16 md:pt-0 pb-8 pointer-events-auto overflow-y-scroll overflow-x-hidden custom-scrollbar">
          {/* local graph */}
          <ToolComponents
            isEnabled={isEnabled[tools[0].value]}
            icon={<Link2 className='w-4 h-4' />}
            cmp={tools[0]}
            setIsEnabled={setIsEnabled}
          >
            {post ? (
              <Suspense>
                <GraphController post={post} />
              </Suspense>
            ): (
              <NoPost />
            )}
          </ToolComponents>

          {/* toc */}
          <ToolComponents
            isEnabled={isEnabled[tools[1].value]}
            icon={<TableOfContents className='w-4 h-4' />}
            cmp={tools[1]}
            setIsEnabled={setIsEnabled}
          >
            {post ? (
              <>
                  <GoToTop title={post.title} />
                  <Suspense>
                    <Toc post={post} />
                  </Suspense>
              </>
            ): (
              <NoPost />
            )}
          </ToolComponents>

          {/* music */}
          <ToolComponents
            isEnabled={isEnabled[tools[2].value]}
            icon={<Music2 className='w-4 h-4'/>}
            cmp={tools[2]}
            setIsEnabled={setIsEnabled}
          >
            {/* post 또는 null를 prop으로 받아 그안에서 해결 */}
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
            <div className="w-full h-80 overflow-hidden rounded-sm">
              <LocalMap places={post?.places} />
            </div>
          </ToolComponents>
        </div>

      </aside>
    </>
  )
}