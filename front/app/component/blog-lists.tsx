'use client'

import { useEffect, useRef, useState } from "react"
import PostList from "./post-list";
import { Post } from "../lib/type";
import { maruburi } from "../lib/localfont";
import Footer from "./footer";

const INITIAL_POST_COUNT = 20;

export default function BlogLists({
  posts,
}: {
  posts: Post[] | null;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleIds, setVisibleIds] = useState<Record<string, true>>({});
  const sectionRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const displayedPosts = isExpanded ? (posts ?? []) : (posts?.slice(0, INITIAL_POST_COUNT) ?? []);
  const hasMorePosts = (posts?.length ?? 0) > INITIAL_POST_COUNT;

  useEffect(() => {
    setIsExpanded(false);
  }, [posts]);

  useEffect(() => {
    if (!displayedPosts.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setVisibleIds(
        displayedPosts.reduce((acc, post) => {
          acc[post.id] = true;
          return acc;
        }, {} as Record<string, true>)
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleIds((prev) => {
          const next = { ...prev };
          let changed = false;

          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const id = entry.target.getAttribute("data-post-id");
            if (!id || next[id]) return;

            next[id] = true;
            observer.unobserve(entry.target);
            changed = true;
          });

          return changed ? next : prev;
        });
      },
      {
        root: null,
        rootMargin: "0px 0px 0px 0px",
        threshold: 0.12,
      }
    );

    displayedPosts.forEach((post) => {
      const el = itemRefs.current[post.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isExpanded, posts]);

  return (
    <section
      ref={sectionRef}
      className={`${maruburi.className} font-semibold relative min-h-0 w-full pt-[40vh] pb-8 focus:outline-hidden`}
    >
      {displayedPosts.map((note, idx) => (
        <div
          key={note.id}
          ref={(el) => {
            itemRefs.current[note.id] = el;
          }}
          data-post-id={note.id}
          className={`
            transition-[opacity,transform] duration-700 ease-out will-change-transform
            ${visibleIds[note.id] ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}
          `}
          style={{ transitionDelay: `${Math.min(idx % 10, 5) * 35}ms` }}
        >
          <PostList
            note={note}
            hovered={hovered}
            setHovered={setHovered}
          />
        </div>
      ))}
      {hasMorePosts && !isExpanded && (
        <div className="h-12 w-full flex items-center font-normal rounded-sm md:pl-2">
          <div className="flex gap-6 text-sm font-bold items-center text-text-700 mr-4 invisible">
            <div className="w-5 md:w-6 shrink-0">0000</div>
            <div className="w-1 md:w-3 shrink-0">00</div>
            <div className="w-2 md:w-3 shrink-0">00</div>
          </div>
          <div className="shrink-0 w-2 mr-2" />
          <button
            type="button"
            className="text-text-700 hover:text-text-800 transition-colors text-sm"
            onClick={() => setIsExpanded(true)}
          >
            더 보기
          </button>
        </div>
      )}
      <div className={`max-w-[47em]`}>
        <Footer giscus={false} />
      </div>
    </section>
  )
}
