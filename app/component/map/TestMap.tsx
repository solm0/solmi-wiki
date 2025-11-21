'use client'

import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function TestMap() {
  return (
    <Map
      initialViewState={{
        longitude: 10.313611,
        latitude: 47.715833,
        zoom: 14
      }}
      style={{ width: 600, height: 400 }}
      mapStyle="https://api.maptiler.com/maps/streets/style.json?key=5WUNujbtty6Dt1NUzT6r"
    />
  )
}