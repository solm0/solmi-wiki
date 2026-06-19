'use client'

import { useEffect, useState } from "react"
import { flushSync } from "react-dom";
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

  const updateFilters = (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => {
    const documentWithTransition = document as Document & {
      startViewTransition?: (updateCallback: () => void) => void;
    };

    if (!documentWithTransition.startViewTransition) {
      setFilters(updater);
      return;
    }

    documentWithTransition.startViewTransition(() => {
      flushSync(() => {
        setFilters(updater);
      });
    });
  };

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
    <section className='relative w-full pt-[calc(40vh-10rem)] pb-8 overflow-y-scroll focus:outline-hidden custom-scrollbar pr-4'>

      <div className="flex flex-col gap-1 text-base md:text-sm items-end text-text-900 flex-wrap mb-32">
        <div className="flex items-center">
          <label htmlFor='year-filter' className="pr-2">연도</label>
          <button
            className="w-4 h-4 md:w-3 md:h-3 border border-text-600 hover:border-text-700 transition-colors duration-300"
            onClick={() => {
              updateFilters(prev => ({
                ...prev,
                year: !prev.year
              }))
            }}
            id='year-filter'
          >
            <div className={`w-full h-full ${filters['year'] ? 'bg-green-500' : 'bg-transparent'} transition-colors duration-300`} />
          </button>
        </div>

        <div className="flex items-center">
          <label htmlFor='media-filter' className="pr-2">분야</label>
          <button
            className="w-4 h-4 md:w-3 md:h-3 border border-text-600 hover:border-text-700 transition-colors duration-300"
            onClick={() => updateFilters(prev => ({
              ...prev,
              media: !prev.media
            }))}
            id='media-filter'
          >
            <div className={`w-full h-full ${filters['media'] ? 'bg-green-500' : 'bg-transparent'} transition-colors duration-300`} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center md:justify-start">
        <WorkGrid filters={filters} posts={posts} />
      </div>
    </section>
  )
}
