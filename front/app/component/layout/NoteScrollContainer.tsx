'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function buildScrollKey(pathname: string, search: string) {
  return `note-scroll:${pathname}${search ? `?${search}` : ""}`;
}

export default function NoteScrollContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const search = searchParams.toString();
  const storageKey = useMemo(() => buildScrollKey(pathname, search), [pathname, search]);

  const saveScrollPosition = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;

    sessionStorage.setItem(storageKey, String(el.scrollTop));
  }, [storageKey]);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return;

    const top = Number(saved);
    if (Number.isNaN(top)) return;

    const restore = () => {
      el.scrollTop = top;
    };

    restore();
    requestAnimationFrame(restore);
  }, [storageKey]);

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
    <div
      id="note_wrapper"
      ref={wrapperRef}
      className="flex-1 min-w-0 flex gap-4 pt-[40vh] text-text-900 break-normal md:break-keep overflow-y-scroll overflow-x-hidden focus:outline-0"
    >
      {children}
    </div>
  );
}
