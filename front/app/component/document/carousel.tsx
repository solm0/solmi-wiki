'use client'

import { CarouselNode } from "@/app/lib/type";
import clsx from "clsx";
import { useState } from "react";
import { pretendard } from "@/app/lib/localfont";
import Image from 'next/image';
import ImageModal from "../ImageModal";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";

export default function Carousel({
  carIdx,
  carousel, 
}: {
  carIdx: number,
  carousel: CarouselNode,
}) {
  const [idx, setIdx] = useState<number | null>(null);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});
  const isInspectorOpen = useToggleStore((s) => s.toggles['noteInspector']);

  return (
    <>
      <div className="w-full overflow-visible my-4">
        <div
          className={clsx(
            'flex h-auto items-start gap-3 overflow-x-auto overflow-y-hidden -ml-4 w-[calc(100%+1rem)] overscroll-x-none',
            isInspectorOpen
              ? 'md:mx-0 md:w-full'
              : 'md:-ml-32 md:w-[calc(100%+8rem)] md:px-7',
          )}
        >
          {carousel.props.items.map((item, idx) => {
            const cloudName = "dpqjfptr6";

            const type = item.type === 'audio'
              ? 'video'
              : item.type ?? 'image';
            let ext;
            switch (item.type){
              case 'audio': ext = 'mp3'; break;
              case 'video': ext = 'mp4'; break;
              default: ext = 'jpg';
            }
            const horizontalFit = item.fit === 'hor';

            const publicId = item.imageSrc;
            const transformations = item.isGif
              ? "f_auto,q_auto"
              : "f_auto,q_auto,c_fill";
            
            const url = `https://res.cloudinary.com/${cloudName}/${type}/upload/${transformations}/${publicId}.${ext}`;

            if (item.type === 'video') {
              return (
                <div
                  key={idx}
                  className={`
                    relative flex flex-col gap-1 snap-start snap-normal h-auto shrink-0
                    ${horizontalFit ? 'w-full md:w-auto' : ''}
                  `}
                >
                  <video
                    src={url}
                    width={800}
                    height={800}
                    className={`
                      object-contain cursor-pointer
                      ${horizontalFit ? 'w-full h-auto md:max-w-[52em]' : 'h-[22rem] md:h-[30rem] w-auto'}
                    `}
                    controls
                  />
                  {item.alt && <p className={`${pretendard.className} min-h-4 shrink-0 text-sm text-text-700`}>{item.alt}</p>}
                </div>
              )
            } else if (item.type === 'audio') {
              return (
                <div
                  key={idx}
                  className="relative flex flex-col gap-1 snap-start snap-normal h-auto shrink-0"
                >
                  <div className="py-3 w-auto h-auto flex items-center justify-center">
                    <audio controls className="w-80">
                      <source src={url} type={`audio/mp3`} />
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                  {item.alt && <p className={`${pretendard.className} min-h-4 shrink-0 text-sm text-text-700`}>{item.alt}</p>}
                </div>
              )
            } else {
              return (
                <div
                  key={idx}
                  className={`
                    relative flex flex-col gap-1 snap-start snap-normal h-auto shrink-0
                    ${horizontalFit ? 'w-full md:w-auto' : ''}
                  `}
                  title="탭하거나 클릭하여 확대"
                >
                  <div
                className={`
                  relative overflow-hidden
                  ${horizontalFit ? 'w-full' : ''}
                  ${!loadedMap[idx] ? 'bg-button-100 animate-pulse' : ''}
                `}
                  >
                    <Image
                      src={url}
                      width={800}
                      height={800}
                      className={`
                        object-contain cursor-pointer transition-opacity duration-300
                        ${horizontalFit ? 'w-full h-auto md:max-w-[52em]' : 'h-[22rem] md:h-[30rem] w-auto'}
                        ${loadedMap[idx] ? 'opacity-100' : 'opacity-0'}
                      `}
                      alt={item.alt}
                      id={`img-${carIdx}-${idx}`}
                      onClick={() => setIdx(idx)}
                      onLoadingComplete={() =>
                        setLoadedMap(prev => ({ ...prev, [idx]: true }))
                      }
                      unoptimized
                    />
                  </div>

                  {item.alt && (
                    <p className={`${pretendard.className} min-h-4 shrink-0 text-sm text-text-700`}>
                      {item.alt}
                    </p>
                  )}
                </div>
              )
            }
          })}
        </div>
      </div>

      <ImageModal
        idx={idx}
        setIdx={setIdx}
        items={carousel.props.items}
      />
    </>
  )
}
