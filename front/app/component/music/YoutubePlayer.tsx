'use client'

import { usePlayerStore } from "@/app/lib/zustand/youtubePlayerStore";
import { useEffect, useRef } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { fetchLyricsForTrack } from "./music-utils";

export default function YoutubePlayer() {
  const {
    playlist,
    isReady,
    isPlaying,
    currentTime,
    seeking,
    duration,
    requestedPlaylistIndex,
    currentTrack,
    setReady,
    setPlaying,
    setCurrentTime,
    setDuration,
    setSeeking,
    setPlaylistVideoIds,
    setCurrentPlaylistIndex,
    clearRequestedPlaylistIndex,
    setCurrentTrack,
    setLyricsLoading,
    setLyrics,
  } = usePlayerStore();

  const playerRef = useRef<YT.Player | null>(null);
  const lastVideoIdRef = useRef<string | null>(null);

  const syncSnapshot = () => {
    const player = playerRef.current;
    if (!player) return;

    const videoData = player.getVideoData();
    const videoId = videoData?.video_id ?? "";
    const playlistIds = player.getPlaylist?.() ?? [];
    const playlistIndex = player.getPlaylistIndex?.() ?? 0;

    setPlaylistVideoIds(playlistIds);
    setCurrentPlaylistIndex(playlistIndex >= 0 ? playlistIndex : 0);
    setDuration(player.getDuration());

    if (!videoId) return;

    setCurrentTrack({
      videoId,
      title: videoData.title || `영상 ${playlistIndex + 1}`,
      author: videoData.author || "",
      thumbnailSrc: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    });

    if (lastVideoIdRef.current !== videoId) {
      lastVideoIdRef.current = videoId;
      setCurrentTime(0);
    }
  };

  const onReady = (event: YouTubeEvent) => {
    const player = event.target;
    playerRef.current = player;
    lastVideoIdRef.current = null;

    player.setLoop(true);
    player.setShuffle(true);

    setReady(true);
    syncSnapshot();

    window.setTimeout(() => {
      syncSnapshot();
      if (requestedPlaylistIndex !== null) {
        player.playVideoAt(requestedPlaylistIndex);
        clearRequestedPlaylistIndex();
      } else if (isPlaying) {
        player.playVideo();
      }
    }, 300);
  };

  useEffect(() => {
    if (!playlist) {
      playerRef.current = null;
      lastVideoIdRef.current = null;
      setReady(false);
      setCurrentTrack(null);
      setLyrics({ lyrics: [], plainLyrics: "", mode: "none" });
      return;
    }

    setReady(false);
  }, [playlist, setCurrentTrack, setLyrics, setReady]);

  useEffect(() => {
    if (!isReady || !playerRef.current) return;

    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      setCurrentTime(Math.floor(player.getCurrentTime()));
      syncSnapshot();
    }, 500);

    return () => window.clearInterval(id);
  }, [isReady, setCurrentTime]);

  useEffect(() => {
    if (!playerRef.current || !isReady) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (!playerRef.current || !seeking) return;

    playerRef.current.seekTo(currentTime, true);
    if (!isPlaying) playerRef.current.pauseVideo();
    setSeeking(false);
  }, [currentTime, isPlaying, seeking, setSeeking]);

  useEffect(() => {
    if (!playerRef.current || !isReady || requestedPlaylistIndex === null) return;

    playerRef.current.playVideoAt(requestedPlaylistIndex);
    clearRequestedPlaylistIndex();
    setPlaying(true);
  }, [clearRequestedPlaylistIndex, isReady, requestedPlaylistIndex, setPlaying]);

  useEffect(() => {
    let cancelled = false;

    if (!currentTrack?.videoId) return;

    setLyricsLoading();

    fetchLyricsForTrack(currentTrack, duration)
      .then((payload) => {
        if (cancelled) return;
        setLyrics(payload);
      })
      .catch(() => {
        if (cancelled) return;
        setLyrics({ lyrics: [], plainLyrics: "", mode: "none" });
      });

    return () => {
      cancelled = true;
    };
  }, [
    currentTrack?.author,
    currentTrack?.title,
    currentTrack?.videoId,
    duration,
    setLyrics,
    setLyricsLoading,
  ]);

  if (!playlist?.youtubePlaylistId) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 hidden">
      <YouTube
        key={playlist.youtubePlaylistId}
        opts={{
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            list: playlist.youtubePlaylistId,
            listType: "playlist",
            playsinline: 1,
          },
        }}
        onReady={onReady}
        onStateChange={() => {
          window.setTimeout(syncSnapshot, 0);
          window.setTimeout(syncSnapshot, 300);
        }}
      />
    </div>
  );
}
