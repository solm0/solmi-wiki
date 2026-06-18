'use client'

import { Tag as TagIcon, Search, Key } from 'lucide-react';
import InspectTag from './inspect-tag';
import InspectSearch from './inspect-search';
import InspectKeyword from './inspect-keyword';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useToggleStore } from '../../lib/zustand/useToggleStore';
import { Tag, KeywordsByTag, Post } from '../../lib/type';
import GenerateChron from "../../lib/gererate-chron";
import InspectResultList from "./inspect-result-list";
import { usePathname, useSearchParams } from "next/navigation";
import filterPosts from "../../lib/filter-posts";
import { ChevronLeft } from 'lucide-react';

export function FilterComponents({
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
        className='flex items-center gap-2 text-text-800'
        htmlFor={`${cmp.value}-input`}
      >
        {icon}
        {cmp.name}
      </label>
      {children}
    </div>
  )
}

export default function Inspector({
  posts,
  tags,
  kwByTag
}: {
  posts?: Post[];
  tags?: Tag[];
  kwByTag?: KeywordsByTag;
}) {
  const initializeToggles = useToggleStore((s) => s.initializeToggles);
  const [loadedPosts, setLoadedPosts] = useState<Post[]>(posts ?? []);
  const [loadedTags, setLoadedTags] = useState<Tag[]>(tags ?? []);
  const [loadedKwByTag, setLoadedKwByTag] = useState<KeywordsByTag>(kwByTag ?? {});

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  useEffect(() => {
    if (posts && tags && kwByTag) return;

    async function loadInspectorData() {
      const [postsRes, tagsRes, keywordsRes] = await Promise.all([
        fetch('/data/all_posts.json'),
        fetch('/data/all_tags.json'),
        fetch('/data/top_keywords_tag.json'),
      ]);

      const [nextPosts, nextTags, nextKwByTag] = await Promise.all([
        postsRes.json(),
        tagsRes.json(),
        keywordsRes.json(),
      ]);

      setLoadedPosts(nextPosts);
      setLoadedTags(nextTags);
      setLoadedKwByTag(nextKwByTag);
    }

    loadInspectorData().catch(console.error);
  }, [posts, tags, kwByTag]);

  const isEnabled = useToggleStore((s) => s.toggles['noteInspector']);
  const setIsEnabled = useToggleStore((s) => s.setToggle);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");
  const keywords = searchParams.getAll("keyword");
  const hasActiveFilters = Boolean(tag || search || keywords.length > 0);
  const shouldHideInspector = pathname === "/map";

  const finalPosts = filterPosts({ posts: GenerateChron(loadedPosts), tag, search, keywords });

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
    if (deltaX < 0) {
      setIsEnabled('noteInspector', false);
    }
  };

  return (
    <>
      {/* 배경 */}
      {isEnabled && !shouldHideInspector &&
        <div className='fixed top-0 left-0 w-screen h-screen z-60 opacity-50 bg-text-600 block md:hidden'></div>
      }

      <section
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={clsx(
        "absolute md:relative left-0 md:left-auto z-70 pointer-events-none h-full flex-col mt-0 md:mt-10 items-start text-xs transition-[transform, opacity] duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)] gap-8",
        isEnabled && !shouldHideInspector ? 'w-[calc(100%-3rem)] md:w-64 border-r border-text-600 md:border-0 translate-x-0 opacity-100 bg-background md:bg-transparent pointer-events-auto flex pl-4 md:pl-0' : 'w-0 md:w-20 -translate-x-88 opacity-0 pointer-events-none flex'
      )}>

        {/* 작은화면 창닫기 */}
        <button
          onClick={() => setIsEnabled('noteInspector', false)}
          className='fixed top-4 right-4 md:hidden w-8 h-8 text-text-900 hover:text-text-700 pointer-events-auto transition-colors duration-200 bg-transparent hover:bg-button-100 border border-text-600 rounded-sm flex items-center justify-center z-80'
        >
          <ChevronLeft />
        </button>

        {/* 필터링 */}
        <div className="w-full h-auto flex flex-col gap-6 pt-16 md:pt-0 pointer-events-auto overflow-y-scroll overflow-x-hidden custom-scrollbar">
          <FilterComponents
            icon={<TagIcon className='w-3 h-3' />}
            cmp={{ value: 'tag', name: '태그' }}
          >
            <InspectTag tags={loadedTags} />
          </FilterComponents>

          <FilterComponents
            icon={<Key className='w-3 h-3' />}
            cmp={{ value: 'keyword', name: '자주 쓰인 단어' }}
          >
            <InspectKeyword kwByTag={loadedKwByTag} />
          </FilterComponents>

          <FilterComponents
            icon={<Search className='w-3 h-3' />}
            cmp={{ value: 'search', name: '검색' }}
          >
            <InspectSearch />
          </FilterComponents>

          {/* 결과 */}
          {hasActiveFilters && (
            <div className='flex flex-col gap-1 w-full overflow-hidden items-start select-none pb-8'>
              <label
                className='flex items-center gap-2 text-text-700'
              >
                결과: {finalPosts.length}건
              </label>
                <div
                  className="relative flex w-full flex-col gap-2 overflow-hidden"
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setIsEnabled('noteInspector', false)
                    }
                  }}
                >
                  <InspectResultList posts={finalPosts} />
                </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
