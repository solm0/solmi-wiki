'use client'

import { useEffect, useRef, useState } from "react";
import { Post, FormattedText, HeadingNode } from "../lib/type"
import clsx from "clsx";
import { pretendard } from "../lib/localfont";
import { slugify } from "../lib/slugify";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

type Heading = {
  slug: string;
  text: string;
  level: number;
};

export function useIntersectionObserver(
  headings: Heading[] | undefined,
  setActiveHeading: (id: string | null) => void
) {
  const headingRef = useRef<Record<string, IntersectionObserverEntry>>({});

  useEffect(() => {
    if (!headings) return;
    const headingElements: HTMLElement[] = headings
      .map(({ slug }) => document.getElementById(slug))
      .filter((el): el is HTMLElement => el !== null); // Type narrowing

    const callback: IntersectionObserverCallback = (entries) => {
      headingRef.current = entries.reduce((map, entry) => {
        map[entry.target.id] = entry;
        return map;
      }, {} as Record<string, IntersectionObserverEntry>);

      const visibleHeadings = entries.filter((entry) => entry.isIntersecting);

      if (visibleHeadings.length >= 1) {
        setActiveHeading(visibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px 0px -40% 0px",
    });

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [headings, setActiveHeading]);
}

export default function Toc({
  post,
}: {
  post: Post;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // heading 뽑아내서 매핑하기
  const headings: Heading[] | undefined = post.content?.document
  .filter(doc => doc.type === "heading" && [2, 3].includes(doc.level))
  .map(doc => {
    const text = (doc.children?.[0] as FormattedText).text || 'undefined-heading';
    return {
      slug: slugify(text),
      text: text,
      level: (doc as HeadingNode).level,
    };
  });

  const [hoverHeading, setHoverHeading] = useState<string | null>();
  const [activeHeading, setActiveHeading] = useState<string | null>();
  
  useIntersectionObserver(headings, setActiveHeading);

  return (
    <nav
      className={clsx(
        `${pretendard.className} text-xs`,
        "w-full flex flex-col h-auto text-text-900",
      )}
    >
      {headings && headings.map(({ slug, text, level }, idx) => (
        <div
          key={idx}
          className={`
            w-auto flex items-center gap-2 cursor-pointer
            ${level === 3 ? 'ml-7' : 'ml-0'}
          `}
          style={{ top: `calc(2rem * ${idx})` }}
          onMouseEnter={() => setHoverHeading(slug)}
          onMouseLeave={() => setHoverHeading(null)}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(slug);
            const page = document.getElementById('note_wrapper');

            if (el && page) {
              const containerTop = page.getBoundingClientRect().top;
              const elementTop = el.getBoundingClientRect().top;

              el.style.color = "var(--green-600)";
              el.style.transform = 'scale(1.2)';
              setTimeout(() => {
                el.style.color = "var(--text-950)";
                el.style.transform = 'scale(1)';
              }, 1500);

              const offset = elementTop - containerTop + page.scrollTop - 80;

              page.scrollTo({
                top: offset,
                behavior: 'smooth',
              });

              router.replace(`${pathname}?${searchParams}#${text.replace(/ /g, "-")}`, { scroll: false });
            }
          }}
        >
          <div className="flex items-center justify-center w-3 h-3">
            <div
              className={clsx(
                "rounded-full transition-all duration-300 shrink-0",
                slug === hoverHeading ? 'bg-green-500' : 'bg-button-200',
                slug === activeHeading ? 'w-3 h-3': 'w-[5px] h-[5px]'
              )}
            ></div>
          </div>
          <p
            className={`
              leading-7 truncate bg-background rounded-sm px-2 transition-all duration-300
              ${hoverHeading ? slug === hoverHeading ? 'text-text-900': 'text-text-700' : 'text-text-900'}
            `}
          >
            {text}
          </p>
        </div>
      ))}
    </nav>
  )
}