'use client'

import { Tag as TagIcon, Search, Key } from 'lucide-react';
import InspectTag from './inspect-tag';
import InspectSearch from './inspect-search';
import InspectKeyword from './inspect-keyword';
import { useEffect } from 'react';
import clsx from 'clsx';
import { useToggleStore } from '../../lib/use-enabled';
import { Tag, KeywordsByTag, Post } from '../../lib/type';
import GenerateChron from "../../lib/gererate-chron";
import InspectResultList from "./inspect-result-list";
import { useSearchParams } from "next/navigation";
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
  posts: Post[];
  tags: Tag[];
  kwByTag: KeywordsByTag;
}) {
  const initializeToggles = useToggleStore((s) => s.initializeToggles);

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const isEnabled = useToggleStore((s) => s.toggles['noteInspector']);
  const setIsEnabled = useToggleStore((s) => s.setToggle);

  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");
  const keywords = searchParams.getAll("keyword");

  const finalPosts = filterPosts({ posts: GenerateChron(posts), tag, search, keywords });

  return (
    <section
      className={clsx(
      "z-80 pointer-events-none h-full flex-col gap-8 mt-0 md:mt-8 items-start text-sm transition-[transform, opacity] duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)]",
      isEnabled ? 'w-[calc(100%-3rem)] border-r border-text-600 md:border-0 md:w-80 translate-x-0 opacity-100 bg-background md:bg-transparent pointer-events-auto flex md:flex' : 'w-0 md:w-20 -translate-x-88 opacity-0 pointer-events-none flex'
    )}>
      {/* 작은화면 창닫기 */}
      <div
        onClick={() => setIsEnabled('noteInspector', false)}
        className='flex md:hidden w-full h-16 mt-4'
      >
        <button className='ml-auto mr-4 w-8 h-8 hover:text-text-700 pointer-events-auto transition-colors duration-200 bg-transparent hover:bg-button-100 rounded-sm flex items-center justify-center'>
          <ChevronLeft />
        </button>
      </div>
      <FilterComponents
        icon={<TagIcon className='w-3 h-3' />}
        cmp={{ value: 'tag', name: '태그' }}
      >
        <InspectTag tags={tags} />
      </FilterComponents>

      <FilterComponents
        icon={<Search className='w-3 h-3' />}
        cmp={{ value: 'search', name: '문자열' }}
      >
        <InspectSearch />
      </FilterComponents>

      <FilterComponents
        icon={<Key className='w-3 h-3' />}
        cmp={{ value: 'keyword', name: '키워드' }}
      >
        <InspectKeyword kwByTag={kwByTag} />
      </FilterComponents>

      <div className='flex flex-col gap-1 w-full overflow-hidden items-start select-none'>
        <label
          className='flex items-center gap-2 text-text-700'
        >
          결과: {finalPosts.length}건
        </label>
          <div
            className="flex w-full flex-col gap-2 overflow-hidden"
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsEnabled('noteInspector', false)
              }
            }}
          >
            <InspectResultList posts={finalPosts} />
          </div>
      </div>
    </section>
  )
}