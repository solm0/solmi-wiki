'use client'

import { usePlayerStore } from "@/app/lib/zustand/youtubePlayerStore";
import { useEffect, useRef } from "react";
import YouTube from 'react-youtube';

export default function YoutubePlayer() {
  const {
    songIdx,
    playlist,
    isReady,
    setReady,
    setCurrentTime,
    setDuration,
  } = usePlayerStore();

  const videoId = playlist && songIdx!=null ? playlist.songs[songIdx].youtubeVideoId : null;

  const playerRef = useRef<YT.Player | null>(null);

  const onReady = (e: YT.PlayerEvent) => {
    playerRef.current = e.target;
    setDuration(e.target.getDuration());
    setReady();
  };

  useEffect(() => {
    if (!isReady || !playerRef.current) return;

    const id = setInterval(() => {
      const t = Math.floor(playerRef.current!.getCurrentTime());
      setCurrentTime(t);
    }, 500);

    return () => clearInterval(id);
  }, [isReady, setCurrentTime]);

  return (
    <div className="absolute top-0 left-0">
      {videoId &&
        <YouTube
          videoId={videoId}
          opts={{ playerVars: { autoplay: 1 } }}
          onReady={onReady}
        />
      }
    </div>
  )
}