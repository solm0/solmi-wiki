'use client'

import clsx from 'clsx';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useHoveredLiquid } from '@/app/lib/zustand/useHoveredLiquid';
import { useEffect, useRef, useState } from 'react';
import { Tag } from '@/app/lib/type';
import { tagsWColors } from '@/app/lib/data/tags';

export default function InspectTag({
  tags
}: {
  tags: Tag[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tagContainerRef = useRef<HTMLDivElement | null>(null);
  
  const hoveredTag = useHoveredLiquid((state) => state.value);
  const offsetX = useHoveredLiquid((state) => state.offsetX);
  const width = useHoveredLiquid((state) => state.width);
  const offsetY = useHoveredLiquid((state) => state.offsetY);
  const height = useHoveredLiquid((state) => state.height);
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

  // 호버한 태그
  const updateHandlePosition = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    value: string
  ) => {
    if (!tagContainerRef.current) return;
    const containerLeft = Math.floor(tagContainerRef.current.getBoundingClientRect().left);
    const containerTop = Math.floor(tagContainerRef.current.getBoundingClientRect().top);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const left = Math.floor(rect.left);
    const width = rect.width;
    const top = Math.floor(rect.top);
    const height = rect.height;

    setHoveredTag(value, left-containerLeft, width, top-containerTop, height)
  };

  // 현재 호버중인 태그 없으면 직전에 클릭했던 태그
  useEffect(() => {
    if (!hoveredTag && tag) {
      const el = document.getElementById(tag);
      if (!el) return;

      if (!tagContainerRef.current) return;
      const containerLeft = Math.floor(tagContainerRef.current.getBoundingClientRect().left);
      const containerTop = Math.floor(tagContainerRef.current.getBoundingClientRect().top);
      
      const rect = el.getBoundingClientRect();
      const left = Math.floor(rect.left);
      const width = rect.width;
      const top = Math.floor(rect.top);
      const height = rect.height;

      setHoveredTag(tag, left-containerLeft, width, top-containerTop, height);
    } else return;
  }, [hoveredTag, tag]);

  // 그것도 없으면 url에 있는 태그
  useEffect(() => {
    if (!hoveredTag && !tag) {
      const params = new URLSearchParams(window.location.search);
      const currentTag = params.get("tag");
      if (!currentTag) return;

      const el = document.getElementById(currentTag);
      if (!el) return;

      if (!tagContainerRef.current) return;
      const containerLeft = Math.floor(tagContainerRef.current.getBoundingClientRect().left);
      const containerTop = Math.floor(tagContainerRef.current.getBoundingClientRect().top);
      
      const rect = el.getBoundingClientRect();
      const left = Math.floor(rect.left);
      const width = rect.width;
      const top = Math.floor(rect.top);
      const height = rect.height;

      setHoveredTag(currentTag, left-containerLeft, width, top-containerTop, height);
    }
  }, [hoveredTag, setHoveredTag]);

  // from note
  useEffect(() => {
    if (fromNote) {
      if (currentTag) {
        const el = document.getElementById(currentTag);
        if (!el) return;
  
        if (!tagContainerRef.current) return;
        const containerLeft = Math.floor(tagContainerRef.current.getBoundingClientRect().left);
        const containerTop = Math.floor(tagContainerRef.current.getBoundingClientRect().top);
        
        const rect = el.getBoundingClientRect();
        const left = Math.floor(rect.left);
        const width = rect.width;
        const top = Math.floor(rect.top);
        const height = rect.height;
  
        setHoveredTag(currentTag, left-containerLeft, width, top-containerTop, height);
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
      ref={tagContainerRef}
      className='h-auto w-auto flex flex-wrap gap-1 backdrop-blur-md pointer-events-auto'
      onMouseLeave={() => setHoveredTag(null, null, null, null, null)}
    >
      {tags.map((tag, idx) => (
        <div
          key={idx}
          id={tag.name}
          className='relative h-[2.3em] px-[0.8em] flex items-center justify-center rounded-sm text-text-900 active:bg-button-200 transition-colors'
          onClick={() => handleClick(tag.name)}
          onMouseOver={(e) => updateHandlePosition(e, tag.name)}
        >
          <div
            className={`
              absolute top-0 left-0 w-full h-full -z-10 rounded-sm
              ${hoveredTag === tag.name ? 'bg-transparent' : 'bg-button-100 animate-pulse duration-100'}
            `}
            style={{
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
          <div className='relative top-0 left-0 w-1.5 h-1.5 rounded-sm bg-background mr-1.5 z-20' />
          <label htmlFor={`${tag.name}-input`}>{tag.name}</label>
          <input
            id={`${tag.name}-input`}
            type='radio'
            value={tag.name}
            className='opacity-0 hidden'
          />
        </div>
      ))}
      <span
        className={clsx(
          'absolute h-8 rounded-sm mix-blend-darken pointer-events-none transition-all duration-300 ease-in-out bg-green-500',
          hoveredTag ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          top: `${offsetY}px`,
          height: `${height}px`,
          left: `${offsetX}px`,
          width: `${width}px`,
          backgroundColor: `${tagsWColors.find(tag=>tag.name === hoveredTag)?.color}`,
        }}
      >
      </span>
    </div>
  )
}