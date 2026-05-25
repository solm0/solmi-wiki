'use client'

import { useState } from "react";

export function Alert() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      {isOpen === true &&
        <div className="fixed w-64 bg-green-500 px-3 py-2 z-80 h-auto rounded-sm bottom-5 left-5 md:bottom-8 md:left-8 text-sm text-text-900 flex flex-col items-start gap-2">
          <p className="break-keep">현재 웹사이트의 일부가 미완성 상태로, 이미지가 누락되거나 저화질일 수 있습니다. 8월 안으로 완성 예정입니다.</p>
          <button
            onClick={() => {setIsOpen(false)}}
            className="bg-green-500 border-text-900 px-3 py-1 border rounded-sm hover:bg-green-600 transition-colors duration-300"
          >
              예
          </button>
        </div>
      }
    </>
  )
}