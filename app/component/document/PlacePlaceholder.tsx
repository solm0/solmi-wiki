import { Place } from "@/app/lib/type"
import { useClickedPlace } from "@/app/lib/zustand/useClickedPlace";
import { useEffect, useRef, useState } from "react";
import ToolTip from "../atoms/ToolTip";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";

export function PlaceIndexIcon({idx}:{idx:number}){
  return <div className="w-6 h-6 bg-green-500 rounded-full border-[0.5px] border-green-900 text-green-900 flex items-center justify-center shrink-0">{idx}</div>
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
  const setIsToolBoxOpen = useToggleStore(s => s.setToggle);
  
  useEffect(() => {
    if (clickedId === placeId && buttonRef.current) {
      buttonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
      buttonRef.current.classList.add("bg-green-500");
      buttonRef.current.classList.add("hover:bg-green-500");
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.classList.remove("bg-green-500");
          buttonRef.current.classList.remove("hover:bg-green-500");
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
          if (!isToolBoxOpen) setIsToolBoxOpen('toolBox', true)
        }}
        className="border border-text-600 bg-button-50 hover:bg-button-100 pl-2 pr-3 py-1 rounded-full transition-colors duration-300 flex items-center gap-2 leading-[1.5em] text-left min-h-10"
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