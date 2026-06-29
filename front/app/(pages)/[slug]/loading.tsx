import { maruburi, maruburi_bold, pretendard } from "@/app/lib/localfont";

export default function Loading() {
  return (
    <>
      <div
        className="flex-1 min-w-0 flex gap-4 pt-[40vh] text-text-900 break-normal md:break-keep overflow-y-scroll overflow-x-hidden focus:outline-0"
      >
        <article
          className={`
            ${maruburi.className}
            flex flex-col gap-12 w-full leading-[2em] font-serif pl-4 md:pl-32 animate-pulse
          `}
        >
          <div className="h-12 w-64 rounded-sm bg-button-100" />

          <div className="flex flex-col gap-2 max-w-[47em]">
            <div className="h-4 w-40 rounded-sm bg-button-100" />
            <div className="h-4 w-52 rounded-sm bg-button-100" />
            <div className="h-4 w-32 rounded-sm bg-button-100" />
          </div>

          <div className="flex flex-col gap-5 w-full max-w-[47em]">
            <div className="h-5 w-full rounded-sm bg-button-100" />
            <div className="h-5 w-[92%] rounded-sm bg-button-100" />
            <div className="h-5 w-[88%] rounded-sm bg-button-100" />
            <div className="h-64 w-full rounded-sm bg-button-100" />
            <div className="h-5 w-[90%] rounded-sm bg-button-100" />
            <div className="h-5 w-[84%] rounded-sm bg-button-100" />
          </div>

          <p className={`${pretendard.className} text-xs text-text-700`}>
            불러오는 중
          </p>
        </article>
      </div>
    </>
  );
}
