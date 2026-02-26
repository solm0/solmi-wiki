'use client'

import MenuButton, { SmallMenuButton } from "../atoms/MenuButtons";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";

const menus = [
  { href: '', name: 'solmi.wiki' },
  { href: 'blog', name: '블로그' },
  { href: 'work', name: '작업' },
  { href: 'graph', name: '하이퍼링크 맵' },
  { href: 'map', name: '세계지도' },
]

export default function Menus() {
  const pathname = usePathname();
  const rootPath = pathname.split('/').slice(1, 2).toString();
  const smallScreenVisible = menus.find(menu => menu.href === rootPath) ?? menus[0];
  const smallScreenHidden = menus.filter(menu => menu.href !== smallScreenVisible.href);

  const initializeToggles = useToggleStore((s) => s.initializeToggles);

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const isEnabled = useToggleStore((s) => s.toggles['noteInspector']);

  return (
    <>
      {/* md 이상 */}
      <div className={`${isEnabled ? 'lg:left-72' : 'lg:left-30'} hidden md:flex absolute left-14 lg:translate-0 h-4 w-auto gap-1 text-sm items-center text-nowrap transition-[left] duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)]`}>
        <Suspense>
          {menus.map((menu, i) => 
            <MenuButton key={i} href={menu.href} name={menu.name} rootPath={rootPath} />
          )}
        </Suspense>
      </div>

      {/* sm */}
      <div className={`flex md:hidden absolute left-14 lg:translate-0 h-4 w-auto gap-1 text-sm items-center text-nowrap transition-[left] duration-200 ease-[cubic-bezier(0.75,0.05,0.45,0.95)]`}>
        <Suspense>
          <SmallMenuButton visible={smallScreenVisible} hidden={smallScreenHidden} rootPath={rootPath} />
        </Suspense>
      </div>
    </>
  )
}