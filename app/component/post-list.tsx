'use client'

import { usePathname, useSearchParams, useRouter} from "next/navigation";
import { Post } from "../lib/type";

export default function PostList({ 
  note,
  hovered, setHovered,
}: {
  note: Post,
  hovered: string | null;
  setHovered: (id: string | null) => void,
}) {
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
    <div
      key={note.id}
      className={`
        text-nowrap h-12 w-full transition-colors duration-300 hover:cursor-pointer flex items-center gap-6 font-normal rounded-sm pl-2
        ${hovered === note.id && "bg-button-100"}
      `}
      onMouseEnter={() => onMouseEnter(note.id)}
      onMouseLeave={onMouseLeave}
      onClick={() => handleClick(note.id)}
    >
      <div className="flex gap-6 text-sm font-bold items-center text-text-700">
        <div className="w-8 shrink-0">{note.chron.year && `${note.chron.year}`}</div>
        <div className="w-4 shrink-0">{note.chron.month && `${note.chron.month}`}</div>
        <div className="w-4 shrink-0">{note.chron.day && `${note.chron.day}`}</div>
      </div>.
      <p className="col-span-11 w-full text-text-900 truncate">{note.title}</p>
    </div>
  )
}