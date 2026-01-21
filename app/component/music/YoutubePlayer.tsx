'use client'

import { usePlayerStore } from "@/app/lib/zustand/youtubePlayerStore";
import YouTube from 'react-youtube';

export default function YoutubePlayer() {
  const {
    songIdx,
    playlist,
    setReady,
    setPlaying,
    setCurrentTime,
    setDuration,
  } = usePlayerStore();

  const videoId = playlist && songIdx!=null && playlist.songs[songIdx].youtubeVideoId;

  let player: YT.Player;

  const onReady = (e: YT.PlayerEvent) => {
    player = e.target;
    setDuration(player.getDuration());
    setReady();
  };

  const onStateChange = (e: YT.OnStateChangeEvent) => {
    if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
    if (e.data === YT.PlayerState.PAUSED) setPlaying(false);
  };

  setInterval(() => {
    if (player?.getCurrentTime) {
      setCurrentTime(player.getCurrentTime());
    }
  }, 500);

  return (
    <div className="absolute top-0 left-0">
      <YouTube
        videoId='91GTuZWCQmY'
        opts={{ playerVars: { autoplay: 1 } }}
        onReady={onReady}
        onStateChange={onStateChange}
      />
    </div>
  )
}