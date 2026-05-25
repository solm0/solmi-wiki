'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Undo2 } from "lucide-react";

export default function BackButton() {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        const prevPath = sessionStorage.getItem('prevPath') || '/';
        router.push(`${prevPath}?${searchParams}`)
      }}
      className="fixed bottom-12 right-12 bg-button-100 w-16 text-sm h-10 text-text-900 flex items-center justify-center px-3 rounded-sm hover:bg-button-200 transition-colors duration-300 pointer-events-auto z-80"
    >
      <Undo2 className="w-4 h-4 shrink-0" />
    </button>
  )
}