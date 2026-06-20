'use client'

import EnableButton from "../atoms/enable-button";
import { Ellipsis } from "lucide-react";
import { useEffect } from "react";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";
import { usePathname } from "next/navigation";
import ThemeButton from "../atoms/theme-button";

const nonNoteRootPaths = new Set(["", "timeline", "work", "graph", "map", "photobook", 'shop']);

export function ToolBoxIcons() {
  const initializeToggles = useToggleStore((s) => s.initializeToggles);
  const pathname = usePathname();

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const isEnabled = useToggleStore((s) => s.toggles['toolBox']);
  const rootPath = pathname.split('/').slice(1, 2).toString();
  const shouldHideToolBoxIcon = nonNoteRootPaths.has(rootPath);

  return (
    <div className={`
      flex h-8 shrink-0 min-w-fit transition-[width] duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)]
      items-start origin-top gap-1
      ${shouldHideToolBoxIcon ? 'w-auto' : isEnabled ? 'w-89' : 'w-17'}
    `}>
      {!shouldHideToolBoxIcon && (
        <EnableButton
          value={{
            value: 'toolBox',
            name: <Ellipsis className="w-4 h-4 md:w-3.5 md:h-3.5 shrink-0 z-10"/>,
            title: "도구 상자",
          }}
        />
      )}
      <ThemeButton />
    </div>
  )
}
