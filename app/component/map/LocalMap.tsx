'use client'

import Map, { Layer, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useState } from 'react';
import { Place } from '@/app/lib/type';
import { NoPost } from '../hyperlink-map/ToolBox';
import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties
} from 'geojson';

export default function LocalMap({
  places,
}: {
  places?: Place[];
}) {
  const [viewState, setViewState] = useState({
    longitude: Number(places?.[0].langtitude) ?? 10.313611,
    latitude: Number(places?.[0].latitude) ?? 47.715833,
    zoom: 16
  });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (!places) return;
  
  const placeData = places.map((place, i) => 
     ({
      type: 'Feature',
      geometry: {
        type: "Point",
        coordinates: [Number(place.langtitude), Number(place.latitude)]
      },
      properties: {
        i: i+1,
      }
    }),
  )
  
  const geojson: FeatureCollection = {
    type: 'FeatureCollection',
    features: placeData as Feature<Geometry, GeoJsonProperties>[]
  }

  if (!places) return <NoPost />
  else if (!geojson) return <NoPost text='해당 글에 장소' />
  else return (
    <Map
      {...viewState}
      interactiveLayerIds={['marker']}
      onMouseMove={(e) => {
        const feature = e.features?.[0];
        if (feature) setHoveredId(feature.properties.i as number);
        else setHoveredId(null);
      }}
      onClick={(e) => {
        const feature = e.features?.[0];
        if (feature) console.log(feature.properties.i)
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
              ["==", ['get', 'i'], hoveredId],
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
    </Map>
  )
}