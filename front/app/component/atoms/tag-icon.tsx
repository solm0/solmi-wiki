import clsx from "clsx";
import { getTagColorClass } from "@/app/lib/data/tags";
import { Tag } from "@/app/lib/type";

export default function TagIcon({tag}: {tag?: Tag}){
  return (
    <div
      className="shrink-0 relative h-full w-2 mr-2 flex items-center justify-center"
    >
      <div
        className={clsx(
          "h-full w-px text-[var(--tag-ink)]",
          tag ? getTagColorClass(tag.name) : 'bg-button-100',
        )}
      ></div>
      <div className={`
      absolute w-1.5 h-1.5 rounded-full z-20 bg-amber-700
      ${tag ? getTagColorClass(tag.name) : 'bg-button-100'}
        `} />
    </div>
  )
}
