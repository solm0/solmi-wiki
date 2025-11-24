import { Place } from "@/app/lib/type"

export default function PlacePlaceholder({
  placeId, places
}: {
  placeId: string
  places?: Place[];
}) {
  if (!places) return;

  const label = places.find(p => p.id === placeId)?.name;

  return (
    <button
      onMouseEnter={() => console.log('hovered', placeId)}
      onMouseLeave={() => console.log('unhovered', placeId)}
      onClick={() => console.log('clicked', placeId)}
    >
      {label}
    </button>
  )
}