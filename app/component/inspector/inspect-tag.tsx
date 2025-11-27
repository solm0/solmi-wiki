'use client'

import clsx from 'clsx';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useHoveredLiquid } from '@/app/lib/zustand/useHoveredLiquid';
import { useEffect, useRef, useState } from 'react';
import { Tag } from '@/app/lib/type';

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
  const setHoveredTag = useHoveredLiquid((state) => state.setValue);

  const currentTag = searchParams.get("tag");

  // 클릭한 태그 저장
  const [tag, setTag] = useState<string | null>(null);

  const handleClick = (tag: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (tag === currentTag) {
      setTag(null);
      newParams.delete("tag");
      router.push(`${pathname}?${newParams.toString()}`);
    } else {
      setTag(tag);
      newParams.set("tag", tag);
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

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const left = Math.floor(rect.left);
    const width = rect.width;

    setHoveredTag(value, left-containerLeft, width)
  };

  // 현재 호버중인 태그 없으면 직전에 클릭했던 태그
  useEffect(() => {
    if (!hoveredTag && tag) {
      const el = document.getElementById(tag);
      if (!el) return;

      if (!tagContainerRef.current) return;
      const containerLeft = Math.floor(tagContainerRef.current.getBoundingClientRect().left);
      
      const rect = el.getBoundingClientRect();
      const left = Math.floor(rect.left);
      const width = rect.width;
      setHoveredTag(tag, left-containerLeft, width);
    } else return;
  }, [hoveredTag]);

  // 그것도 없으면 url에 있는 태그
  useEffect(() => {
    if (!hoveredTag && !tag) {
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const currentTag = params.get("tag");
        if (!currentTag) return;
  
        const el = document.getElementById(currentTag);
        if (!el) return;
  
        if (!tagContainerRef.current) return;
        const containerLeft = Math.floor(tagContainerRef.current.getBoundingClientRect().left);
        
        const rect = el.getBoundingClientRect();
        const left = Math.floor(rect.left);
        const width = rect.width;
        setHoveredTag(currentTag, left-containerLeft, width);
      }, 30);
    }
  }, [hoveredTag, setHoveredTag]);

  return (
    <div
      ref={tagContainerRef}
      className='h-auto w-auto px-1 py-1 border border-text-600 rounded-sm flex gap-1 backdrop-blur-md pointer-events-auto'
      onMouseLeave={() => setHoveredTag(null, null, null)}
    >
      {tags.map((tag, idx) => (
        <div
          key={idx}
          id={tag.name}
          className='h-8 px-3 flex items-center justify-center rounded-sm font-medium text-text-900'
          onClick={() => handleClick(tag.name)}
          onMouseOver={(e) => updateHandlePosition(e, tag.name)}
        >
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
          'absolute h-8 rounded-sm -z-10 transition-all duration-300 ease-in-out bg-green-500',
          hoveredTag ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          left: `${offsetX}px`,
          width: `${width}px`,
        }}
      >
      </span>
    </div>
  )
}