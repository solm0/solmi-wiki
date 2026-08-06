export default function Iframe({
  src,
  muted,
}: {
  src: string;
  muted: boolean;
}) {
  const playerSrc = addYouTubeMuteParam(src, muted);

  return (
    <div className="w-[calc(100%+2rem)] -mx-4 md:mx-0 md:w-full h-auto aspect-video my-4 overflow-hidden md:pr-7 max-w-[47em]">
      <iframe
        src={playerSrc}
        className="w-full h-full"
        title="YouTube video player"
        allow="accelerometer;
        autoplay; clipboard-write;
        encrypted-media;
        gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  )
}

function addYouTubeMuteParam(src: string, muted: boolean) {
  if (!muted) return src;

  try {
    const url = new URL(src);
    const hostname = url.hostname.toLowerCase();
    const isYouTube =
      hostname === 'youtube.com' ||
      hostname.endsWith('.youtube.com') ||
      hostname === 'youtube-nocookie.com' ||
      hostname.endsWith('.youtube-nocookie.com');

    if (!isYouTube) return src;

    url.searchParams.set('mute', '1');
    return url.toString();
  } catch {
    return src;
  }
}
