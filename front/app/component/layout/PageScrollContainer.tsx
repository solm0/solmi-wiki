'use client'

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const MAX_SCROLL_ENTRIES = 3;
const PAGE_SCROLL_INDEX_KEY = "page-scroll:index";

function buildScrollKey(pathname: string, search: string) {
  return `page-scroll:${pathname}${search ? `?${search}` : ""}`;
}

function rememberScrollKey(storageKey: string) {
  const previousKeys: string[] = JSON.parse(sessionStorage.getItem(PAGE_SCROLL_INDEX_KEY) || "[]");
  const nextKeys = [
    storageKey,
    ...previousKeys.filter((key) => key !== storageKey),
  ].slice(0, MAX_SCROLL_ENTRIES);

  sessionStorage.setItem(PAGE_SCROLL_INDEX_KEY, JSON.stringify(nextKeys));

  const preserved = new Set(nextKeys);
  previousKeys.forEach((key) => {
    if (!preserved.has(key)) {
      sessionStorage.removeItem(key);
    }
  });
}

export default function PageScrollContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const saveScrollPosition = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const storageKey = buildScrollKey(pathname, window.location.search.slice(1));
    sessionStorage.setItem(storageKey, String(el.scrollTop));
    rememberScrollKey(storageKey);
  }, [pathname]);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const storageKey = buildScrollKey(pathname, window.location.search.slice(1));
    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return;

    const top = Number(saved);
    if (Number.isNaN(top)) return;

    const restore = () => {
      el.scrollTop = top;
    };

    restore();
    requestAnimationFrame(restore);
  }, [pathname]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleScroll = () => {
      saveScrollPosition();
    };

    const handlePageHide = () => {
      saveScrollPosition();
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      saveScrollPosition();
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [saveScrollPosition]);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
}
