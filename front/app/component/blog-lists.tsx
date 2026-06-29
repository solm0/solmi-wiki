'use client'

import { useEffect, useRef, useState } from "react"
import PostList from "./post-list";
import { Post } from "../lib/type";
import { maruburi } from "../lib/localfont";

export default function BlogLists({
  posts,
}: {
  posts: Post[] | null;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [visibleIds, setVisibleIds] = useState<Record<string, true>>({});
  const sectionRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!posts) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setVisibleIds(
        posts.reduce((acc, post) => {
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

    posts.forEach((post) => {
      const el = itemRefs.current[post.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [posts]);

  return (
    <section
      ref={sectionRef}
      className={`${maruburi.className} font-semibold relative min-h-0 w-full pt-[40vh] pb-8 focus:outline-hidden`}
    >
      {posts && posts.map((note, idx) => (
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
    </section>
  )
}
