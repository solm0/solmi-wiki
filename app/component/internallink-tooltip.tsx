'use client'

import { useMousePosition } from "@/app/lib/zustand/useMousePosition";
import { useHoveredLink } from "@/app/lib/zustand/useHoveredLink";

export default function InternalLinkTooltip() {
  const mousePosition = useMousePosition();

  const hoveredTitle = useHoveredLink((state) => state.title);
  const tooltip = useHoveredLink((state) => state.tooltip);

  if (hoveredTitle && tooltip) {
    return (
      <span
        className="text-sm bg-button-100 text-text-900 rounded-sm flex items-center h-auto w-72 -translate-x-36 break-words px-3 py-2 absolute leading-6 z-10"
        style={{
          bottom: mousePosition.y! + 20 || 0,
          left: mousePosition.x! || 0,
        }}
      >
        {hoveredTitle}
      </span>
    )
  }
}