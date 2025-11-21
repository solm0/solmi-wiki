'use client'

import EnableButton from "../atoms/enable-button";
import { FlaskConical } from "lucide-react";
import { useEffect } from "react";
import { useToggleStore } from "@/app/lib/use-enabled";

export function ToolBoxIcons() {
  const initializeToggles = useToggleStore((s) => s.initializeToggles);

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const isEnabled = useToggleStore((s) => s.toggles['toolBox']);

  return (
    <div className={`
      flex h-8 transition-[width] duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)]
      items-start origin-top
      ${isEnabled ? 'w-85' : 'w-8'}
    `}>
      <EnableButton
        value={{
          value: 'toolBox',
          name: <FlaskConical className="w-4 h-4 shrink-0"/>,
        }}
      />
    </div>
  )
}