import { useEffect, useState } from "react"

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<{x: number | null, y: number | null}>({ x: null, y: null});

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: window.innerHeight - e.clientY})
    };

    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};