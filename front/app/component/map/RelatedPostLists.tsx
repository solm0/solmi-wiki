import { Post } from "@/app/lib/type"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RandItem } from "../inspector/inspect-result-list";
import { useClickedPlace } from "@/app/lib/zustand/useClickedPlace";

export default function RelatedPostLists({
  posts, placeId
}: {
  posts?: Post[];
  placeId: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();
  const setFromMapPage = useClickedPlace(s => s.setFromMapPage);

  if (!posts) return;
  return (
    <>
      {posts && posts.map((note) => (
        <div
          key={note.id}
          className={`
            shrink-0 relative text-nowrap h-8 rounded-sm w-full transition-[opacity] duration-300 hover:cursor-pointer flex items-center font-normal backdrop-blur-lg gap-2
            ${hovered && hovered !== note.id && "opacity-40!"}
          `}
          onMouseEnter={() => setHovered(note.id)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => {
            router.push(`/${note.id}`);
            setFromMapPage(placeId);
          }}
        >
          <RandItem hovered={hovered} note={note} />
        </div>
      ))}
    </>
  )
}