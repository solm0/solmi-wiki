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
  const publishedAt = new Date(post.publishedAt).toLocaleDateString('ko-KR');
  const year = publishedAt.toString().slice(0,4);
  const month = publishedAt.toString().slice(5,7);
  const day = publishedAt.toString().slice(9,11);

  const keywords = post.keywords.map(kw => kw.name);

  return (
    <section className={`relative ${pretendard.className} flex flex-col w-full h-auto items-start text-text-900 text-sm px-4 py-3 rounded-sm -left-4`}>
      <div className="flex gap-3 h-8 items-center">
        <Calendar className='w-3 h-3' />
        <div className="flex gap-1 h-full items-center">
          <p>{year}년</p>
          <p>{month}월</p>
          <p>{day}일</p>
        </div>
      </div>
      <div className="flex gap-3 h-8 items-center">
        <Tag className='w-3 h-3' />
        {post.tags.name}
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