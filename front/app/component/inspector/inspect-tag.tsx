'use client'

import clsx from 'clsx';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
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

  const currentTag = searchParams.get("tag");
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const activeTag = hoveredTag ?? currentTag;

  const handleClick = (clickedTag: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (clickedTag === currentTag) {
      newParams.delete("tag");
      router.push(`${pathname}?${newParams.toString()}`);
    } else {
      newParams.set("tag", clickedTag);
      router.push(`${pathname}?${newParams.toString()}`);
    }
  }

  return (
    <div
      className='relative h-auto w-auto flex flex-wrap gap-x-4 gap-y-0 pointer-events-auto'
      onMouseLeave={() => setHoveredTag(null)}
    >
      {tags.map((tag, idx) => (
        <div
          key={idx}
          id={tag.name}
          className={clsx(
            'relative h-[2.2em] flex items-center justify-center rounded-xs transition-colors',
            activeTag === tag.name ? 'text-[var(--tag-ink)]' : 'text-text-900',
          )}
          onClick={() => handleClick(tag.name)}
          onMouseOver={() => setHoveredTag(tag.name)}
        >
          <div className={`
            relative top-0 left-0 w-2 h-2 rounded-full bg-background mr-1.5 z-20 transition-colors
            ${activeTag === tag.name ? getTagColorClass(tag.name) : 'bg-button-100'}
          `} />
          <label
            htmlFor={`${tag.name}-input`}
            className={activeTag === tag.name ? 'text-text-800' : 'text-text-700'}
          >
            {tag.name}
          </label>
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
