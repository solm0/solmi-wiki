import { Place } from "@/app/lib/type"
import { useClickedPlace } from "@/app/lib/zustand/useClickedPlace";
import { useEffect, useRef, useState } from "react";
import ToolTip from "../atoms/ToolTip";

export default function PlacePlaceholder({
  placeId, places
}: {
  placeId: string
  places?: Place[];
}) {
  const [hovered, setHovered] = useState(false);
  
  const clickedId = useClickedPlace(state => state.id);
  const setClickedId = useClickedPlace(state => state.setId);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (clickedId === placeId && buttonRef.current) {
      buttonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      buttonRef.current.classList.add("bg-green-500")
      setTimeout(() => {
        if (buttonRef.current) buttonRef.current.classList.remove("bg-green-500");
      }, 800);
    }
  }, [clickedId]);

  if (!places) return;
  const label = places.find(p => p.id === placeId)?.name;

  return (
    <>
      <button
        ref={buttonRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setClickedId(placeId)}
        className="bg-button-100 hover:bg-button-200 px-3 rounded-sm transition-colors duration-300"
      >
        {label}
      </button>

      {label && hovered &&
        <ToolTip label={`클릭하여 우측 사이드바의 '지도'에서 ${label}로 이동`} />
      }
    </>
  )
}