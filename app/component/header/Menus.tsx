'use client'

import LinkButton from "../atoms/link-button";
import { useToggleStore } from "@/app/lib/use-enabled";
import { useEffect } from "react";

export default function Menus() {
  const initializeToggles = useToggleStore((s) => s.initializeToggles);

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const isEnabled = useToggleStore((s) => s.toggles['noteInspector']);

  const menus = [
    { href: '', name: 'solmi.wiki' },
    { href: 'blog', name: '블로그' },
    { href: 'work', name: '작업' },
    { href: 'graph', name: '하이퍼링크 맵' },
    { href: 'map', name: '지도' },
    { href: 'music', name: '음악' },
  ]

  return (
    <div className={`${isEnabled ? 'lg:left-96' : 'lg:left-36'} absolute left-14 lg:translate-0 h-4 w-auto flex gap-1 text-sm items-center text-nowrap transition-[left] duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)]`}>
      {menus.map((menu, i) => 
        <LinkButton key={i} href={menu.href} name={menu.name} />
      )}
    </div>
  )
}