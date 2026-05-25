'use client'

import Map, { Layer, Popup, Source, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { Place } from '@/app/lib/type';
import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties
} from 'geojson';
import { useToggleStore } from '@/app/lib/zustand/useToggleStore';

export default function GlobalMap({
  places, clickedId, setClickedId
}: {
  places: Place[];
  clickedId: string | null;
  setClickedId: (clickedId: string | null) => void;
}) {
  const hochschuleKempten = {
    longitude: Number(places?.[0]?.lng) ?? 10.313611,
    latitude: Number(places?.[0]?.lat) ?? 47.715833,
    zoom: 2
  }

  const [viewState, setViewState] = useState(hochschuleKempten);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isToolBoxOpen = useToggleStore((s) => s.toggles['toolBox']);
  const setIsToolBoxOpen = useToggleStore(s => s.setToggle);

  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!clickedId || !mapRef.current) return;

    const clickedCoord = placeData.find(p => p.properties.id === clickedId)?.geometry.coordinates ?? [hochschuleKempten.longitude, hochschuleKempten.latitude];
    if (!clickedCoord) return;

    mapRef.current.flyTo({
      center: clickedCoord as [number, number],
      zoom: 16,
      duration: 1000, // ms
      essential: true
    });
  }, [clickedId]);
  
  const placeData = places.map((place, i) => 
    ({
      type: 'Feature',
      geometry: {
        type: "Point",
        coordinates: [Number(place.lng), Number(place.lat)]
      },
      properties: {
        i: i+1,
        id: place.id,
        name: place.name,
      }
    }),
  )
  
  const geojson: FeatureCollection = {
    type: 'FeatureCollection',
    features: placeData as Feature<Geometry, GeoJsonProperties>[]
  }

  return (
    <Map
      ref={mapRef}
      {...viewState}
      interactiveLayerIds={['marker']}
      onMouseMove={(e) => {
        const feature = e.features?.[0];
        if (feature) setHoveredId(feature.properties.id);
        else setHoveredId(null);
      }}
      onClick={(e) => {
        const feature = e.features?.[0];
        if (feature) setClickedId(feature.properties.id);
        if (!isToolBoxOpen) setIsToolBoxOpen('toolBox', true);
      }}
      onMove={(e) => setViewState(e.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle={`https://api.maptiler.com/maps/019aafb1-6648-769c-889b-369294610c89/style.json?key=5WUNujbtty6Dt1NUzT6r`}
    >
      <Source id='marker-layer' type='geojson' data={geojson}>
        <Layer
          id='marker'
          type='circle'
          source='marker'
          paint={{
            'circle-radius': 13,
            'circle-color': '#00EB95',
            'circle-opacity': [
              'case',
              ["==", ['get', 'id'], hoveredId],
              0.5,
              1
            ],
            'circle-opacity-transition': { duration: 300 },
            'circle-stroke-color': '#009B71',
            'circle-stroke-width': 0.5
          }}
        />
        <Layer
          id='marker-labels'
          type='symbol'
          source='marker'
          layout={{
            'text-field': ['get', 'i'],
            'text-size': 14,
            'text-offset': [0, 0],
          }}
          paint={{
            'text-color': '#009B71'
          }}
        />
      </Source>

      {hoveredId && (
        <Popup
          longitude={Number(places.find(p => p.id === hoveredId)?.lng)}
          latitude={Number(places.find(p => p.id === hoveredId)?.lat)}
          closeButton={false}
          closeOnClick={false}
          anchor="bottom"
          offset={20}
        >
          <div>클릭하여 우측 사이드바의 &apos;세계지도&apos;에서 {places.find(p => p.id === hoveredId)?.name}가 언급된 노트 목록 보기</div>
        </Popup>
      )}
    </Map>
  )
}