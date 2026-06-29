'use client'

import { Post } from "../lib/type";
import { useSearchParams } from "next/navigation";
import { useHoveredLink } from "@/app/lib/zustand/useHoveredLink";
import Link from "next/link";
import clsx from "clsx";
import { FlagTriangleRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { pretendard } from "../lib/localfont";

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
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedLinks = useMemo(
    () => links?.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [links],
  );
  const shouldCollapse = isMobile && (sortedLinks?.length ?? 0) > 5;
  const visibleLinks = shouldCollapse && !isExpanded
    ? sortedLinks?.slice(0, 5)
    : sortedLinks;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  return (
    <section className={`text-xs md:text-sm relative flex flex-col gap-3 md:gap-4 w-full h-auto items-start text-text-900`}>
      <div className="flex gap-2 md:gap-4 items-start">
        <FlagTriangleRight className="w-4 h-4 shrink-0" />
        <Link
          href={`/${backlink.id}/?${newParams}`}
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
          className={`
            break-keep
            ${backlink.id === id ? `text-green-600 pointer-events-none` : 'pointer-events-auto text-text-800 hover:text-text-700 transition-colors duration-300'}
          `}
        >
          {backlink.title}
        </Link>
      </div>

      <div className="border-l border-text-600 flex flex-col ml-1 px-5 md:px-7 gap-[0.6em] break-keep items-start">
        {visibleLinks && visibleLinks.map((link) => (
            <Link
              key={link.id}
              href={`/${link.id}/?${newParams}`}
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
                'leading-[1.5em] flex items-center',
                link.id === id ? `text-green-600 pointer-events-none` : 'pointer-events-auto text-text-800 hover:text-text-700 transition-colors duration-300'
              )}
            >
              {link.title}
            </Link>
        ))}

        {shouldCollapse && (
          <button
            type="button"
            className={`text-xs text-text-700 ${pretendard.className} pb-2 pt-1`}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? '접기' : '더 보기'}
          </button>
        )}
      </div>
      
    </section>
  )
}
