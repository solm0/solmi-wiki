import clsx from "clsx";
import { getTagColorClass } from "@/app/lib/data/tags";

export default function TagIcon({tagname}: {tagname: string}){
  return (
    <div
      className={clsx(
        "ml-1 flex h-5 w-8 shrink-0 rotate-12 items-center justify-start rounded-sm text-[var(--tag-ink)]",
        getTagColorClass(tagname),
      )}
    >
      <div className='relative top-0 left-0 w-1.5 h-1.5 rounded-sm bg-background ml-1.5 z-20' />
    </div>
  )
}
