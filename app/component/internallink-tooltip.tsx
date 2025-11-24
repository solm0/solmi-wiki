'use client'

import { useHoveredLink } from "@/app/lib/zustand/useHoveredLink";
import ToolTip from "./atoms/ToolTip";

export default function InternalLinkTooltip() {
  const hoveredTitle = useHoveredLink((state) => state.title);
  const tooltip = useHoveredLink((state) => state.tooltip);

  if (hoveredTitle && tooltip) {
    return (
      <ToolTip label={hoveredTitle} />
    )
  }
}