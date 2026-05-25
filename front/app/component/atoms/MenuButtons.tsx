'use client'

import { useSearchParams } from "next/navigation";
import clsx from 'clsx';
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
  visible, hidden, rootPath
}: {
  visible: {href:string;name:string};
  hidden: {href:string;name:string}[];
  rootPath: string;
}) {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='ml-1 flex gap-2 items-center text-text-900 w-auto h-auto'>
      <Link
        href={`/${visible.href}?${searchParams}`}
        className={`
          flex w-auto h-auto items-center rounded-sm px-2 py-1
          ${rootPath === visible.href ? "bg-button-100" : "bg-transparent hover:bg-button-100 transition-colors duration-300"}
        `}
      >
        {visible.name}
      </Link>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Ellipsis className="w-5 h-5 hover:text-text-700 transition-all duration-300" />
        {isOpen &&
          <div
            onMouseLeave={() => setIsOpen(false)}
            className="absolute top-10 left-0 rounded-sm bg-button-100 px-3 py-2 flex flex-col items-start"
          >
            {hidden.map((menu, i) =>
              <Link
                key={i}
                href={`/${menu.href}?${searchParams}`}
                className="py-1 hover:text-text-700 transition-all duration-300"
              >
                {menu.name}
              </Link>
            )}
          </div>
        }
      </button>
    </div>
  )
}