export default function Iframe({
  src,
}: {
  src: string
}) {
  return (
    <div className="w-full h-auto aspect-video my-4 rounded-sm overflow-hidden">
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