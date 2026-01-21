'use client'

import { usePlayerStore } from "@/app/lib/zustand/youtubePlayerStore";
import { useEffect, useRef } from "react";
import YouTube from 'react-youtube';

export default function YoutubePlayer() {
  const {
    songIdx,
    playlist,
    isReady,
    isPlaying,
    currentTime,
    seeking,
    setReady,
    setCurrentTime,
    setDuration,
    setSeeking
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

  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // 외부에서 currenttime 조절했을 때만 업데이트
  useEffect(() => {
    if (!playerRef.current) return;
    if (!seeking) return;

    playerRef.current.seekTo(currentTime, true);
    if (!isPlaying) playerRef.current.pauseVideo();
    setSeeking(false);
  }, [currentTime, seeking]);

  return (
    <div className="absolute top-0 left-0 hidden">
      {videoId &&
        <YouTube
          videoId={videoId}
          opts={{ playerVars: { autoplay: isPlaying ? 1 : 0 } }}
          onReady={onReady}
        />
      }
    </div>
  )
}