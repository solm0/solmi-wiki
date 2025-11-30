'use client'

import Map, { Layer, Popup, Source, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Place } from '@/app/lib/type';
import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
  LineString
} from 'geojson';
import { useClickedPlace } from '@/app/lib/zustand/useClickedPlace';
import { useRouteProgress } from '@/app/lib/hooks/useRouteProgress';

export default function LocalMap({
  places,
}: {
  places: Place[];
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
  const [zoomLevel, setZoomLevel] = useState<number>();
  console.log(clickedId);

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
  const [routeData, setRouteData] = useState<Feature<LineString, GeoJsonProperties>[]>([]);
  
  function getDistanceInKm([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]) {
    const R = 6371; 
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  
  function drawCurvedLine(
    start: [number, number],
    end: [number, number]
  ): Feature<LineString, GeoJsonProperties> {
    const [x1, y1] = start;
    const [x2, y2] = end;

    // 가운데에서 살짝 위로 올린 control point
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2 + 5; // 값 크면 더 휘어짐

    // 베지어 곡선 샘플링
    const curve: [number, number][] = [];
    const steps = 30;

    for (let t = 0; t <= 1; t += 1 / steps) {
      const x =
        (1 - t) * (1 - t) * x1 +
        2 * (1 - t) * t * cx +
        t * t * x2;

      const y =
        (1 - t) * (1 - t) * y1 +
        2 * (1 - t) * t * cy +
        t * t * y2;

      curve.push([x, y]);
    }

    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: curve
      },
      properties: {}
    };
  }

  async function fetchRoute(start: [number, number], end: [number, number]):Promise<Feature<LineString, GeoJsonProperties>> {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`
    );
    const data = await res.json();

    const line = data.routes[0].geometry; // LineString

    return {
      type: "Feature",
      geometry: line,
      properties: {}
    }
  }

  useEffect(() => {
    if (!places || placeData.length < 2) return;
    let isMounted = true;

    async function loadRoutes() {
      const result: Feature<LineString, GeoJsonProperties>[] = [];

      for (let i = 0; i < placeData.length - 1; i++) {
        const start = placeData[i].geometry.coordinates as [number, number];
        const end = placeData[i + 1].geometry.coordinates as [number, number];

        const dist = getDistanceInKm(start, end);

        if (dist > 200) {
          result.push(drawCurvedLine(start, end));
        } else {
          const route = await fetchRoute(start, end);
          result.push(route);
        }
      }
      if (isMounted) setRouteData(result);
    }

    loadRoutes();
    return () => { isMounted = false; };
  }, [places]);

  const routeGeojson = useMemo<FeatureCollection>(() => ({
    type: 'FeatureCollection',
    features: routeData,
  }), [routeData]);

  // 진행도
  const placeIds = useMemo(() => places?.map(p => p.id) ?? [], [places]);
  const stablePlaceIds = useMemo(() => placeIds ?? [''], [placeIds]);
  const stableRouteData = useMemo(() => routeData, [routeData]);
  const { currentIndex, progressPoint, progressLine } = useRouteProgress(stablePlaceIds, stableRouteData);

  useEffect(() => {
    const start = places[currentIndex-1];
    const end = places[currentIndex];

    const [lat1, lng1] = start ? [Number(start.lat), Number(start.lng)] : [null, null];
    const [lat2, lng2] = end ? [Number(end.lat), Number(end.lng)] : [null, null];
    
    if (!lat1 || !lng1 || !lat2 || !lng2) {
      setZoomLevel(14);
    } else {
      // 대략적인 거리 계산 (유클리드)
      const distance = Math.sqrt((lng2 - lng1) ** 2 + (lat2 - lat1) ** 2);
      // console.log(
      //   '현재위치', places[currentIndex-1]?.name, lat1, lng1,
      //   '다음위치', places[currentIndex]?.name, lat2, lng2,
      //   distance
      // )
  
      // 거리 기준 zoom 설정
      const minZoom = 6; // 작을수록 멀리서 봄
      const maxZoom = 13; // 클수록 가까이서 봄
      const maxDistance = 10; // 적절히 조정 필요 (deg 단위)
      const zoom = Math.max(minZoom, Math.min(maxZoom, maxZoom - (distance / maxDistance) * (maxZoom - minZoom)));
      setZoomLevel(zoom);
    }
  }, [currentIndex]);

  useEffect(() => {
    // console.log(zoomLevel)
    if (!progressPoint || !mapRef.current) return;

    const map = mapRef.current;

    if (!clickedId) {
      map.easeTo({
        center: progressPoint,
        duration: 0,
        zoom: zoomLevel,
      });
    }
  }, [progressPoint]);

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
      {routeGeojson.features.length !== 0 &&
        <Source id='route' type='geojson' data={routeGeojson}>
          {/* 동선 레이어 */}
          <Layer
            id='route-line'
            type='line'
            source='route'
            paint={{
              "line-width": 5,
              "line-color": "#B5B5B5"
            }}
          />
        </Source>
      }

      {progressLine && (
        <Source id="progress" type="geojson" data={progressLine}>
          <Layer
            id="progress-line"
            type="line"
            paint={{
              "line-width": 5,
              "line-color": "#00C37A"
            }}
          />
        </Source>
      )}

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