'use client'

import { Post } from "../lib/type";
import { pretendard } from '@/app/lib/localfont';
import { Calendar, Tag, Key } from 'lucide-react';
import ParamKwButton from "./atoms/param-kw-button";

export default function Metadata({
  post
}: {
  post: Post;
}) {
  const d = new Date(post.publishedAt);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  const keywords = post.keywords.map(kw => kw.name);

  return (
    <section className={`relative ${pretendard.className} flex flex-col w-full h-auto items-start text-text-900 text-xs px-4 py-3 rounded-sm -left-4`}>
      <div className="flex gap-3 h-8 items-center">
        <Calendar className='w-3 h-3' />
        <div className="flex gap-1 h-full items-center">
          <p>{year}년</p>
          <p>{month}월</p>
          <p>{day}일</p>
        </div>
      </div>
      {post.keywords?.length > 1 &&
        <div className="flex gap-3 items-start">
          <Key className='w-3 h-8 shrink-0' />
          <div className="flex gap-1 flex-wrap h-auto">
            <ParamKwButton keywords={keywords} />
          </div>
        </div>
      }
    </section>
  )
}