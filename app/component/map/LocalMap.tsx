'use client'

import Map, { Layer, Popup, Source, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  // 디폴트 위치
  const hochschuleKempten = {
    longitude: Number(places?.[0]?.lng) ?? 10.313611,
    latitude: Number(places?.[0]?.lat) ?? 47.715833,
    zoom: 16
  }

  // 호버, 클릭 관련
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

  // 마커 데이터 만들기
  
  
  const placeData = useMemo(() => {
    if (!places) return [];
    return places.map((place, i) => 
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
  }, [places]);
  
  const geojson = useMemo<FeatureCollection>(() => ({
    type: 'FeatureCollection',
    features: placeData as Feature<Geometry, GeoJsonProperties>[]
  }), [placeData]);

  // 동선 데이터 만들기
  const [route, setRoute] = useState<Feature<Geometry, GeoJsonProperties> | null>(null);

  async function fetchRoute(start: [number, number], end: [number, number]) {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`
    );
    const data = await res.json();

    const line = data.routes[0].geometry; // LineString

    setRoute({
      type: "Feature",
      geometry: line,
      properties: {}
    });
  }

  useEffect(() => {
    if (!placeData[0] || !placeData[1]) return;

    fetchRoute(
      placeData[0].geometry.coordinates as [number, number],
      placeData[1].geometry.coordinates as [number, number]
    );
  }, [placeData]);

  

  if (!places || places.length === 0) return <NoPost text='선택된 글 없음 또는 이 글에 장소'/>
  else return (
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
      style={{ width: '100%', height: '100%' }}
      mapStyle={`https://api.maptiler.com/maps/019aafb1-6648-769c-889b-369294610c89/style.json?key=5WUNujbtty6Dt1NUzT6r`}
    >
      <Source id='marker-layer' type='geojson' data={geojson}>
        {/* 마커 레이어 */}
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

        {/* 마커 위 인덱스 레이어 */}
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
      {route &&
        <Source id='route' type='geojson' data={route}>
          {/* 동선 레이어 */}
          <Layer
            id='route-line'
            type='line'
            source='route'
            paint={{
              "line-width": 4,
              "line-color": "#ff0000"
            }}
          />

          {/* 동선 위 진행도 레이어 */}
        </Source>
      }

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
  )
}