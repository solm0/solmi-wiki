'use client'

import { Place } from "@/app/lib/type"
import GlobalMap from "./GlobalMap"
import { useState } from "react";
import SelectedPlacePanel from "./SelectedPlacePanel";

export default function MapScreen({
  allPlaces
}: {
  allPlaces: Place[];
}) {
  const [clickedId, setClickedId] = useState<string | null>(null);
  const index = allPlaces.findIndex(p => p.id === clickedId);
  const data = allPlaces[index];

  return (
    <>
      <section className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
        <GlobalMap
          places={allPlaces}
          clickedId={clickedId}
          setClickedId={setClickedId}
        />
      </section>

      <div className="relative gap-8 w-full pointer-events-none"></div>
      <SelectedPlacePanel
        selectedPlace={{idx: index+1, data: data}}
        onClose={() => setClickedId(null)}
      />
    </>
  )
}
