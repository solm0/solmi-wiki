'use client'

import clsx from "clsx";
import { getTagColorClass } from "@/app/lib/data/tags";
import { pretendard } from "@/app/lib/localfont";
import { useHoveredLiquid } from "@/app/lib/zustand/useHoveredLiquid";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";
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

  const isInspectorOpen = useToggleStore((s) => s.toggles['noteInspector']);
  const setToggle = useToggleStore(s => s.setToggle);

  return (
    <div
      className={clsx(
        "absolute -top-7 left-5 flex h-[2.3em] rotate-12 items-center justify-center rounded-sm px-[0.8em] text-xs text-[var(--tag-ink)] transition-all duration-300 hover:rotate-5 active:translate-y-3",
        pretendard.className,
        getTagColorClass(tagname),
      )}
      onClick={() => {
        if (!isInspectorOpen) setToggle('noteInspector', true);
        handleClick(tagname)
      }}
    >
      <div className='relative top-0 left-0 w-1.5 h-1.5 rounded-sm bg-background mr-1.5 z-20' />
      {tagname}
    </div>
  )
}
