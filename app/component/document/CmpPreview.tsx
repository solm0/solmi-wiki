import { pretendard } from "@/app/lib/localfont"

export default function CmpPreview({
  cmpName,
}: {
  cmpName: string
}) {
  return (
    <figure className="my-4 text-sm flex flex-col gap-4 border border-text-600 rounded-sm p-4 items-center relative">
      <iframe src={`https://lib-comp-teal.vercel.app/${cmpName}`} className="w-full h-auto aspect-video rounded-sm overflow-y-auto overflow-x-hidden"/>
      <figcaption className={`${pretendard.className} w-auto text-center bg-background absolute bottom-0 translate-y-3 px-3`}>스크롤하고 상호작용해 보세요</figcaption>
    </figure>
  )
}