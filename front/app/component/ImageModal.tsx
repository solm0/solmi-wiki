import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarouselItem } from "../lib/type";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { pretendard } from "../lib/localfont";

export default function ImageModal({
  idx, setIdx, items
}: {
  idx: number | null;
  setIdx: (idx: number | null) => void;
  items: CarouselItem[];
}) {
  const MIN_SCALE = 0.3;
  const MAX_SCALE = 5;

  const generateUrl = (idx: number) => {
    const cloudName = "dpqjfptr6";
    const publicId = items[idx]?.imageSrc;
    const transformations = items[idx]?.isGif
      ? "f_auto,q_auto"
      : "f_auto,q_auto,c_fill";
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}.jpg`;
  }

  const [scale, setScale] = useState(0.8);
  const pinchStateRef = useRef<{
    distance: number;
    scale: number;
  } | null>(null);

  const clampScale = useCallback((next: number) => {
    if (next < MIN_SCALE) return MIN_SCALE;
    if (next > MAX_SCALE) return MAX_SCALE;
    return next;
  }, []);

  useEffect(() => {
    if (idx !== null) {
      setScale(0.8);
      pinchStateRef.current = null;
    }
  }, [idx]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => clampScale(prev - e.deltaY * 0.001));
  }, [clampScale]);

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;

    const [firstTouch, secondTouch] = [touches[0], touches[1]];
    return Math.hypot(
      secondTouch.clientX - firstTouch.clientX,
      secondTouch.clientY - firstTouch.clientY,
    );
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const distance = getTouchDistance(e.touches);

    if (distance === null) {
      pinchStateRef.current = null;
      return;
    }

    pinchStateRef.current = {
      distance,
      scale,
    };
  }, [scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const distance = getTouchDistance(e.touches);
    const pinchState = pinchStateRef.current;

    if (distance === null || !pinchState) {
      return;
    }

    e.preventDefault();
    setScale(clampScale(pinchState.scale * (distance / pinchState.distance)));
  }, [clampScale]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const distance = getTouchDistance(e.touches);

    if (distance === null) {
      pinchStateRef.current = null;
      return;
    }

    pinchStateRef.current = {
      distance,
      scale,
    };
  }, [scale]);

  if (idx === null) {
    return null;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal((
    <div
      className="fixed backdrop-blur-2xl w-screen h-screen top-0 left-0 z-[120] flex items-center justify-center touch-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 배경 */}
      <div
        className="absolute z-[121] w-full h-full backdrop-blur-2xl bg-background opacity-70"
        onClick={() => setIdx(null)}
      />

      {/* 안내문구 */}
      <p className={`${pretendard.className} absolute top-10 z-[122] text-text-800 animate-pulse leading-tight`}>
        스크롤하거나 두 손가락으로 확대 / 축소
      </p>

      {/* 이미지 */}
      <div
        className='fixed z-[122] flex items-center justify-center'
        onClick={() => setIdx(null)}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <Image
          width={800}
          height={800}
          src={generateUrl(idx)}
          className="w-auto h-auto object-left-top rounded-sm cursor-pointer"
          alt={items[idx]?.alt}
          unoptimized
        />
      </div>

      {/* alt, 컨트롤 */}
      <div className="fixed left-0 bottom-0 z-[122] mb-8 flex w-screen flex-col items-center gap-7 text-sm">
        <p className={`${pretendard.className} text-text-800`}>
          {items[idx]?.alt}
        </p>

        <div className="flex justify-center items-center gap-4 mb-16 md:mb-0">
          <button
            className={`
              px-2 h-8 rounded-sm transition-filter duration-300 backdrop-blur-sm bg-button-100 hover:bg-button-200
              ${idx < 1 ? 'pointer-events-none text-text-600' : 'pointer-events-auto text-text-800'}
            `}
            onClick={() => setIdx(idx-1)}
            disabled={idx < 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span>{`${idx+1}/${items.length}`}</span>
          
          <button
            className={`
              px-2 h-8 rounded-sm transition-filter duration-300 backdrop-blur-sm bg-button-100 hover:bg-button-200
              ${idx >= items.length-1 ? 'pointer-events-none text-text-600' : 'pointer-events-auto text-text-800'}
            `}
            onClick={() => setIdx(idx+1)}
            disabled={idx >= items.length-1}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  ), document.body)
}
