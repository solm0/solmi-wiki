'use client'

import { Post } from "../lib/type";
import { useSearchParams } from "next/navigation";
import { useHoveredLink } from "@/app/lib/zustand/useHoveredLink";
import Link from "next/link";
import clsx from "clsx";
import { FlagTriangleRight } from "lucide-react";

export default function RingLinks({
  id,
  links,
  backlink,
}: {
  id: string;
  links: Post[] | null;
  backlink: Post;
}) {
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const setHoveredId = useHoveredLink((state) => state.setId);

  const sortedLinks = links?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <section className={`text-sm relative flex flex-col gap-3 w-full h-auto items-start text-text-900`}>
      <div className="flex gap-4 items-center">
        <FlagTriangleRight className="w-4 h-4 shrink-0" />
        <Link
          href={`${backlink.id}/?${newParams}`}
          target="_self"
          onMouseEnter={() => {
            if (backlink.id === id) {
              setHoveredId(null, null);
            } else {
              setHoveredId(backlink.title || null, backlink.id || null, false);
            }
          }}
          onMouseLeave={() => setHoveredId(null, null)}
          onClick={() => setHoveredId(null, null)}
          className={clsx(
            backlink.id === id ? `text-green-600 pointer-events-none` : 'pointer-events-auto text-text-800 hover:text-text-700 transition-colors duration-300'
          )}
        >
          {backlink.title}
        </Link>
      </div>

      <div className="border-l border-text-600 flex flex-col ml-1 px-7">
        {sortedLinks && sortedLinks.map((link) => (
            <Link
              key={link.id}
              href={`${link.id}/?${newParams}`}
              target="_self"
              onMouseEnter={() => {
                if (link.id === id) {
                  setHoveredId(null, null);
                } else {
                  setHoveredId(link.title || null, link.id || null, false);
                }
              }}
              onMouseLeave={() => setHoveredId(null, null)}
              onClick={() => setHoveredId(null, null)}
              className={clsx(
                'leading-7 flex items-center',
                link.id === id ? `text-green-600 pointer-events-none` : 'pointer-events-auto text-text-800 hover:text-text-700 transition-colors duration-300'
              )}
            >
              {link.title}
            </Link>
        ))}
      </div>
      
    </section>
  )
}