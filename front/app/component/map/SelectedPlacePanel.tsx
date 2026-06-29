'use client'

import clsx from "clsx";
import { useRef } from "react";
import { Place } from "@/app/lib/type";
import { PlaceIndexIcon } from "../document/PlacePlaceholder";
import RelatedPostLists from "./RelatedPostLists";

export default function SelectedPlacePanel({
  selectedPlace,
  onClose,
}: {
  selectedPlace?: {
    idx: number;
    data?: Place;
  };
  onClose: () => void;
}) {
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const isOpen = Boolean(selectedPlace?.data);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    const touch = e.touches[0];
    swipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    const start = swipeStartRef.current;
    const touch = e.changedTouches[0];

    swipeStartRef.current = null;

    if (!start || window.innerWidth >= 768) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaY) < 56) return;
    if (Math.abs(deltaY) <= Math.abs(deltaX) * 1.2) return;
    if (deltaY > 0) {
      onClose();
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={clsx(
        "fixed z-70 pointer-events-none transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.75,0.05,0.45,0.95)] text-sm",
        "md:right-4 md:bottom-4 md:w-[26rem]",
        "bottom-0 left-0 w-full md:left-auto",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-[calc(100%+1rem)] md:translate-y-8 opacity-0",
      )}
    >
      <section
        className={clsx(
          "pointer-events-auto bg-background/90 backdrop-blur-xl text-text-900 shadow-[0_12px_36px_rgba(0,0,0,0.14)]",
          "md:rounded-md",
          "rounded-t-3xl px-4 pt-3 pb-5 md:p-3 md:pr-0 min-h-[20vh] md:min-h-min",
        )}
      >
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-text-700/60 md:hidden" />

        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <PlaceIndexIcon idx={selectedPlace?.idx ?? 0} />
            <span className="truncate">{selectedPlace?.data?.name}</span>
          </div>
        </div>

        <div className="max-h-[40vh] overflow-y-auto   md:max-h-[18rem]">
          {selectedPlace?.data && (
            <RelatedPostLists
              posts={selectedPlace.data.posts}
              placeId={selectedPlace.data.id}
            />
          )}
        </div>
      </section>
    </div>
  );
}
