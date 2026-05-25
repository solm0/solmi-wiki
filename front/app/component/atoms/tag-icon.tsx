import { tagsWColors } from "@/app/lib/data/tags";

export default function TagIcon({tagname}: {tagname: string}){
  return (
    <div
      className="ml-1 w-8 h-5 rotate-12 rounded-sm text-text-900 shrink-0 flex items-center justify-start"
      style={{backgroundColor: `${tagsWColors.find(tag=>tag.name===tagname)?.color}`}}
    >
      <div className='relative top-0 left-0 w-1.5 h-1.5 rounded-sm bg-background ml-1.5 z-20' />
    </div>
  )
}