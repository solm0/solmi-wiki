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
  const TAP_MOVE_THRESHOLD = 8;
  const MULTI_TOUCH_TAP_GUARD_MS = 250;

  const generateUrl = (idx: number) => {
    const cloudName = "dpqjfptr6";
    const publicId = items[idx]?.imageSrc;
    const transformations = items[idx]?.isGif
      ? "f_auto,q_auto"
      : "f_auto,q_auto,c_fill";
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}.jpg`;
  }

  const [scale, setScale] = useState(0.8);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const pinchStateRef = useRef<{
    distance: number;
    scale: number;
    translate: {
      x: number;
      y: number;
    };
    center: {
      x: number;
      y: number;
    };
  } | null>(null);
  const dragStateRef = useRef<{
    pointerId: number | null;
    originX: number;
    originY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const lastMultiTouchAtRef = useRef(0);

  const clampScale = useCallback((next: number) => {
    if (next < MIN_SCALE) return MIN_SCALE;
    if (next > MAX_SCALE) return MAX_SCALE;
    return next;
  }, []);

  useEffect(() => {
    if (idx !== null) {
      setScale(0.8);
      setTranslate({ x: 0, y: 0 });
      pinchStateRef.current = null;
      dragStateRef.current = null;
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

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) return null;

    const [firstTouch, secondTouch] = [touches[0], touches[1]];
    return {
      x: (firstTouch.clientX + secondTouch.clientX) / 2,
      y: (firstTouch.clientY + secondTouch.clientY) / 2,
    };
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      pinchStateRef.current = null;
      dragStateRef.current = {
        pointerId: null,
        originX: touch.clientX - translate.x,
        originY: touch.clientY - translate.y,
        startX: touch.clientX,
        startY: touch.clientY,
        moved: false,
      };
      return;
    }

    lastMultiTouchAtRef.current = Date.now();

    const distance = getTouchDistance(e.touches);
    const center = getTouchCenter(e.touches);

    if (distance === null || center === null) {
      pinchStateRef.current = null;
      return;
    }

    dragStateRef.current = null;
    pinchStateRef.current = {
      distance,
      scale,
      translate,
      center,
    };
  }, [scale, translate]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && dragStateRef.current) {
      const touch = e.touches[0];
      e.preventDefault();
      const deltaX = touch.clientX - dragStateRef.current.startX;
      const deltaY = touch.clientY - dragStateRef.current.startY;
      if (Math.hypot(deltaX, deltaY) > TAP_MOVE_THRESHOLD) {
        dragStateRef.current.moved = true;
      }
      setTranslate({
        x: touch.clientX - dragStateRef.current.originX,
        y: touch.clientY - dragStateRef.current.originY,
      });
      return;
    }

    const distance = getTouchDistance(e.touches);
    const center = getTouchCenter(e.touches);
    const pinchState = pinchStateRef.current;

    if (distance === null || center === null || !pinchState) {
      return;
    }

    e.preventDefault();
    lastMultiTouchAtRef.current = Date.now();
    setScale(clampScale(pinchState.scale * (distance / pinchState.distance)));
    setTranslate({
      x: pinchState.translate.x + (center.x - pinchState.center.x),
      y: pinchState.translate.y + (center.y - pinchState.center.y),
    });
  }, [clampScale]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      pinchStateRef.current = null;
      dragStateRef.current = {
        pointerId: null,
        originX: touch.clientX - translate.x,
        originY: touch.clientY - translate.y,
        startX: touch.clientX,
        startY: touch.clientY,
        moved: false,
      };
      return;
    }

    const distance = getTouchDistance(e.touches);
    const center = getTouchCenter(e.touches);

    if (distance === null || center === null) {
      pinchStateRef.current = null;
      if (e.touches.length === 0) {
        dragStateRef.current = null;
      }
      return;
    }

    pinchStateRef.current = {
      distance,
      scale,
      translate,
      center,
    };
  }, [scale, translate]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragStateRef.current = {
      pointerId: e.pointerId,
      originX: e.clientX - translate.x,
      originY: e.clientY - translate.y,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [translate]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.pointerId !== e.pointerId) {
      return;
    }

    e.preventDefault();
    const deltaX = e.clientX - dragStateRef.current.startX;
    const deltaY = e.clientY - dragStateRef.current.startY;
    if (Math.hypot(deltaX, deltaY) > TAP_MOVE_THRESHOLD) {
      dragStateRef.current.moved = true;
    }
    setTranslate({
      x: e.clientX - dragStateRef.current.originX,
      y: e.clientY - dragStateRef.current.originY,
    });
  }, []);

  const handlePointerEnd = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.pointerId !== e.pointerId) {
      return;
    }

    const shouldClose =
      !dragStateRef.current.moved &&
      Date.now() - lastMultiTouchAtRef.current > MULTI_TOUCH_TAP_GUARD_MS;

    dragStateRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (shouldClose) {
      setIdx(null);
    }
  }, [setIdx]);

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
        className="absolute z-121 w-full h-full backdrop-blur-2xl bg-button-100/50 opacity-70"
        onClick={() => setIdx(null)}
      />

      {/* 안내문구 */}
      <p className={`${pretendard.className} absolute top-10 z-[122] text-text-800 animate-pulse leading-tight text-sm`}>
        스크롤, 드래그 또는 두 손가락으로 확대 / 축소
      </p>

      {/* 이미지 */}
      <div
        className='fixed z-[122] flex items-center justify-center touch-none'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
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
              px-2 h-8 rounded-sm transition-filter duration-300 hover:opacity-50
              ${idx < 1 ? 'pointer-events-none opacity-10' : 'pointer-events-auto text-text-800'}
            `}
            onClick={() => setIdx(idx-1)}
            disabled={idx < 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-text-800">{`${idx+1} / ${items.length}`}</span>
          
          <button
            className={`
              px-2 h-8 rounded-sm transition-filter duration-300 hover:opacity-50
              ${idx >= items.length-1 ? 'pointer-events-none opacity-10' : 'pointer-events-auto text-text-800'}
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
