import LocalMap from "./LocalMap";
import Link from "next/link";
import { Expand } from "lucide-react";
import { useState } from "react";

export default function LocalMapWController () {
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full h-auto flex flex-col gap-1">
      <div className="relative w-full aspect-square overflow-hidden rounded-sm">
        <LocalMap setLoading={setLoading} />
      </div>
      <div className="flex w-full h-8 justify-between">
        <p>{loading && '루트를 불러오는 중...' }</p>
        <Link
          href={'/map'}
          className="px-2 py-2 rounded-sm hover:brightness-90 transition-filter duration-300 backdrop-blur-sm"
        >
          <Expand className="w-4 h-4"/>
        </Link>
      </div>
    </div>
  )
}