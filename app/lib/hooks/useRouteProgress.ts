import { useEffect, useRef, useState } from "react";

// 경로 좌표에서 특정 비율(progress)의 점을 얻기
function interpolatePoint(coords: [number, number][], t: number) {
  const total = coords.length - 1;
  const idx = Math.floor(t * total);
  const next = Math.min(idx + 1, total);
  const localT = t * total - idx;

  const [x1, y1] = coords[idx];
  const [x2, y2] = coords[next];

  return [
    x1 * (1 - localT) + x2 * localT,
    y1 * (1 - localT) + y2 * localT,
  ] as [number, number];
}

// 라인 일부 잘라내기 (0~progress)
function sliceLine(coords: [number, number][], t: number) {
  const total = coords.length - 1;
  const end = Math.floor(t * total);
  return coords.slice(0, end + 1);
}

export function useRouteProgress(
  placeIds: string[],
  routeData: GeoJSON.Feature<GeoJSON.LineString>[], // 각 장소 사이의 segment
) {
  const routeDataRef = useRef(routeData);
  routeDataRef.current = routeData; // 항상 최신 데이터 유지

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressPoint, setProgressPoint] = useState<[number, number] | null>(null);
  const [progressLine, setProgressLine] = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null);
  
  useEffect(() => {
    const page = document.getElementById('note_wrapper');
    if (!page) return;

    function handleScroll() {
      // 1) placeId → DOM element
      const tops: number[] = [0, ...placeIds.map(id => {
        const el = document.getElementById(`placeholder-${id}`);
        return el?.offsetTop ?? 0;
      })];

      if (tops.length < 2 || !page) return;
      
      const scrollY = page.scrollTop + page.clientHeight * 0.3; // 읽기 위치 조금 아래로

      // 2) 현재 구간 찾기
      let idx = 0;
      for (let i = 0; i < tops.length; i++) {
        if (scrollY >= tops[i] && scrollY < (tops[i + 1] ?? Infinity)) {
          idx = i;
          break;
        }
      }

      setCurrentIndex(idx);

      // 3) 현재 구간 안에서 progress 계산
      const start = tops[idx];
      const end = tops[idx + 1];
      const p = Math.min(Math.max((scrollY - start) / (end - start), 0), 1);
      setProgress(p);

      // 4) routeData에서 좌표 보간
      const segment = routeDataRef.current[idx - 1];
      if (!segment) return;

      const coords = segment.geometry.coordinates as [number, number][];
      const point = interpolatePoint(coords, p);
      setProgressPoint(point);

      // 5) 진행 라인 잘라서 만들기
      const previousSegments = routeDataRef.current
        .slice(0, idx - 1)                               // 이전 segment들만
        .flatMap(seg => seg.geometry.coordinates);
      const slicedCurrent = sliceLine(coords, p);
      const fullRoute = [...previousSegments, ...slicedCurrent];

      setProgressLine({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: fullRoute,
        },
        properties: {},
      });
    }

    page.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => page.removeEventListener("scroll", handleScroll);
  }, [placeIds]);

  useEffect(() => {
  console.log("currentIndex changed:", currentIndex);
}, [currentIndex]);

  return {
    currentIndex,
    progress,
    progressPoint,
    progressLine,
  };
}