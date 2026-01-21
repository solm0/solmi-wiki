import { maruburi, maruburi_bold, pretendard } from "@/app/lib/localfont";
import { Playlist, Song } from "@/app/lib/type";
import { usePlayerStore } from "@/app/lib/zustand/youtubePlayerStore";
import { ChevronLeft, Info, ListMusic, Maximize2, Minimize2, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { RandItem } from "../inspector/inspect-result-list";
import { useRouter } from "next/navigation";
import ControllerBar from "./ControllerBar";

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
    songIdx,
    playlist,
    isReady,
    duration,
    currentTime,
    isPlaying,
    setPlaylist,
    setSongIdx,
    setPlaying,
    setCurrentTime,
    setSeeking,
  } = usePlayerStore();
  
  const localPlaylist = useMemo(() => {
    if (!playlistIds) return null;
    return allPlaylists.find(p => p.id === playlistIds[0]?.id) ?? null;
  }, [playlistIds, allPlaylists]);
  
  // playlist가 바뀌면 song이 있을 때만 setPlaylist, setSong
  useEffect(() => {
    if (!localPlaylist?.songs?.length) return;
    const randomIndex = Math.floor(Math.random() * localPlaylist.songs.length);
    setPlaylist(localPlaylist);
    setSongIdx(randomIndex);
  }, [localPlaylist]);
  
  const songData = (songIdx !== null && playlist) ? {
    title: playlist.songs[songIdx].title,
    artist: playlist.songs[songIdx].artist,
    album: playlist.songs[songIdx].album,
    thumbnailSrc: `https://coverartarchive.org/release/${playlist.songs[songIdx].thumbnailId}/front`,
    desc: playlist.songs[songIdx].desc,
    lyric: playlist.songs[songIdx].lyric,
  } : {
    title: '선택된 음악이 없습니다',
    artist: '-',
    album: '-',
    thumbnailSrc: '/globe.svg',
    desc: '-',
    lyric: {},
  }

  // 플레이리스트 연관 post 목록
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();
  
  // 컨트롤러로 setplaying, setCurrenttime 컨트롤
  // play버튼/song 처음 누를 때 안내문(로컬스토리지), 오케이 누를때 playerstate바꾸기.
    // 유튜브 영상이 재생되니 음악 재생은 와이파이 환경에서 하는것을 권장합니다. 알겠고, 재생하기/취소

  // 가사 폭포: 가사가 있을경우. 현재 currenttime 받아서 그만큼 가사 state 업데이트하고 렌더
  // 음악 정보(앨범명,가수명,국가,연도)도 musicbrains에서가져오기
  // 새로운페이지가 playlist가져도 바로 set하지말고 set하는 버튼을 제공하기
  
  // 플레이리스트 페이지
  // 글에 플레이리스트 있으면 넛지 버튼 좀 있다가 사라지기

  // current time, duration ui
  const secToMin = (seconds: number) => {
    const mm = Math.floor(seconds / 60);
    const ss = Math.floor(seconds % 60);
    return `${mm}:${ss.toString().padStart(2, '0')}`;
  }

  return (
    <div className="w-full h-auto flex flex-col gap-2">
      {/* 가사 폭포 */}
      <div
        className={`
          relative flex flex-col-reverse gap-1 overflow-y-scroll custom-scrollbar transition-[height] duration-300
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
            {lyricOpen
              ? <Minimize2 />
              : <Maximize2 />
            }
          </div>
        </div>

        <div className="inline-flex flex-col px-4 py-3 bg-linear-to-t from-text-800 to-text-950 text-background w-fit max-w-[80%] rounded-r-3xl rounded-tl-3xl rounded-bl-sm break-words gap-1 shadow-md">
          <p className="font-medium leading-[1.3em] max-w-[18em] break-words">Мае рукі ў тваіх</p>
          <p className="w-auto opacity-80 max-w-[15em] leading-[1.5em] text-xs break-keep">내 손은 당신 머리카락에 있고</p>
        </div>
        <div className="inline-flex flex-col px-4 py-3 bg-linear-to-t from-text-800 to-text-950 text-background w-fit max-w-[80%] rounded-r-3xl rounded-tl-3xl rounded-bl-sm break-words gap-1 shadow-md">
          <p className="font-medium leading-[1.3em] max-w-[18em] break-words">Мае рукі ў тваіх валасах а ў вочах адчай</p>
          <p className="w-auto opacity-80 max-w-[15em] leading-[1.5em] text-xs break-keep">내 손은 당신 머리카락에 있고, 당신 눈에는 절망이 담겨 있어요.</p>
        </div>
        <div className="inline-flex flex-col px-4 py-3 bg-linear-to-t from-text-800 to-text-950 text-background w-fit max-w-[80%] rounded-r-3xl rounded-tl-3xl rounded-bl-sm break-words gap-1 shadow-md">
          <p className="font-medium leading-[1.3em] max-w-[18em] break-words">Мае</p>
          <p className="w-auto opacity-80 max-w-[15em] leading-[1.5em] text-xs break-keep">내</p>
        </div>
        <div className="inline-flex flex-col px-4 py-3 bg-linear-to-t from-text-800 to-text-950 text-background w-fit max-w-[80%] rounded-r-3xl rounded-tl-3xl rounded-bl-sm break-words gap-1 shadow-md">
          <p className="font-medium leading-[1.3em] max-w-[18em] break-words">Мае рукі ў тваіх</p>
          <p className="w-auto opacity-80 max-w-[15em] leading-[1.5em] text-xs break-keep">내 손은 당신 머리카락에 있고</p>
        </div>
        <div className="inline-flex flex-col px-4 py-3 bg-linear-to-t from-text-800 to-text-950 text-background w-fit max-w-[80%] rounded-r-3xl rounded-tl-3xl rounded-bl-sm break-words gap-1 shadow-md">
          <p className="font-medium leading-[1.3em] max-w-[18em] break-words">Мае рукі ў тваіх валасах а ў вочах адчай</p>
          <p className="w-auto opacity-80 max-w-[15em] leading-[1.5em] text-xs break-keep">내 손은 당신 머리카락에 있고, 당신 눈에는 절망이 담겨 있어요.</p>
        </div>
        <div className="inline-flex flex-col px-4 py-3 bg-linear-to-t from-text-800 to-text-950 text-background w-fit max-w-[80%] rounded-r-3xl rounded-tl-3xl rounded-bl-sm break-words gap-1 shadow-md">
          <p className="font-medium leading-[1.3em] max-w-[18em] break-words">Мае</p>
          <p className="w-auto opacity-80 max-w-[15em] leading-[1.5em] text-xs break-keep">내</p>
        </div>
      </div>

      {/* 음악정보 & 컨트롤러 */}
      <div className={`flex flex-col gap-2 ${maruburi.className} bg-button-100 rounded-sm p-2`}>
        <div className="w-full h-auto flex flex-col gap-2">
          {/* 개요 */}
          <div className="relative flex gap-2 h-10 items-center">
            {/* 앨범커버 */}
            <div className="w-10 h-full rounded-sm bg-button-200">
              <img src={songData.thumbnailSrc} className="object-cover" />
            </div>

            {/* 제목 & 아티스트 */}
            <div className="h-full flex flex-col justify-between">
              <p className={`text-base ${maruburi_bold.className} text-text-900`}>{songData.title}</p>
              <p className="text-xs text-text-700">{songData.artist}</p>
            </div>

            {/* 플레이리스트 펼침 버튼 */}
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

          {/* 상세 */}
          <div className={`${pretendard.className} text-xs w-full ${infoOpen ? 'h-auto' : 'h-0 hidden'} transition-[height] duration-300 overflow-hidden py-2 flex flex-col gap-2`}>
            <p>
              <span>앨범: </span>
              <span>{songData.album}</span>
            </p>
            <p>{songData.desc}</p>
          </div>
        </div>

        <div className="w-full flex gap-2 items-start">
          {/* 컨트롤 버튼 */}
          <button
            onClick={() => {
              if (!isReady) return;
              setPlaying(!isPlaying);
            }}
            className={`
              w-6 h-6 p-1 flex items-center justify-center hover:text-text-700 transition-colors duration-300
              ${isReady ? 'text-text-900' : 'text-text-700'}
            `}
            disabled={!isReady}
          >
            {isPlaying
              ? <Pause />
              : <Play />
            }
          </button>
          {/* 진행 */}
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

      {/* 플레이리스트 */}
      <div
        className={`
          flex flex-col gap-2 transition-[height] duration-300
          ${listOpen ? 'h-80 overflow-y-scroll' : 'h-0 overflow-hidden'}
        `}
      >
        <div className="w-full flex justify-between">
          <p className="text-xs text-text-800">{`${playlist?.title} 전체 ${playlist?.songs.length}곡`}</p>
          <p
            onClick={() => setPostListOpen(!postListOpen)}
            className="text-xs hover:text-text-700 transition-colors duration-300 flex items-center"
          >
            엮인 글 목록
            <ChevronLeft className={`w-4 h-4 ${postListOpen ? '-rotate-90' : 'rotate-0'} transition-[rotate] duration-300`} />
          </p>
        </div>
        <div>
          {postListOpen && playlist?.posts.map((post) => (
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
        <div className="flex flex-col custom-scrollbar">
          {playlist?.songs
            .map((song, i) => (
              <div
                key={i}
                className="p-2 hover:bg-button-100 rounded-md transition-colors duration-300"
                onClick={() => setSongIdx(i)}
              >
                <div className="relative flex gap-2 h-10 items-center">
                  <div className="w-10 h-full rounded-sm bg-button-200">
                    <img src={song.thumbnailId ? `https://coverartarchive.org/release/${song.thumbnailId}/front` : '/globe.svg'} className="object-cover" />
                  </div>
                  <div className="h-full flex flex-col justify-between">
                    <p className={`text-base ${maruburi_bold.className} ${songIdx === i ? 'text-green-600' : 'text-text-900'}`}>{song.title}</p>
                    <p className="text-xs text-text-700">{song.artist}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}