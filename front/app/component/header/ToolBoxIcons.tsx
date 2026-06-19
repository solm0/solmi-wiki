'use client'

import EnableButton from "../atoms/enable-button";
import { FlaskConical } from "lucide-react";
import { useEffect } from "react";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";
import { usePathname } from "next/navigation";

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

  if (shouldHideToolBoxIcon) return null;

  return (
    <div className={`
      flex h-8 transition-[width] duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)]
      items-start origin-top
      ${isEnabled ? 'w-80' : 'w-8'}
    `}>
      <EnableButton
        value={{
          value: 'toolBox',
          name: <FlaskConical className="w-4 h-4 shrink-0 z-10"/>,
          title: "도구 상자",
        }}
      />
    </div>
  )
}
