'use client'

import { tagsWColors } from "@/app/lib/data/tags";
import { pretendard } from "@/app/lib/localfont";
import { useHoveredLiquid } from "@/app/lib/zustand/useHoveredLiquid";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// metadata의 tag button
export default function TagButton({tagname}: {tagname: string}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const setFromNote = useHoveredLiquid(state=> state.setFromNote);

  const currentTag = searchParams.get("tag");

  const handleClick = (tag: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (tag === currentTag) {
      newParams.delete("tag");
      router.push(`${pathname}?${newParams.toString()}`);
      setFromNote(true);
    } else {
      newParams.set("tag", tag);
      router.push(`${pathname}?${newParams.toString()}`);
      setFromNote(true);
    }
  }

  return (
    <div
      className={`
        absolute -top-7 rotate-12 left-5 text-xs h-[2.3em] px-[0.8em] flex items-center justify-center rounded-sm text-text-900 hover:rotate-5 active:translate-y-3 transition-all duration-300
        ${pretendard.className}
      `}
      style={{ backgroundColor: tagsWColors.find(tag=>tag.name &&tag.name === tagname)?.color}}
      onClick={() => handleClick(tagname)}
    >
      <div className='relative top-0 left-0 w-1.5 h-1.5 rounded-sm bg-background mr-1.5 z-20' />
      {tagname}
    </div>
  )
}