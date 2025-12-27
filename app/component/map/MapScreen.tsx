'use client'

import { Place } from "@/app/lib/type"
import ToolBox from "../hyperlink-map/ToolBox"
import GlobalMap from "./GlobalMap"
import { useState } from "react";

export default function MapScreen({
  allPlaces,
}: {
  allPlaces: Place[];
}) {
  const [clickedId, setClickedId] = useState<string | null>(null);
  const index = allPlaces.findIndex(p => p.id === clickedId);
  const data = allPlaces[index];

  return (
    <>
      <section className="w-full h-[calc(100vh)] text-text-800 overflow-hidden focus:outline-hidden">
        <GlobalMap
          places={allPlaces}
          clickedId={clickedId}
          setClickedId={setClickedId}
        />
      </section>

      {/* 오른쪽 사이드바 */}
      <ToolBox selectedPlace={{idx: index+1, data: data}} />
    </>
  )
}