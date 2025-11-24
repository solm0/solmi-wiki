'use client'

import Map, { Layer, Popup, Source, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { Place } from '@/app/lib/type';
import { NoPost } from '../hyperlink-map/ToolBox';
import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties
} from 'geojson';
import { useClickedPlace } from '@/app/lib/zustand/useClickedPlace';

export default function LocalMap({
  places,
}: {
  places?: Place[];
}) {
  

  const hochschuleKempten = {
    longitude: Number(places?.[0]?.lng) ?? 10.313611,
    latitude: Number(places?.[0]?.lat) ?? 47.715833,
    zoom: 16
  }

  const [viewState, setViewState] = useState(hochschuleKempten);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const clickedId = useClickedPlace(state => state.id);
  const setClickedId = useClickedPlace(state => state.setId);
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

  if (!places || places.length === 0) return <NoPost text='선택된 글 없음 또는 이 글에 장소'/>
  
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
    <>
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
          if (feature) setClickedId(feature.properties.id)
        }}
        onMove={(e) => setViewState(e.viewState)}
        style={{ width: 320, height: 320 }}
        mapStyle={`https://api.maptiler.com/maps/019aafb1-6648-769c-889b-369294610c89/style.json?key=5WUNujbtty6Dt1NUzT6r`}
      >
        <Source id='marker-layer' type='geojson' data={geojson}>
          <Layer
            id='marker'
            type='circle'
            source='marker'
            paint={{
              'circle-radius': 10,
              'circle-color': '#007cbf',
              'circle-opacity': [
                'case',
                ["==", ['get', 'id'], hoveredId],
                0.5,
                1
              ],
              'circle-opacity-transition': { duration: 300 }
            }}
          />
          <Layer
            id='marker-labels'
            type='symbol'
            source='marker'
            layout={{
              'text-field': ['get', 'i'],
              'text-size': 14,
              'text-offset': [0, 0]
            }}
            paint={{
              'text-color': '#fff'
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
            <div>클릭하여 이 글에서 {places.find(p => p.id === hoveredId)?.name}가 언급된 위치로 이동</div>
          </Popup>
        )}
      </Map>

    </>
  )
}