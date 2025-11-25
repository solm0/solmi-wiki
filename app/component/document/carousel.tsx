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
      className="w-full md:max-w-[47rem] overflow-y-hidden overflow-x-scroll flex gap-4 snap-x h-auto overscroll-auto custom-hor-scrollbar my-4"
    >
      {carousel.props.items.map((item, idx) => {
        const cloudName = "dpqjfptr6";
        const publicId = item.imageSrc;
        const isGif = publicId.toLowerCase().startsWith('gif');
        const transformations = isGif
          ? "f_auto,q_auto"
          : "f_auto,q_auto,c_fill";
        const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}.jpg`;

        return (
          <div
            key={idx}
            className="relative flex flex-col gap-1 snap-start snap-normal h-auto shrink-0"
          >
            <Image
              src={imageUrl}
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
      })}

      <ImageModal
        idx={idx}
        setIdx={setIdx}
        carousel={carousel}
      />
    </div>
  )
}