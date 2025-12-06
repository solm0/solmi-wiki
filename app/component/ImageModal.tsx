import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarouselNode } from "../lib/type";
import { useCallback, useState } from "react";
import { pretendard } from "../lib/localfont";

export default function ImageModal({
  idx, setIdx, carousel
}: {
  idx: number | null;
  setIdx: (idx: number | null) => void;
  carousel: CarouselNode;
}) {
  const generateUrl = (idx: number) => {
    const cloudName = "dpqjfptr6";
    const publicId = carousel.props.items[idx]?.imageSrc;
    console.log(publicId)
    const isGif = publicId.toLowerCase().startsWith('gif');
        const transformations = isGif
          ? "f_auto,q_auto"
          : "f_auto,q_auto,c_fill";
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}.jpg`;
  }

  const [scale, setScale] = useState(0.8);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => {
      let next = prev - e.deltaY * 0.001; // scroll up → zoom in
      if (next < 0.3) next = 0.3; // min zoom
      if (next > 5) next = 5;     // max zoom
      return next;
    });
  }, []);

  if (idx === null) {
    return null;
  } else return (
    <div
      className="fixed backdrop-blur-2xl w-screen h-screen top-0 left-0 z-80 flex items-center justify-center"
      onWheel={handleWheel}
    >
      {/* 배경 */}
      <div
        className="absolute w-full h-full backdrop-blur-2xl bg-background opacity-70"
        onClick={() => setIdx(null)}
      />

      {/* 안내문구 */}
      <p className={`${pretendard.className} absolute top-10 left-1/2 -translate-x-1/2 text-text-800 animate-pulse z-80`}>
        스크롤하여 확대 / 축소
      </p>

      {/* 이미지 */}
      <div
        className='fixed flex items-center justify-center'
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
          alt={carousel.props.items[idx]?.alt}
          unoptimized
        />
      </div>

      {/* alt, 컨트롤 */}
      <div className="fixed w-screen mb-8 left-0 bottom-0 text-sm flex flex-col gap-7 items-center">
        <p className={`${pretendard.className} text-text-800`}>
          {carousel.props.items[idx]?.alt}
        </p>

        <div className="flex justify-center items-center gap-4">
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

          <span>{`${idx+1}/${carousel.props.items.length}`}</span>
          
          <button
            className={`
              px-2 h-8 rounded-sm transition-filter duration-300 backdrop-blur-sm bg-button-100 hover:bg-button-200
              ${idx >= carousel.props.items.length-1 ? 'pointer-events-none text-text-600' : 'pointer-events-auto text-text-800'}
            `}
            onClick={() => setIdx(idx+1)}
            disabled={idx >= carousel.props.items.length-1}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}