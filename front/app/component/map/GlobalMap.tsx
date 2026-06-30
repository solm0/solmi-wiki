'use client'

import Map, { AttributionControl, Layer, Popup, Source, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import { Place } from '@/app/lib/type';
import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties
} from 'geojson';
import { useTheme } from 'next-themes';

const DEFAULT_CENTER = {
  longitude: 10.313611,
  latitude: 47.715833,
};

function toFiniteNumber(value: string | number | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function collapseAttributionControl(map: MapRef | null) {
  const container = map?.getContainer();
  const attribution = container?.querySelector('.maplibregl-ctrl-attrib.maplibregl-compact-show');

  if (!(attribution instanceof HTMLDetailsElement)) return;

  attribution.classList.remove('maplibregl-compact-show');
  attribution.removeAttribute('open');
}

export default function GlobalMap({
  places, clickedId, setClickedId
}: {
  places: Place[];
  clickedId: string | null;
  setClickedId: (clickedId: string | null) => void;
}) {
  const firstPlaceLongitude = toFiniteNumber(places?.[0]?.lng);
  const firstPlaceLatitude = toFiniteNumber(places?.[0]?.lat);

  const initialCenter = {
    longitude: firstPlaceLongitude ?? DEFAULT_CENTER.longitude,
    latitude: firstPlaceLatitude ?? DEFAULT_CENTER.latitude,
    zoom: 2
  };

  const [viewState, setViewState] = useState(initialCenter);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const mapStyle = resolvedTheme === 'dark'
    ? 'https://api.maptiler.com/maps/streets-v2-dark/style.json?key=5WUNujbtty6Dt1NUzT6r'
    : 'https://api.maptiler.com/maps/019aafb1-6648-769c-889b-369294610c89/style.json?key=5WUNujbtty6Dt1NUzT6r';

  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!clickedId || !mapRef.current) return;

    const clickedCoord = placeData.find(p => p.properties.id === clickedId)?.geometry.coordinates ?? [DEFAULT_CENTER.longitude, DEFAULT_CENTER.latitude];
    if (!clickedCoord) return;

    mapRef.current.flyTo({
      center: clickedCoord as [number, number],
      zoom: 16,
      duration: 1000, // ms
      essential: true
    });
  }, [clickedId]);
  
  const placeData = places.flatMap((place, i) => {
    const longitude = toFiniteNumber(place.lng);
    const latitude = toFiniteNumber(place.lat);

    if (longitude === null || latitude === null) {
      return [];
    }

    return [{
      type: 'Feature',
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      properties: {
        i: i+1,
        id: place.id,
        name: place.name,
      }
    }];
  });
  
  const geojson: FeatureCollection = {
    type: 'FeatureCollection',
    features: placeData as Feature<Geometry, GeoJsonProperties>[]
  }

  return (
    <Map
      ref={mapRef}
      {...viewState}
      attributionControl={false}
      interactiveLayerIds={['marker']}
      onMouseMove={(e) => {
        const feature = e.features?.[0];
        if (feature) setHoveredId(feature.properties.id);
        else setHoveredId(null);
      }}
      onClick={(e) => {
        const feature = e.features?.[0];
        if (feature) setClickedId(feature.properties.id);
      }}
      onLoad={() => {
        window.requestAnimationFrame(() => collapseAttributionControl(mapRef.current));
      }}
      onMove={(e) => setViewState(e.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle={mapStyle}
      projection="globe"
    >
      <Source id='marker-layer' type='geojson' data={geojson}>
        <Layer
          id='marker'
          type='circle'
          source='marker'
          paint={{
            'circle-radius': 11,
            'circle-color': '#00EB95',
            'circle-opacity': [
              'case',
              ["==", ['get', 'id'], hoveredId],
              0.5,
              1
            ],
            'circle-opacity-transition': { duration: 300 },
          }}
        />
        <Layer
          id='marker-labels'
          type='symbol'
          source='marker'
          layout={{
            'text-field': ['get', 'i'],
            'text-size': 10,
            'text-offset': [0, 0],
          }}
          paint={{
            'text-color': '#009B71'
          }}
        />
      </Source>

      {hoveredId && toFiniteNumber(places.find(p => p.id === hoveredId)?.lng) !== null && toFiniteNumber(places.find(p => p.id === hoveredId)?.lat) !== null && (
        <Popup
          longitude={toFiniteNumber(places.find(p => p.id === hoveredId)?.lng)!}
          latitude={toFiniteNumber(places.find(p => p.id === hoveredId)?.lat)!}
          closeButton={false}
          closeOnClick={false}
          anchor="bottom"
          offset={20}
        >
          <div className="text-[var(--tag-ink)]">클릭하여 {places.find(p => p.id === hoveredId)?.name}이(가) 언급된 노트 목록 보기</div>
        </Popup>
      )}
      <AttributionControl compact />
    </Map>
  )
}
