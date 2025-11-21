'use client'

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import clsx from 'clsx';

export default function LinkButton({
  href,
  name,
  backbutton = false,
}: {
  href: string;
  name: string;
  backbutton?: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const router = useRouter();
  let rootPath = pathname.split('/').slice(1, 2).toString();

  const handleClick = (href: string) => {
    if (href === rootPath) {
      if (backbutton === true) {
        rootPath = "/";
      }
    } else {
      rootPath = href;
    }
    
    router.push(`/${rootPath}?${searchParams}`);
  }

  return (
    <button
      onClick={() => handleClick(href)}
      className={clsx(
        "w-auto h-auto text-text-900 flex items-center rounded-sm hover:bg-button-100 px-2 py-1 transition-colors duration-300",
        rootPath === href ? "bg-button-100" : "bg-transparent",
      )}
    >
      {name}
    </button>
  )
}