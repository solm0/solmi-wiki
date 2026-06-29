import clsx from "clsx";
import { getTagColorClass } from "@/app/lib/data/tags";
import { Tag } from "@/app/lib/type";

export default function TagIcon({tag, isCurrentPost=false}: {tag?: Tag; isCurrentPost?:boolean}){
  return (
    <div
      className="shrink-0 relative h-full w-2 mr-2 flex items-center justify-center"
    >
      <div
        className={clsx(
          "w-px text-[var(--tag-ink)] transition-[height]",
          tag ? getTagColorClass(tag.name) : 'bg-button-100',
          isCurrentPost ? 'h-0' : 'h-full'
        )}
      ></div>
      <div className={`
      absolute rounded-full z-20 transition-[weight,height]
      ${tag ? getTagColorClass(tag.name) : 'bg-button-100'}
      ${isCurrentPost ? 'w-2 h-2':'w-1.5 h-1.5'}
        `} />
    </div>
  )
}
