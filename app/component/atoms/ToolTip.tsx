'use client'

import { useMousePosition } from "@/app/lib/zustand/useMousePosition";

export default function ToolTip({label}:{label:string}) {
  const mousePosition = useMousePosition();

  return (
    <span
      className="text-xs bg-green-100 text-text-900 rounded-sm flex items-center h-auto w-auto -translate-x-1/2 break-words px-3 py-1 absolute leading-6 z-80"
      style={{
        bottom: mousePosition.y! + 20 || 0,
        left: mousePosition.x! || 0,
      }}
    >
      {label}
    </span>
  )
}