'use client'

import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <section className="relative flex flex-col items-start gap-8 w-full text-text-800 pt-[40vh] pb-8 overflow-y-scroll focus:outline-hidden">
      <p className="font-bold text-4xl">404 Not Found</p>
      <p>해당 페이지가 존재하지 않거나 비공개 상태인 듯.</p>
      <div onClick={() => router.back()} className="w-auto h-8 text-text-900 px-3 flex items-center rounded-sm transition-colors duration-300 pointer-events-auto bg-button-100 hover:bg-button-200">이전으로</div>
    </section>
  )
}