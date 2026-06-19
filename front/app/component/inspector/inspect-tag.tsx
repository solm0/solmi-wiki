'use client'

import clsx from 'clsx';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useHoveredLiquid } from '@/app/lib/zustand/useHoveredLiquid';
import { useEffect, useState } from 'react';
import { Tag } from '@/app/lib/type';
import { getTagColorClass } from '@/app/lib/data/tags';

export default function InspectTag({
  tags
}: {
  tags: Tag[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const hoveredTag = useHoveredLiquid((state) => state.value);
  const setHoveredTag = useHoveredLiquid((state) => state.setValue);
  const fromNote = useHoveredLiquid(state=>state.fromNote);
  const setFromNote = useHoveredLiquid(state=>state.setFromNote);

  const currentTag = searchParams.get("tag");

  // 클릭한 태그 저장
  const [tag, setTag] = useState<string | null>(null);

  const handleClick = (clickedTag: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (clickedTag === currentTag) {
      setTag(null);
      newParams.delete("tag");
      router.push(`${pathname}?${newParams.toString()}`);
    } else {
      setTag(clickedTag);
      newParams.set("tag", clickedTag);
      router.push(`${pathname}?${newParams.toString()}`);
    }
  }

  const updateHandlePosition = (value: string) => {
    setHoveredTag(value, null, null, null, null)
  };

  // 현재 호버중인 태그 없으면 직전에 클릭했던 태그
  useEffect(() => {
    if (!hoveredTag && tag) {
      setHoveredTag(tag, null, null, null, null);
    } else return;
  }, [hoveredTag, tag]);

  // 그것도 없으면 url에 있는 태그
  useEffect(() => {
    if (!hoveredTag && !tag) {
      if (!currentTag) return;
      setHoveredTag(currentTag, null, null, null, null);
    }
  }, [currentTag, hoveredTag, setHoveredTag, tag, tags]);

  // from note
  useEffect(() => {
    if (fromNote) {
      if (currentTag) {
        setHoveredTag(currentTag, null, null, null, null);
      } else {
        console.log('no currenttag')
        setHoveredTag(null, null, null, null, null)
      }
      setFromNote(false);
      setTag(null);
    }
  }, [currentTag]);

  return (
    <div
      className='relative h-auto w-auto flex flex-wrap gap-1 pointer-events-auto'
      onMouseLeave={() => setHoveredTag(null, null, null, null, null)}
    >
      {tags.map((tag, idx) => (
        <div
          key={idx}
          id={tag.name}
          className={clsx(
            'relative h-[2.2em] px-2 flex items-center justify-center rounded-xs active:bg-button-200 transition-colors',
            hoveredTag === tag.name ? getTagColorClass(tag.name) : 'bg-button-100',
            hoveredTag === tag.name ? 'text-[var(--tag-ink)]' : 'text-text-900',
          )}
          onClick={() => handleClick(tag.name)}
          onMouseOver={() => updateHandlePosition(tag.name)}
        >
          <div className='relative top-0 left-0 w-1.5 h-1.5 rounded-full bg-background mr-1 z-20' />
          <label htmlFor={`${tag.name}-input`}>{tag.name}</label>
          <input
            id={`${tag.name}-input`}
            type='radio'
            value={tag.name}
            className='opacity-0 hidden'
          />
        </div>
      ))}
    </div>
  )
}
