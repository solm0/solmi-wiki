import LocalMap from "./LocalMap";
import Link from "next/link";
import { Expand } from "lucide-react";

export default function LocalMapWController () {
  return (
    <div className="w-full h-auto flex flex-col gap-1">
      <div className="relative w-full aspect-square overflow-hidden rounded-sm">
        <LocalMap />
      </div>
      <div className="flex w-full h-8 justify-end">
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