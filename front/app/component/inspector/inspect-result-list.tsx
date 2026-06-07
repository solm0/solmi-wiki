'use client'

import { useState} from "react"
import { Post } from "@/app/lib/type";
import clsx from "clsx";
import { usePathname, useSearchParams, useRouter} from "next/navigation";
import TagIcon from "../atoms/tag-icon";

export function RandItem({
  hovered,
  note
}: {
  hovered: string | null,
  note: Post
}) {
  return (
    <div className="w-full h-full text-text-600 truncate flex items-center pl-1">
      {<TagIcon tag={note.tags} />}
      <span className="text-text-900">{note.title}</span>
      <span className={clsx (
        "ml-2 text-text-800 opacity-40 transition-[colors, opacity] duration-300",
        hovered && hovered !== note.id && 'opacity-0!',
        hovered && hovered === note.id && 'text-green-600! opacity-100'
      )}
      >
        {note.excerpt}
      </span>
    </div>
  )
}

export default function InspectResultList({
  posts,
}: {
  posts: Post[] | null;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

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
    <div className="relative h-full min-h-0 w-full pointer-events-auto">
      <div className="flex h-full min-h-0 w-full flex-col overflow-y-scroll custom-scrollbar-gray">
        {posts && posts.map((note) => (
          <div
            key={note.id}
            className={clsx(
              "shrink-0 relative text-nowrap h-8 rounded-sm w-full transition-[opacity] duration-300 hover:cursor-pointer flex items-center font-normal backdrop-blur-lg gap-2 text-text-800 opacity-80",
              hovered && hovered !== note.id && "opacity-40!",
              hovered === note.id || rootPath === note.id ? "z-20 opacity-100" : "z-0",
            )}
            onMouseEnter={() => setHovered(note.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleClick(note.id)}
          >
            {rootPath === note.id &&
              <div className="left-0 w-4 h-4" />
            }
            <RandItem hovered={hovered} note={note} />
          </div>
        ))}
        <div className="w-full h-6 shrink-0"></div>
      </div>

      <div
        className="absolute top-0 right-0 z-10 h-full w-1/5 pointer-events-none"
        style={{
          background: "linear-gradient(to left, color-mix(in srgb, var(--background) 100%, transparent) 0%, color-mix(in srgb, var(--background) 10%, transparent) 100%)",
        }}
      />
    </div>
  )
}
