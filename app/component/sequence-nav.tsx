'use client'

import Link from "next/link";
import { Post } from "../lib/type";
import { useSearchParams } from "next/navigation";
import { useHoveredLink } from "@/app/lib/zustand/useHoveredLink";

export default function SequenceNav({
  isFirstChild,
  prev,
  next,
}: {
  isFirstChild: boolean;
  prev: Post | null;
  next: Post | null;
}) {
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const setHoveredId = useHoveredLink((state) => state.setId);

  return (
    <div className="flex w-full h-auto gap-2 text-sm leading-6">
      {prev ?
        <Link
          href={`${prev.id}/?${newParams}`}
          className="p-4 break-words flex-1 flex flex-col gap-2 min-h-20 bg-button-50 rounded-sm hover:bg-button-100 transition-colors duration-300"
          onMouseEnter={() => setHoveredId(prev.title || null, prev.id || null, false)}
          onMouseLeave={() => setHoveredId(null, null)}
          onClick={() => setHoveredId(null, null)}
        >
          <p className="self-end">{isFirstChild ? '개요' : '이전'}</p>
          <p>{prev.title}</p>
        </Link>
        :
        <div className="flex-1 min-h-20 bg-background rounded-sm"></div>
      }
      {next ?
        <Link
          href={`${next.id}/?${newParams}`}
          className="p-4 break-words flex-1 flex flex-col gap-2 min-h-20 bg-button-50 rounded-sm hover:bg-button-100 transition-colors duration-300"
          onMouseEnter={() => setHoveredId(next.title || null, next.id || null, false)}
          onMouseLeave={() => setHoveredId(null, null)}
          onClick={() => setHoveredId(null, null)}
        >
          <p>이후</p>
          <p>{next.title}</p>
        </Link>
        :
        <div className="flex-1 min-h-20 bg-background rounded-sm"></div>
      }
    </div>
  )
}