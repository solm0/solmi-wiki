import { Place } from "@/app/lib/type"
import { useClickedPlace } from "@/app/lib/zustand/useClickedPlace";
import { useEffect, useRef, useState } from "react";
import ToolTip from "../atoms/ToolTip";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";
import { pretendard } from "@/app/lib/localfont";

export function PlaceIndexIcon({idx}:{idx:number}){
  return <div className="w-5 h-5 bg-green-500 rounded-full text-green-900 flex items-center justify-center shrink-0 text-[12px]">{idx}</div>
}

export default function PlacePlaceholder({
  placeId, places,
}: {
  placeId: string
  places?: Place[];
}) {
  const [hovered, setHovered] = useState(false);
  
  const clickedId = useClickedPlace(state => state.id);
  const setClickedId = useClickedPlace(state => state.setId);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isToolBoxOpen = useToggleStore((s) => s.toggles['toolBox']);
  const isMapEnabled = useToggleStore((s) => s.toggles['map']);
  const setToggle = useToggleStore(s => s.setToggle);
  
  useEffect(() => {
    if (clickedId === placeId && buttonRef.current) {
      buttonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
      buttonRef.current.classList.add("opacity-50");
      buttonRef.current.classList.add("opacity-50");
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.classList.remove("opacity-50");
          buttonRef.current.classList.remove("opacity-50");
        };
      }, 800);
    }
  }, [clickedId]);

  if (!places) return;
  const index = places.findIndex(p => p.id === placeId);
  const label = index !== -1 ? places[index].name : undefined;

  return (
    <>
      <button
        id={`placeholder-${placeId}`}
        ref={buttonRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          setClickedId(placeId);
          if (!isToolBoxOpen) setToggle('toolBox', true);
          if (!isMapEnabled) setToggle('map', true);
        }}
        className={`-translate-x-.5 pr-3 py-1 my-3 rounded-sm duration-300 flex items-center gap-2 hover:opacity-50 transition-opacity text-sm ${pretendard.className}`}
      >
        <PlaceIndexIcon idx={index+1} />
        {label}
      </button>

      {label && hovered &&
        <ToolTip label={`클릭하여 우측 사이드바의 '지도'에서 ${label}의 위치로 이동`} />
      }
    </>
  )
}