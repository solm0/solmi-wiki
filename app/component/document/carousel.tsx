'use client'

import { CarouselNode } from "@/app/lib/type";
import { useState } from "react";
import { pretendard } from "@/app/lib/localfont";
import Image from 'next/image';
import ImageModal from "../ImageModal";

export default function Carousel({
  carIdx,
  carousel,
}: {
  carIdx: number,
  carousel: CarouselNode,
}) {
  const [idx, setIdx] = useState<number | null>(null);

  return (
    <div
      className="w-full overflow-y-hidden overflow-x-scroll flex gap-1 snap-x h-auto overscroll-auto custom-hor-scrollbar my-4"
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

        const publicId = item.imageSrc;
        const isGif = publicId.toLowerCase().startsWith('gif');
        const transformations = isGif
          ? "f_auto,q_auto"
          : "f_auto,q_auto,c_fill";
        
        const url = `https://res.cloudinary.com/${cloudName}/${type}/upload/${transformations}/${publicId}.${ext}`;

        if (item.type === 'video') {
          return (
            <div
              key={idx}
              className="relative flex flex-col gap-1 snap-start snap-normal h-auto shrink-0"
            >
              <video
                src={url}
                width={800}
                height={800}
                className="h-[22rem] md:h-[30rem] w-auto object-contain rounded-sm cursor-pointer"
                controls
              />
              {item.alt && <p className={`${pretendard.className} text-sm h-4 text-text-700`}>{item.alt}</p>}
            </div>
          )
        } else if (item.type === 'audio') {
          return (
            <div
              key={idx}
              className="relative flex flex-col gap-1 snap-start snap-normal h-auto shrink-0"
            >
              <div className="py-4 w-auto h-auto flex items-center justify-center">
                <audio controls className="w-80">
                  <source src={url} type={`audio/mp3`} />
                  Your browser does not support the audio tag.
                </audio>
              </div>
              {item.alt && <p className={`${pretendard.className} text-sm h-4 text-text-700`}>{item.alt}</p>}
            </div>
          )
        } else {
          return (
            <div
              key={idx}
              className="relative flex flex-col gap-1 snap-start snap-normal h-auto shrink-0"
              title="클릭하여 확대"
            >
              <Image
                src={url}
                width={800}
                height={800}
                className="h-[22rem] md:h-[30rem] w-auto object-contain rounded-sm cursor-pointer"
                alt={item.alt}
                id={`img-${carIdx}-${idx}`}
                onClick={() => setIdx(idx)}
                unoptimized
              />
              {item.alt && <p className={`${pretendard.className} text-sm h-4 text-text-700`}>{item.alt}</p>}
            </div>
          )
        }
      })}

      <ImageModal
        idx={idx}
        setIdx={setIdx}
        carousel={carousel}
      />
    </div>
  )
}