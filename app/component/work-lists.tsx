'use client'

import { Suspense, useState } from "react"
import { Post } from "../lib/type";
import ThumbnailList from "./thumbnail-list";

export default function WorkLists({
  posts,
}: {
  posts: Post[] | null;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className='relative w-full pt-[40vh] pb-8 overflow-y-scroll focus:outline-hidden flex gap-1 flex-wrap justify-center md:justify-start custom-scrollbar'>
      <Suspense>
        {posts && posts.map((note) => (
          <ThumbnailList
            key={note.id}
            note={note}
            hovered={hovered} setHovered={setHovered}
          />
        ))}
      </Suspense>
    </section>
  )
}