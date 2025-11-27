'use client'

import { Suspense, useEffect, useState } from "react";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";
import { pretendard } from "@/app/lib/localfont";
import clsx from "clsx";
import { Place, Post } from "@/app/lib/type";
import GraphController from "./graph-controller";
import { ChevronRight, SettingsIcon } from "lucide-react";
import Toc from "../toc";
import GoToTop from "../go-to-top";
import ExpandButton from "../atoms/expand-button";
import ThemeButton from "../atoms/theme-button";
import LocalMap from "../map/LocalMap";
import RelatedPostLists from "../map/RelatedPostLists";
import { PlaceIndexIcon } from "../document/PlacePlaceholder";

export function ToolComponents({
  isEnabled, cmp, children, hovered
}: {
  isEnabled: boolean,
  cmp: {value: string, name: string},
  children: React.ReactNode;
  hovered: string | null;
}) {
  if (!isEnabled) return null;

  else return (
    <div
      className={`
        bg-background p-2 rounded-md flex flex-col gap-1 w-full max-w-[30rem] h-auto items-start select-none pointer-events-auto transition-all duration-300
        ${hovered === cmp.value ? 'brightness-95' : 'brightness-100'}
      `}
    >
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
  { value: 'map', name: '지도'},
  { value: 'music', name: '음악'},
]

export default function ToolBox({
  post, selectedPlace
}: {
  post?: Post;
  selectedPlace?: {
    idx: number;
    data?: Place;
  }; // map 페이지 전용
}) {
  const initializeToggles = useToggleStore((s) => s.initializeToggles);

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const isOpen = useToggleStore((s) => s.toggles['toolBox']);
  const setIsEnabled = useToggleStore((s) => s.setToggle);
  const isEnabled = useToggleStore((s) => s.toggles);
  const noOpenTools = Array.from(Object.entries(isEnabled)).filter(tool => Array.from(tools.map(t => t.value)).includes(tool[0])).filter(tool => tool[1] === true).length === 0;

  const [hovered, setHovered] = useState<string | null>(null); // 호버된 도구

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
              <div
                key={i}
                className="flex gap-2 leading-5 text-text-900 items-center"
                onMouseEnter={() => setHovered(tool.value)}
                onMouseLeave={() => setHovered(null)}
              >
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

        {noOpenTools && <div className="text-text-700 pt-4">열린 툴이 없습니다. <SettingsIcon className="inline pb-0.5 w-4.5 h-4.5" />를 클릭해 툴을 활성화하세요.</div>}

        <div className="w-full h-auto flex flex-col gap-4 pt-16 md:pt-4 pb-8 pointer-events-auto overflow-y-scroll overflow-x-hidden scrollbar-hide">

          {/* local graph */}
          {post &&
            <ToolComponents
              isEnabled={isEnabled[tools[0].value]}
              cmp={tools[0]}
              hovered={hovered}
            >
              <Suspense>
                <GraphController post={post} />
              </Suspense>
            </ToolComponents>
          }

          {/* toc */}
          {post &&
            <ToolComponents
              isEnabled={isEnabled[tools[1].value]}
              cmp={tools[1]}
              hovered={hovered}
            >
              <GoToTop title={post.title} />
              <Suspense>
                <Toc post={post} />
              </Suspense>
            </ToolComponents>
          }

          {/* map */}
          {((post?.places && post.places.length !== 0) || (selectedPlace && selectedPlace.data)) &&
            <ToolComponents
              isEnabled={isEnabled[tools[2].value]}
              cmp={tools[2]}
              hovered={hovered}
            >
              {selectedPlace && selectedPlace.data ?
                <div className="w-full h-auto flex flex-col gap-1">
                  <div className="flex gap-1 items-center">
                    <PlaceIndexIcon idx={selectedPlace.idx} />
                    {selectedPlace.data.name}: 언급된 글들
                  </div>
                  <RelatedPostLists
                    posts={selectedPlace.data.posts}
                    placeId={selectedPlace.data.id}
                  />
                </div>
                :
                <>
                  {(!post?.places || post.places.length === 0)
                    ? <NoPost text='선택된 글 없음 또는 이 글에 장소'/>
                    :
                      <div className="relative w-full aspect-square overflow-hidden rounded-sm">
                        <LocalMap places={post?.places} />
                      </div>
                  }
                </>
              }
            </ToolComponents>
          }

          {/* music */}
          <ToolComponents
            isEnabled={isEnabled[tools[3].value]}
            cmp={tools[3]}
            hovered={hovered}
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
        </div>

      </aside>
    </>
  )
}