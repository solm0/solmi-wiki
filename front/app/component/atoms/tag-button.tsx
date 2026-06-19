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
        'inline-flex w-3 h-3 -translate-y-6 ml-2 rounded-full hover:opacity-50 transition-opacity',
        getTagColorClass(tagname),
      )}
      onClick={() => {
        if (!isInspectorOpen) setToggle('noteInspector', true);
        handleClick(tagname)
      }}
    >
    </div>
  )
}
