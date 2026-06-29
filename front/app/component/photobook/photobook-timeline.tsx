'use client'

import { useRef, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { CarouselItem, PhotobookImage } from '@/app/lib/type';
import ImageModal from '@/app/component/ImageModal';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dpqjfptr6';
const imageTransform = 'f_auto,q_auto,w_1200';
const initialBatchSize = 5;
const batchSize = 8;
const baseDesktopWidth = 420;
const desktopWidthStep = 220;
const baseMobileHeight = 240;
const mobileHeightStep = 120;

type TimelineEntry = {
  id: string;
  title: string;
  folder: string;
  images: PhotobookImage[];
};

function buildImageUrl(image: PhotobookImage) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${imageTransform}/${image.publicId}.${image.format}`;
}

function canScrollVertically(el: HTMLElement, deltaY: number) {
  if (deltaY > 0) {
    return el.scrollTop + el.clientHeight < el.scrollHeight - 1;
  }

  if (deltaY < 0) {
    return el.scrollTop > 1;
  }

  return false;
}

function TimelineImageItem({
  image,
  alt,
  onClick,
}: {
  image: PhotobookImage;
  alt: string;
  onClick?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mb-1 break-inside-avoid">
      <Image
        src={buildImageUrl(image)}
        alt={alt}
        width={image.width}
        height={image.height}
        className={clsx(
          'h-auto w-full rounded-none bg-button-100 transition-opacity duration-700 cursor-pointer',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
        loading="lazy"
        unoptimized
        onLoad={() => setLoaded(true)}
        onClick={onClick}
      />
    </div>
  );
}

function PhotoMosaic({
  images,
  altPrefix,
  columnCount = 2,
  onImageClick,
  onExpand,
  canExpand = false,
}: {
  images: PhotobookImage[];
  altPrefix: string;
  columnCount?: number;
  onImageClick?: (idx: number) => void;
  onExpand?: () => void;
  canExpand?: boolean;
}) {
  return (
    <div
      className="gap-1"
      style={{ columnCount }}
    >
      {images.map((image, idx) => (
        <TimelineImageItem
          key={image.publicId}
          image={image}
          alt={`${altPrefix} ${idx + 1}`}
          onClick={onImageClick ? () => onImageClick(idx) : undefined}
        />
      ))}

      {canExpand && onExpand ? (
        <div className="mb-1 break-inside-avoid">
          <button
            type="button"
            className="flex aspect-square w-full items-center justify-center bg-button-100 text-text-900 transition-opacity duration-300 hover:opacity-50"
            onClick={onExpand}
            aria-label={`${altPrefix} 사진 더 보기`}
          >
            <span className="text-lg leading-none">+</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function DesktopEntry({
  entry,
  index,
  visibleCount,
  onExpand,
  onImageClick,
}: {
  entry: TimelineEntry;
  index: number;
  visibleCount: number;
  onExpand: () => void;
  onImageClick: (idx: number) => void;
}) {
  const extraSteps = Math.max(0, Math.floor((visibleCount - initialBatchSize) / batchSize));
  const width = baseDesktopWidth + extraSteps * desktopWidthStep;
  const visibleImages = entry.images.slice(0, visibleCount);
  const columnCount = Math.min(5, 2 + extraSteps);

  return (
    <article
      className="flex h-full shrink-0 flex-col"
      style={{ width }}
    >
      <div className="flex h-32 flex-col justify-start pb-4 pr-6 pt-20 shrink-0">
        <Link
          href={`/${entry.id}`}
          className="max-w-[18em] break-keep transition-colors hover:text-text-700"
        >
          <span>{entry.title}</span>
        </Link>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col border-t border-text-900/60 pt-4 pr-1">
        <span className="absolute left-0 top-0 h-6 -translate-y-1/2 border-l border-text-900/60" />

        <div
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar"
          data-photobook-vertical-scroll="true"
        >
          <PhotoMosaic
            images={visibleImages}
            altPrefix={entry.title}
            columnCount={columnCount}
            onImageClick={onImageClick}
            onExpand={onExpand}
            canExpand={visibleCount < entry.images.length}
          />
        </div>
      </div>
    </article>
  );
}

function MobileEntry({
  entry,
  index,
  visibleCount,
  onExpand,
  onImageClick,
}: {
  entry: TimelineEntry;
  index: number;
  visibleCount: number;
  onExpand: () => void;
  onImageClick: (idx: number) => void;
}) {
  const visibleImages = entry.images.slice(0, visibleCount);
  const extraSteps = Math.max(0, Math.floor((visibleCount - initialBatchSize) / batchSize));
  const sectionHeight = baseMobileHeight + extraSteps * mobileHeightStep;

  return (
    <article
      className="grid grid-cols-[max-content_1px_minmax(0,1fr)] gap-x-3"
      style={{ minHeight: sectionHeight }}
    >
      <div className="w-25 shrink-0 break-keep pt-7 text-left text-xs">
        <Link href={`/${entry.id}`} className="flex flex-col">
          <span>{entry.title}</span>
        </Link>
      </div>

      <div className="relative h-full bg-text-900/60">
        <span className="absolute left-1/2 top-8 w-6 -translate-x-1/2 -translate-y-1/2 border-t border-text-900/60" />
      </div>

      <div className="flex min-h-0 flex-col pt-8">
        <PhotoMosaic
          images={visibleImages}
          altPrefix={entry.title}
          columnCount={2}
          onImageClick={onImageClick}
          onExpand={onExpand}
          canExpand={visibleCount < entry.images.length}
        />
      </div>
    </article>
  );
}

export default function PhotobookTimeline({
  entries,
}: {
  entries: TimelineEntry[];
}) {
  const desktopScrollRef = useRef<HTMLElement | null>(null);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
    Object.fromEntries(
      entries.map((entry) => [entry.id, Math.min(initialBatchSize, entry.images.length)]),
    ),
  );

  const expandEntry = (entryId: string, totalImages: number) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [entryId]: Math.min((prev[entryId] ?? initialBatchSize) + batchSize, totalImages),
    }));
  };

  const activeEntry = activeEntryId
    ? entries.find((entry) => entry.id === activeEntryId) ?? null
    : null;
  const modalItems: CarouselItem[] = activeEntry
    ? activeEntry.images.map((image, idx) => ({
        alt: `${activeEntry.title} ${idx + 1}`,
        imageSrc: image.publicId,
        type: 'image',
        fit: '',
        isGif: image.format === 'gif',
      }))
    : [];

  return (
    <>
      <section
        ref={desktopScrollRef}
        className="hidden h-[100svh] w-full overflow-x-auto overflow-y-hidden md:block"
        onWheel={(e) => {
          const container = desktopScrollRef.current;
          if (!container) return;
          if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

          const target = e.target;
          if (target instanceof HTMLElement) {
            const verticalScroller = target.closest('[data-photobook-vertical-scroll="true"]');

            if (verticalScroller instanceof HTMLElement && canScrollVertically(verticalScroller, e.deltaY)) {
              return;
            }
          }

          e.preventDefault();
          container.scrollLeft += e.deltaY;
        }}
      >
        <div className="flex h-full min-w-max items-start px-8 pt-12 box-border  ">
          {entries.map((entry, index) => (
            <DesktopEntry
              key={entry.id}
              entry={entry}
              index={index}
              visibleCount={visibleCounts[entry.id] ?? initialBatchSize}
              onExpand={() => expandEntry(entry.id, entry.images.length)}
              onImageClick={(idx) => {
                setActiveEntryId(entry.id);
                setActiveImageIdx(idx);
              }}
            />
          ))}
        </div>
      </section>

      <section className="h-[100svh] w-full overflow-y-auto   pl-4 pr-2 pt-20 md:hidden">
        {entries.map((entry, index) => (
          <MobileEntry
            key={entry.id}
            entry={entry}
            index={index}
            visibleCount={visibleCounts[entry.id] ?? initialBatchSize}
            onExpand={() => expandEntry(entry.id, entry.images.length)}
            onImageClick={(idx) => {
              setActiveEntryId(entry.id);
              setActiveImageIdx(idx);
            }}
          />
        ))}
      </section>

      <ImageModal
        idx={activeImageIdx}
        setIdx={(idx) => {
          setActiveImageIdx(idx);
          if (idx === null) {
            setActiveEntryId(null);
          }
        }}
        items={modalItems}
      />
    </>
  );
}
