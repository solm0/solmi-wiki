import { useRef, useState } from "react";

export default function ControllerBar({
  currentTime, duration, setCurrentTime, setSeeking,
}: {
  currentTime: number,
  duration: number,
  setCurrentTime: (currentTime: number) => void;
  setSeeking: (seeking: boolean) => void;
}) {
  const progress = duration > 0 ? currentTime / duration : 0;
  const percent = progress * 100;
  const barRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [left, setLeft] = useState(0);
  const [hovered, setHovered] = useState(false);

  // 호버

  return (
    <div
      className="relative w-full h-2 flex items-center"
      onMouseMove={(e) => {
        if (!barRef.current || !duration) return;

        const rect = barRef.current.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const clamped = Math.max(0, Math.min(1, ratio));

        setLeft(clamped * duration);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative w-full h-1 flex items-center bg-button-200 rounded-full overflow-hidden"
        ref={barRef}
        onClick={() => {
          setSeeking(true);
          setCurrentTime(left);
        }}
      >
        <div
          className="h-full absolute bg-green-500 left-0 top-0"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* 호버 */}
      <div
        ref={handleRef}
        className="w-[1px] h-8 bg-green-500 absolute left-1/2 hover:scale-130 transition-all duration-300 pointer-events-none"
        style={{ left: `${hovered ? left/duration*100 : percent}%` }}
      />
    </div>
  )
}