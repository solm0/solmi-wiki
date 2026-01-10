'use client'

import { useEffect, useState } from "react"
import { Post } from "../lib/type";
import WorkGrid from "./WorkGrid";
import { useRouter, useSearchParams } from "next/navigation";

export default function WorkLists({
  posts,
}: {
  posts: Post[] | null;
}) {
  const [filters, setFilters] = useState<Record<string, boolean>>({
    'year': false,
    'media': false,
  })

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const year = searchParams.get('year');
    const media = searchParams.get('media');

    setFilters({
      year: year === 'true',
      media: media === 'true'
    })
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, 'true');
      }
    });

    const queryString = params.toString();
    const path = queryString ? `?${queryString}` : '';
    router.replace(path);

  }, [filters, router]);

  return (
    <section className='relative w-full pt-[40vh] pb-8 overflow-y-scroll focus:outline-hidden custom-scrollbar'>

      <div className="flex gap-4 h-auto text-sm items-center text-text-900 flex-wrap mb-2">
        <div className="flex gap-2 leading-5 items-center">
          <button
            className="rounded-full w-4 h-4 border border-text-600 hover:border-text-700 p-0.5 transition-colors duration-300"
            onClick={() => {
              setFilters(prev => ({
                ...prev,
                year: !filters['year']
              }))

            }}
            id='year-filter'
          >
            <div className={`w-full h-full rounded-full ${filters['year'] ? 'bg-green-400' : 'bg-transparent'} transition-colors duration-300`} />
          </button>
          <label htmlFor='year-filter'>연도</label>
        </div>

        <div className="flex gap-2 leading-5 items-center">
          <button
            className="rounded-full w-4 h-4 border border-text-600 hover:border-text-700 p-0.5 transition-colors duration-300"
            onClick={() => setFilters(prev => ({
              ...prev,
              media: !filters['media']
            }))}
            id='media-filter'
          >
            <div className={`w-full h-full rounded-full ${filters['media'] ? 'bg-green-400' : 'bg-transparent'} transition-colors duration-300`} />
          </button>
          <label htmlFor='media-filter'>분야</label>
        </div>

        <p>에 따라 모아 보기</p>
      </div>

      <div className="flex flex-wrap justify-center md:justify-start">
        <WorkGrid filters={filters} posts={posts} />
      </div>
    </section>
  )
}