export default function ControllerBar({
  currentTime, duration, setCurrentTime,
}: {
  currentTime: number,
  duration: number,
  setCurrentTime: (currentTime: number) => void;
}) {
  const progress = duration > 0 ? currentTime / duration : 0;
  const percent = progress * 100;

  return (
    <div className="relative w-full h-2 flex items-center">
      <div className="relative w-full h-1 flex items-center bg-button-200 rounded-full overflow-hidden">
        <div
          className="h-full absolute bg-green-500 left-0 top-0"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div
        className="w-3 h-3 bg-green-500 rounded-full absolute left-1/2 hover:scale-130 transition-all duration-300"
        style={{ left: `${percent}%` }}
      />
    </div>
  )
}