'use client'

import { useState} from "react"
import { ChevronRight } from "lucide-react";
import { Post } from "@/app/lib/type";
import clsx from "clsx";
import { usePathname, useSearchParams, useRouter} from "next/navigation";

export function RandItem({
  hovered,
  note
}: {
  hovered: string | null,
  note: Post
}) {
  return (
    <p className="w-full text-text-600 truncate">
      <span className="text-text-900">{note.title}</span>
      <span className={clsx (
        "ml-2 text-text-800 opacity-40 transition-[colors, opacity] duration-300",
        hovered && hovered !== note.id && 'opacity-0!',
        hovered && hovered === note.id && 'text-green-600! opacity-100'
      )}
      >
        {note.excerpt}
      </span>
    </p>
  )
}

export default function InspectResultList({
  posts,
}: {
  posts: Post[] | null;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const onMouseEnter = (id: string) => {
    setHovered(id);
  }

  const onMouseLeave = () => {
    setHovered(null);
  }

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const rootPath = pathname.split('/').slice(1, 2).toString();

  const handleClick = (href: string) => {
    const newParams = new URLSearchParams(searchParams.toString())

    if (rootPath === href) {
      router.push(`/?${newParams.toString()}`);
    } else {
      router.push(`/${href}?${newParams.toString()}`);
    }
  }

  return (
    <div className="flex w-full flex-col overflow-y-scroll gap-1 custom-scrollbar pointer-events-auto ">
      {posts && posts.map((note) => (
        <div
          key={note.id}
          className={clsx (
            "shrink-0 relative text-nowrap h-8 rounded-sm w-full transition-[opacity] duration-300 hover:cursor-pointer flex items-center font-normal backdrop-blur-lg gap-2",
            hovered && hovered !== note.id && "opacity-40!"
          )}
          onMouseEnter={() => onMouseEnter(note.id)}
          onMouseLeave={onMouseLeave}
          onClick={() => handleClick(note.id)}
        >
          {rootPath === note.id &&
            <ChevronRight className={clsx(
              "left-0 text-text-900 w-4 h-4",
              hovered && hovered !== note.id && "text-text-600",
            )} />
          }
          <RandItem hovered={hovered} note={note} />
        </div>
      ))}
    </div>
  )
}