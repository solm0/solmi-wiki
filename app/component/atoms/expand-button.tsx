'use client'

import { useState } from "react";

export default function ExpandButton({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string | React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1 w-auto items-end" title="도구 상자 설정">

      {/* 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? `text-green-500`: `text-text-900`} w-8 h-8 flex items-center justify-center rounded-sm transition-colors duration-300 pointer-events-auto hover:bg-button-100`}
      >
        {name}
      </button>

      {/* 창 */}
      <div
        onMouseLeave={() => setIsOpen(false)}
        className={`
          bg-button-100 h-auto w-40 flex flex-col p-3 mt-2 items-start gap-1 overflow-clip rounded-sm text-xs z-70
          ${isOpen ? "block max-h-96" : "hidden max-h-0"}
        `}
       >
        {children}
      </div>
    </div>
  )
}