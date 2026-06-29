export default function Iframe({
  src,
}: {
  src: string
}) {
  return (
    <div className="w-[calc(100%+2rem)] -mx-4 md:mx-0 md:w-full h-auto aspect-video my-4 overflow-hidden md:pr-7 max-w-[47em]">
      <iframe
        src={src}
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
