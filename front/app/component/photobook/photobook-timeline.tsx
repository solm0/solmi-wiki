'use client'

import { useRef, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { PhotobookImage } from '@/app/lib/type';

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

function TimelineImageItem({
  image,
  alt,
}: {
  image: PhotobookImage;
  alt: string;
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
          'h-auto w-full rounded-none bg-button-100 transition-opacity duration-700',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
        loading="lazy"
        unoptimized
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function PhotoMosaic({
  images,
  altPrefix,
  columnCount = 2,
}: {
  images: PhotobookImage[];
  altPrefix: string;
  columnCount?: number;
}) {
  return (
    <div
      className="[column-gap:0.35rem]"
      style={{ columnCount }}
    >
      {images.map((image, idx) => (
        <TimelineImageItem
          key={image.publicId}
          image={image}
          alt={`${altPrefix} ${idx + 1}`}
        />
      ))}
    </div>
  );
}

function DesktopEntry({
  entry,
  index,
  visibleCount,
  onExpand,
}: {
  entry: TimelineEntry;
  index: number;
  visibleCount: number;
  onExpand: () => void;
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

      <div className="relative flex min-h-0 flex-1 flex-col border-t border-text-900/60 pt-8 pr-4">
        <span className="absolute left-0 top-0 h-3 -translate-y-1/2 border-l border-text-900/60" />

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
          <PhotoMosaic
            images={visibleImages}
            altPrefix={entry.title}
            columnCount={columnCount}
          />
        </div>
        {visibleCount < entry.images.length && (
          <button
            type="button"
            className="mt-2 block self-start text-lg p-2 hover:text-text-700 transition-colors"
            onClick={onExpand}
          >
            +
          </button>
        )}
      </div>
    </article>
  );
}

function MobileEntry({
  entry,
  index,
  visibleCount,
  onExpand,
}: {
  entry: TimelineEntry;
  index: number;
  visibleCount: number;
  onExpand: () => void;
}) {
  const visibleImages = entry.images.slice(0, visibleCount);
  const extraSteps = Math.max(0, Math.floor((visibleCount - initialBatchSize) / batchSize));
  const sectionHeight = baseMobileHeight + extraSteps * mobileHeightStep;

  return (
    <article
      className="grid grid-cols-[max-content_1px_minmax(0,1fr)] gap-x-3"
      style={{ minHeight: sectionHeight }}
    >
      <div className="max-w-25 shrink-0 break-keep pt-7 text-left text-xs">
        <Link href={`/${entry.id}`} className="flex flex-col">
          <span>{entry.title}</span>
        </Link>
      </div>

      <div className="relative h-full bg-text-900/60">
        <span className="absolute left-1/2 top-8 w-3 -translate-x-1/2 -translate-y-1/2 border-t border-text-900/60" />
      </div>

      <div className="flex min-h-0 flex-col pt-8">
        <PhotoMosaic
          images={visibleImages}
          altPrefix={entry.title}
          columnCount={2}
        />
        {visibleCount < entry.images.length && (
          <button
            type="button"
            className="mt-2 block text-lg hover:text-text-700 transition-colors"
            onClick={onExpand}
          >
            +
          </button>
        )}
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

  return (
    <>
      <section
        ref={desktopScrollRef}
        className="hidden h-[100svh] w-full overflow-x-auto overflow-y-hidden md:block"
        onWheel={(e) => {
          const container = desktopScrollRef.current;
          if (!container) return;
          if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

          e.preventDefault();
          container.scrollLeft += e.deltaY;
        }}
      >
        <div className="flex h-full min-w-max items-start px-8 pt-12 box-border">
          {entries.map((entry, index) => (
            <DesktopEntry
              key={entry.id}
              entry={entry}
              index={index}
              visibleCount={visibleCounts[entry.id] ?? initialBatchSize}
              onExpand={() => expandEntry(entry.id, entry.images.length)}
            />
          ))}
        </div>
      </section>

      <section className="h-[100svh] w-full overflow-y-auto px-4 pt-20 md:hidden">
        {entries.map((entry, index) => (
          <MobileEntry
            key={entry.id}
            entry={entry}
            index={index}
            visibleCount={visibleCounts[entry.id] ?? initialBatchSize}
            onExpand={() => expandEntry(entry.id, entry.images.length)}
          />
        ))}
      </section>
    </>
  );
}
