'use client'

import { useEffect } from "react";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";
import { pretendard } from "@/app/lib/localfont";
import clsx from "clsx";

export default function HyperlinkMapInline({
  children,
}: {
  children: React.ReactNode;
}) {
  const initializeToggles = useToggleStore((s) => s.initializeToggles);

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const isEnabled = useToggleStore((s) => s.toggles['toolBox']);

  return (
    <nav className={clsx (
      `${pretendard.className} md:hidden relative top-0 flex flex-col gap-1 text-text-900 text-sm w-auto max-w-80 h-auto`,
      isEnabled ? 'block' : 'hidden',
    )}>
      {children}
    </nav>
  )
}