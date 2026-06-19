'use client'

import { Suspense, useEffect, useRef, useState } from "react";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";
import { pretendard } from "@/app/lib/localfont";
import clsx from "clsx";
import { Place, Playlist, Post } from "@/app/lib/type";
import GraphController from "./graph-controller";
import { SettingsIcon } from "lucide-react";
import Toc from "../toc";
import GoToTop from "../go-to-top";
import ExpandButton from "../atoms/expand-button";
import RelatedPostLists from "../map/RelatedPostLists";
import { PlaceIndexIcon } from "../document/PlacePlaceholder";
import LocalMapWController from "../map/LocalMapWController";
import MusicCmp from "../music/MusicCmp";

export function ToolComponents({
  isEnabled, cmp, children, hovered,
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
  text = '선택된 노트'
}: {
  text?: string
}) {
  return <div className="text-text-700">{text} 없음</div>
}

export const tools = [
  { value: 'toc', name: '목차' },
  { value: 'graph', name: '하이퍼링크 맵' },
  { value: 'map', name: '세계지도'},
  { value: 'music', name: '음악'},
]

export default function ToolBox({
  post, selectedPlace, allPlaylists
}: {
  post?: Post;
  selectedPlace?: {
    idx: number;
    data?: Place;
  }; // map 페이지 전용
  allPlaylists: Playlist[];
}) {
  const initializeToggles = useToggleStore((s) => s.initializeToggles);

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const isOpen = useToggleStore((s) => s.toggles['toolBox']);
  const setIsEnabled = useToggleStore((s) => s.setToggle);
  const isEnabled = useToggleStore((s) => s.toggles);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const noOpenTools = Array.from(Object.entries(isEnabled)).filter(tool => Array.from(tools.map(t => t.value)).includes(tool[0])).filter(tool => tool[1] === true).length === 0;

  const [hovered, setHovered] = useState<string | null>(null); // 호버된 도구

  useEffect(() => {
    if (isOpen && (noOpenTools || !post)) {
      setIsEnabled('toolBox', false);
    }
  }, [isOpen, noOpenTools, post, setIsEnabled]);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    const touch = e.touches[0];
    swipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    const start = swipeStartRef.current;
    const touch = e.changedTouches[0];

    swipeStartRef.current = null;

    if (!start || window.innerWidth >= 768) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < 56) return;
    if (Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;
    if (deltaX > 0) {
      setIsEnabled('toolBox', false);
    }
  };

  return (
    <>
      {/* 배경 */}
      {isOpen &&
        <div
          className='fixed top-0 left-0 w-screen h-screen z-60 opacity-50 bg-text-600 block md:hidden'
          onClick={() => setIsEnabled('toolBox', false)}
        ></div>
      }

      {/* 설정 */}
      <div className="fixed origin-top-right top-2 right-2 z-70 w-8">
        {isOpen &&
          <ExpandButton name={<SettingsIcon className="w-4 h-4 md:w-3.5 md:h-3.5 shrink-0"/>}>

            {/* tools */}
            <div className="flex flex-col gap-2">
              {tools.map((tool, i) => 
                <div
                  key={i}
                  className="flex leading-5 text-text-900 items-center w-full"
                  onMouseEnter={() => setHovered(tool.value)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <button
                    className="w-4 h-4 md:w-3 md:h-3 border border-text-600 hover:border-text-700 transition-colors duration-300"
                    onClick={() => setIsEnabled(tool.value, !isEnabled[tool.value])}
                    id={`${tool.value}-button`}
                  >
                    <div className={`w-full h-full ${isEnabled[tool.value] ? 'bg-green-500' : 'bg-transparent'} transition-colors duration-300`} />
                  </button>
                  <label htmlFor={`${tool.value}-button`} className="pl-2">{tool.name}</label>
                </div>
              )}
            </div>
          </ExpandButton>
        }
      </div>

      <aside
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={clsx(
        `${pretendard.className}
        absolute md:relative right-0 md:right-auto md:pr-4 z-60 pointer-events-none h-full flex flex-col items-start text-sm gap-8 text-text-900 transition-all duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)] shrink-0 overflow-hidden`,
        isOpen ? 'w-96 md:w-76 shadow-2xl md:shadow-none translate-x-0 opacity-100 bg-background md:bg-transparent pointer-events-auto flex px-4 md:px-0' : 'w-0 translate-x-88 opacity-0 pointer-events-none flex'
      )}>

        <div className="w-full h-auto flex flex-col gap-2 pt-10 pb-8 pointer-events-auto overflow-y-scroll overflow-x-hidden scrollbar-hide">

          {/* toc */}
          {post &&
            <ToolComponents
              isEnabled={isEnabled[tools[0].value]}
              cmp={tools[0]}
              hovered={hovered}
            >
              <GoToTop title={post.title} />
              <Suspense>
                <Toc post={post} />
              </Suspense>
            </ToolComponents>
          }

          {/* local graph */}
          {post &&
            <ToolComponents
              isEnabled={isEnabled[tools[1].value]}
              cmp={tools[1]}
              hovered={hovered}
            >
              <Suspense>
                <GraphController postId={post.id} />
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
                <div className="w-full h-auto flex flex-col gap-3 p-1 pr-0">
                  <div className="flex gap-2 items-center">
                    <PlaceIndexIcon idx={selectedPlace.idx} />
                    {selectedPlace.data.name}
                  </div>
                  <div>
                    <RelatedPostLists
                      posts={selectedPlace.data.posts}
                      placeId={selectedPlace.data.id}
                    />
                  </div>
                </div>
                :
                <LocalMapWController />
              }
            </ToolComponents>
          }

          {/* music */}
          <ToolComponents
            isEnabled={isEnabled[tools[3].value]}
            cmp={tools[3]}
            hovered={hovered}
          >
            <MusicCmp playlistIds={post?.playlists} allPlaylists={allPlaylists} />
          </ToolComponents>
        </div>

      </aside>
    </>
  )
}
