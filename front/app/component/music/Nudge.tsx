'use client'

import { pretendard } from "@/app/lib/localfont";
import { useToggleStore } from "@/app/lib/zustand/useToggleStore";
import { Music } from "lucide-react";
import { useEffect, useState } from "react";

export default function Nudge({

}) {
  const isToolBoxOpen = useToggleStore((s) => s.toggles['toolBox']);
  const isMusicOpen = useToggleStore((s) => s.toggles['music'])
  const setToggle = useToggleStore(s => s.setToggle);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = document.getElementById('note_wrapper');
    if (!el) return;

    const onScroll = () => {
      if (el.scrollTop > 700) setHidden(true);
      else setHidden(false);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (!isToolBoxOpen) setToggle('toolBox', true);
        if (!isMusicOpen) setToggle('music', true);
      }}
      className={`
        ${hidden ? 'opacity-0' : 'opacity-100'}
        absolute top-16 right-36 flex text-left text-sm items-center gap-2 h-auto w-auto ${pretendard.className} transition-all duration-300
      `}
    >
      {hovered && <p>플레이리스트가 있는 글입니다</p>}
      <div className="h-8 w-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all duration-300">
        <Music className="w-4 h-4 inline mr-1" />
      </div>
    </button>
  )
}