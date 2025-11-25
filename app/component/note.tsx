'use client'

import { Post } from "../lib/type";
import Content from '@/app/component/content';
import Footer from '@/app/component/footer';
import Metadata from '@/app/component/metadata';
import { maruburi, maruburi_bold } from '@/app/lib/localfont';
import { pretendard } from "@/app/lib/localfont";
import { useRef } from "react";
import RingLinks from "./ring-links";
import SequenceNav from "./sequence-nav";
import { useClickedPlace } from "../lib/zustand/useClickedPlace";

export default function Note({
  post,
}: {
  post: Post;
}) {
  const headRef = useRef<HTMLDivElement>(null);

  const RingLink = () => {
    if (post.links && post.links?.length > 0) {   // 부모노트일 경우
      return (<RingLinks id={post.id} links={post.links} backlink={post} />);
    } else if (post.backlinks?.[0]) {             // 자식노트일 경우
      return (<RingLinks id={post.id} links={post.backlinks?.[0].links ?? null} backlink={post.backlinks?.[0]} />)
    } else return;
  }

  const generateSequence = () => {
    let prev = null;
    let next = null;
    let isFirstChild = false;

    if (post.links && post.links?.length > 0) {
      const sorted = [...post.links].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      next = sorted[0];
    } else if (post.backlinks?.[0]) {
      const currentOrder = post.order ?? 0;
      const links = post.backlinks[0].links ?? [];

      prev = links.find(link => link.order === currentOrder - 1) ?? null;
      next = links.find(link => link.order === currentOrder + 1) ?? null;

      if (prev === null) {
        prev = post.backlinks?.[0];
        isFirstChild = true;
      }
    }
    return { prev, next, isFirstChild };
  };

  const { prev, next, isFirstChild } = generateSequence();

  const fromMapPage = useClickedPlace(s => s.fromMapPage);
  const setFromMapPage = useClickedPlace(s => s.setFromMapPage);

  if (fromMapPage) {
    const placePlaceholder = document.getElementById(`placeholder-${fromMapPage}`);
    if (!placePlaceholder) return;

    placePlaceholder.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })

    setFromMapPage(null);
  }
  
  return (
    <article className={`${post.tags.name === '코딩' ? `${pretendard.className} font-sans leading-7` : `${maruburi.className} font-serif`} flex flex-col gap-12 w-full max-w-[47rem] leading-8`}>
      <h1
        ref={headRef}
        className={`leading-[1.5em] text-4xl text-text-950 ${post.tags.name === '코딩' ? `font-medium ${pretendard.className}` : maruburi_bold.className}`}
      >
        {post?.title}
      </h1>

      <div className="flex flex-col gap-2">
        <RingLink />
        <Metadata post={post} />
      </div>
      
      <div className="flex flex-col">
        {post.content && <Content post={post.content.document} font={`${post.tags.name === '코딩' ? 'sans' : 'serif'}`} places={post.places} />}
      </div>

      {(post.backlinks?.length || (post.links?.length ?? 0) > 0) &&
        <SequenceNav isFirstChild={isFirstChild} prev={prev} next={next} />
      }

      <Footer />
    </article>
  )
}