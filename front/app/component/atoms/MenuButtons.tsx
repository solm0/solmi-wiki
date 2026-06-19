'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from 'clsx';
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function MenuButton({
  href, name, rootPath
}: {
  href: string;
  name: string;
  rootPath: string;
}) {
  const searchParams = useSearchParams();

  return (
    <Link
      href={`/${href}?${searchParams}`}
      className={clsx(
        "hidden md:flex w-auto h-auto text-text-900 items-center rounded-sm hover:bg-button-100 px-2 py-1 transition-colors duration-300",
        rootPath === href ? "bg-button-100" : "bg-transparent",
      )}
    >
      {name}
    </Link>
  )
}

export function SmallMenuButton({
  hidden,
}: {
  hidden: {href:string;name:string}[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const overlay = isOpen && typeof document !== 'undefined'
    ? createPortal(
        <button
          type="button"
          aria-label="메뉴 닫기"
          className="fixed inset-0 z-50 bg-text-600/60"
          onClick={() => {
            setIsOpen(false);
          }}
        />,
        document.body
      )
    : null;

  return (
    <div className='ml-1 flex items-start text-text-900 w-auto h-auto'>
      {overlay}

      <div className="relative z-70 flex flex-col items-start">
        <button
          type="button"
          onClick={() => {
            if (isOpen) {
              router.push('/');
              return;
            }
            setIsOpen(true);
          }}
          className={clsx(
            "flex w-auto h-auto items-center px-2 py-1 transition-all duration-300 text-xs",
            isOpen
              ? "bg-background text-text-950"
              : "bg-transparent hover:bg-button-100",
          )}
        >
          solmi.wiki
        </button>

        <div
          className={clsx(
            "absolute top-full left-0 mt-2 flex flex-col items-start gap-2 transition-all duration-300",
            isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          {hidden.map((menu, i) => (
            <Link
              key={i}
              href={`/${menu.href}?${searchParams}`}
              className={clsx(
                "rounded-sm bg-background px-2 py-1 text-text-900 transition-all duration-300 hover:opacity-50",
                isOpen ? "translate-y-0 scale-100" : "-translate-y-2 scale-95",
              )}
              style={{
                transitionDelay: isOpen ? `${i * 45}ms` : '0ms',
              }}
            >
              {menu.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
