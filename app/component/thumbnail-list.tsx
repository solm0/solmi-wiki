'use client'

import clsx from "clsx";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Post } from "../lib/type";
import Image from "next/image";

export default function ThumbnailList({ 
  note,
  hovered, setHovered,
  noColumn = false
}: {
  note: Post,
  hovered: string | null;
  setHovered: (id: string | null) => void,
  noColumn?: boolean;
}) {
  const onMouseEnter = (id: string) => {
    setHovered(id);
  }

  const onMouseLeave = () => {
    setHovered(null);
  }

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = (href: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    router.push(`/${href}?${newParams.toString()}`);
  }

  const cloudName = "dpqjfptr6";
  const publicId = note.thumbnail;
  const transformations = "f_auto,q_auto,w_400,c_fill";
  const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}.jpg`;

  return (
    <div
      key={note.id}
      className={`
        relative bg-background hover:cursor-pointer flex items-center justify-center overflow-hidden hover:scale-130 hover:z-80 hover:rounded-sm transition-all duration-300
        ${noColumn ? 'w-1/3 md:w-1/6 lg:w-1/9 h-auto aspect-square' : 'w-full md:w-1/2 lg:w-1/3 h-auto aspect-square'}
      `}
      onMouseEnter={() => onMouseEnter(note.id)}
      onMouseLeave={onMouseLeave}
      onClick={() => handleClick(note.id)}
    >
      <Image
        src={imageUrl}
        alt={note.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={clsx("saturate-140 object-cover object-center w-full h-full transition-[filter] duration-300",
          hovered === note.id ? "grayscale-0" : 'grayscale-100'
        )}
        unoptimized
      />

      <div
        className={`
          absolute w-full h-full bg-button-200 top-0 left-0 pointer-events-none transition-opacity duration-300
          ${hovered ? hovered === note.id ? 'opacity-0' : 'opacity-60' : 'opacity-0'}
        `}
      />
    </div>
  )
}