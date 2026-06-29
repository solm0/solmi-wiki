import { maruburi, maruburi_bold, pretendard } from "@/app/lib/localfont";
import { Lyric, Playlist } from "@/app/lib/type";
import { usePlayerStore } from "@/app/lib/zustand/youtubePlayerStore";
import { ChevronLeft, Info, ListMusic, Maximize2, Minimize2, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { RandItem } from "../inspector/inspect-result-list";
import { useRouter } from "next/navigation";
import ControllerBar from "./ControllerBar";

const ALERT_KEY = 'music-alert-dismissed';

export function Alert({
  setAlertOpen, play
}: {
  setAlertOpen: (alertOpen: boolean) => void;
  play: () => void;
}) {
  const onAlertConfirm = () => {
    localStorage.setItem(ALERT_KEY, 'true');
    setAlertOpen(false);
    play();
  }
  return (
    <div className="fixed w-64 bg-green-500 px-3 py-2.5 py-2 z-80 h-auto rounded-sm bottom-5 left-5 md:bottom-8 md:left-8 text-sm text-text-900 flex flex-col items-start gap-2">
      <p className="break-keep">이 음악은 유튜브 영상을 통해 재생되니 데이터를 많이 쓰고 싶지 않다면 와이파이 환경에서 재생하는 것을 권장합니다.</p>
      <div className="flex gap-2">
        <button
          onClick={onAlertConfirm}
          className="bg-green-500 border-text-900 px-3 py-2.5 py-1 border rounded-sm hover:bg-green-600 transition-colors duration-300"
        >
          알겠고, 재생하기
        </button>
        <button onClick={() => setAlertOpen(false)}>
          돌아가기
        </button>
      </div>
    </div>
  )
}

export default function MusicCmp({
  playlistIds, allPlaylists,
}: {
  playlistIds?: Playlist[];
  allPlaylists: Playlist[];
}) {
  const [lyricOpen, setLyricOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [postListOpen, setPostListOpen] = useState(false);

  const {
    playlist,
    isReady,
    duration,
    currentTime,
    isPlaying,
    currentTrack,
    playlistVideoIds,
    currentPlaylistIndex,
    lyrics,
    plainLyrics,
    lyricsMode,
    setPlaylist,
    setPlaying,
    setCurrentTime,
    setSeeking,
    requestPlaylistIndex,
  } = usePlayerStore();
  
  const localPlaylist = useMemo(() => {
    if (!playlistIds) return null;
    return allPlaylists.find((item) => item.id === playlistIds[0]?.id) ?? null;
  }, [playlistIds, allPlaylists]);

  useEffect(() => {
    if (!playlist && localPlaylist?.youtubePlaylistId) {
      setPlaylist(localPlaylist);
    }
  }, [localPlaylist, playlist, setPlaylist]);

  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const [visibleLyrics, setVisibleLyrics] = useState<Lyric[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setVisibleLyrics([]);
  }, [currentTrack?.videoId]);

  useEffect(() => {
    if (lyricsMode !== "synced" || !lyrics.length) {
      setVisibleLyrics([]);
      return;
    }

    if (
      indexRef.current > 0 &&
      lyrics[indexRef.current - 1].time > currentTime
    ) {
      const newIndex = lyrics.findIndex((line) => line.time > currentTime);
      indexRef.current = newIndex === -1 ? lyrics.length : newIndex;
    }

    while (
      indexRef.current < lyrics.length &&
      lyrics[indexRef.current].time <= currentTime
    ) {
      indexRef.current++;
    }

    setVisibleLyrics(lyrics.slice(0, indexRef.current));
  }, [currentTime, lyrics, lyricsMode]);

  const secToMin = (seconds: number) => {
    const mm = Math.floor(seconds / 60);
    const ss = Math.floor(seconds % 60);
    return `${mm}:${ss.toString().padStart(2, '0')}`;
  }

  const displayedPlaylist = playlist ?? localPlaylist;
  const plainLyricsLines = plainLyrics
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const showSwitchButton = Boolean(localPlaylist && playlist?.id !== localPlaylist.id);
  const noPlaylistSelected = !displayedPlaylist?.youtubePlaylistId;

  return (
    <div className="w-full h-auto flex flex-col gap-2">
      {alertOpen &&
        <Alert
          setAlertOpen={setAlertOpen}
          play={() => setPlaying(true)}
        />
      }

      {showSwitchButton &&
        <button
          onClick={() => setPlaylist(localPlaylist!)}
          className="w-full rounded-sm border border-green-600 px-3 py-2 text-left text-xs text-green-700 hover:bg-green-50 transition-colors duration-300"
        >
          이 글의 플레이리스트로 전환하기
        </button>
      }

      <div
        className={`
          relative flex flex-col-reverse gap-1 overflow-y-scroll   transition-[height] duration-300 rounded-md
          ${lyricOpen ? 'h-120' : 'h-40'}
        `}
      >
        <div
          className={`
            fixed w-full h-40 bg-linear-to-b from-background to-transparent pointer-events-none opacity-60 transition-[height] duration-300
            ${lyricOpen ? 'h-120' : 'h-40'}
          `}
        />
        <div className="fixed right-4 mb-1">
          <div
            onClick={() => setLyricOpen(!lyricOpen)}
            className="w-6 h-6 p-1 flex items-center justify-center hover:bg-button-100 rounded-sm transition-colors duration-300"
          >
            {lyricOpen ? <Minimize2 /> : <Maximize2 />}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {lyricsMode === "synced" && visibleLyrics.map((line, index) => (
            <div key={`${line.time}-${index}`} className="inline-flex px-3 py-2.5 bg-linear-to-t from-text-800 to-text-950 text-background w-fit max-w-[80%] rounded-md break-words gap-1 shadow-md flex-col">
              <p className="font-medium leading-[1.3em] max-w-[18em] break-words">{line.lyric.or}</p>
              {line.lyric.tr &&
                <p className="w-auto opacity-80 max-w-[15em] leading-[1.5em] text-xs break-keep">{line.lyric.tr}</p>
              }
            </div>
          ))}

          {lyricsMode === "plain" && plainLyricsLines.map((line, index) => (
            <div key={`${line}-${index}`} className="inline-flex px-3 py-2.5 bg-linear-to-t from-text-800 to-text-950 text-background w-fit max-w-[80%] rounded-md break-words shadow-md">
              <p className="font-medium leading-[1.3em] max-w-[18em] break-words">{line}</p>
            </div>
          ))}

          {lyricsMode === "loading" &&
            <p className="px-3 py-2 text-xs text-text-700">LRCLIB에서 가사를 찾는 중입니다.</p>
          }

          {lyricsMode === "none" &&
            <p className="px-3 py-2 text-xs text-text-700">가사를 찾지 못했습니다.</p>
          }
        </div>
      </div>

      <div className={`flex flex-col gap-2 ${maruburi.className} bg-button-100 rounded-sm p-2`}>
        <div className="w-full h-auto flex flex-col gap-2">
          <div className="relative flex gap-2 h-10 items-center">
            <div className="w-10 h-full rounded-sm bg-button-200 overflow-hidden">
              <img src={currentTrack?.thumbnailSrc ?? '/globe.svg'} className="object-cover w-full h-full" />
            </div>

            <div className="h-full flex flex-col justify-between min-w-0">
              <p className={`text-base ${maruburi_bold.className} text-text-900 truncate`}>
                {currentTrack?.title ?? (displayedPlaylist?.title ? `${displayedPlaylist.title} 재생 준비 중` : '선택된 플레이리스트가 없습니다')}
              </p>
              <p className="text-xs text-text-700 truncate">{currentTrack?.author ?? '-'}</p>
            </div>

            <div className="ml-auto flex gap-1">
              <div
                onClick={() => setInfoOpen(!infoOpen)}
                className={`
                  w-6 h-6 p-1 flex items-center justify-center hover:bg-button-200 rounded-sm transition-colors duration-300
                  ${infoOpen ? 'text-green-600' : 'text-text-900'}
                `}
              >
                <Info />
              </div>
              <div
                onClick={() => setListOpen(!listOpen)}
                className={`
                  w-6 h-6 p-1 flex items-center justify-center hover:bg-button-200 rounded-sm transition-colors duration-300
                  ${listOpen ? 'text-green-600' : 'text-text-900'}
                `}
              >
                <ListMusic />
              </div>
            </div>
          </div>

          <div className={`${pretendard.className} text-xs w-full ${infoOpen ? 'h-auto' : 'h-0 hidden'} transition-[height] duration-300 overflow-hidden py-2 flex flex-col gap-4`}>
            <div className="flex flex-col gap-1">
              <p>플레이리스트: {displayedPlaylist?.title ?? '-'}</p>
              <p>유튜브 플레이리스트 ID: {displayedPlaylist?.youtubePlaylistId ?? '-'}</p>
              <p>현재 영상 ID: {currentTrack?.videoId ?? '-'}</p>
              <p>재생 위치: {playlistVideoIds.length > 0 ? `${currentPlaylistIndex + 1} / ${playlistVideoIds.length}` : '-'}</p>
            </div>
            <p>곡 정보와 가사는 현재 재생 중인 유튜브 영상 메타데이터를 기준으로 불러옵니다.</p>
          </div>
        </div>

        <div className="w-full flex gap-2 items-start">
          <button
            onClick={() => {
              if (!isReady) return;
              const dismissed = localStorage.getItem('music-alert-dismissed');
              if (dismissed === 'true') {
                setPlaying(!isPlaying);
              } else {
                setAlertOpen(true);
              }
            }}
            className={`
              w-6 h-6 p-1 flex items-center justify-center hover:text-text-700 transition-colors duration-300
              ${isReady && !noPlaylistSelected ? 'text-text-900' : 'text-text-700'}
            `}
            disabled={!isReady || noPlaylistSelected}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <div className="w-full flex flex-col gap-1 text-text-800 pt-2">
            <ControllerBar
              currentTime={currentTime}
              duration={duration}
              setCurrentTime={setCurrentTime}
              setSeeking={setSeeking}
            />
            <div className="w-full flex justify-between text-xs">
              <span>{secToMin(currentTime)}</span>
              <span>{secToMin(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`
          flex flex-col gap-2 transition-[height] duration-300
          ${listOpen ? 'h-80 overflow-y-scroll' : 'h-0 overflow-hidden'}
        `}
      >
        <div className="w-full flex justify-between">
          <p className="text-xs text-text-800">
            {displayedPlaylist
              ? `${displayedPlaylist.title} 전체 ${playlistVideoIds.length || 0}곡`
              : '플레이리스트가 선택되지 않았습니다'}
          </p>
          <p
            onClick={() => setPostListOpen(!postListOpen)}
            className="text-xs hover:text-text-700 transition-colors duration-300 flex items-center"
          >
            엮인 글 목록
            <ChevronLeft className={`w-4 h-4 ${postListOpen ? '-rotate-90' : 'rotate-0'} transition-[rotate] duration-300`} />
          </p>
        </div>
        <div>
          {postListOpen && displayedPlaylist?.posts.map((post) => (
            <div
              key={post.id}
              className={`
                shrink-0 relative text-nowrap h-8 rounded-sm w-full transition-[opacity] duration-300 hover:cursor-pointer flex items-center font-normal backdrop-blur-lg gap-2
                ${hovered && hovered !== post.id && "opacity-40!"}
              `}
              onMouseEnter={() => setHovered(post.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => router.push(`/${post.id}`) }
            >
              <RandItem hovered={hovered} note={post} />
            </div>
          ))}
        </div>
        <div className="flex flex-col  ">
          {playlistVideoIds.map((videoId, index) => {
            const isCurrent = currentPlaylistIndex === index;
            return (
              <div
                key={`${videoId}-${index}`}
                className="p-2 hover:bg-button-100 rounded-md transition-colors duration-300"
                onClick={() => requestPlaylistIndex(index)}
              >
                <div className="relative flex gap-2 h-10 items-center">
                  <div className="w-10 h-full rounded-sm bg-button-200 overflow-hidden">
                    <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} className="object-cover w-full h-full" />
                  </div>
                  <div className="h-full flex flex-col justify-between min-w-0">
                    <p className={`text-base ${maruburi_bold.className} ${isCurrent ? 'text-green-600' : 'text-text-900'} truncate`}>
                      {isCurrent && currentTrack?.title ? currentTrack.title : `영상 ${index + 1}`}
                    </p>
                    <p className="text-xs text-text-700 truncate">
                      {isCurrent && currentTrack?.author ? currentTrack.author : videoId}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
