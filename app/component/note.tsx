'use client'

import { Post } from "../lib/type";
import Content from '@/app/component/content';
import Footer from '@/app/component/footer';
import Metadata from '@/app/component/metadata';
import { maruburi, maruburi_bold } from '@/app/lib/localfont';
import { useRef } from "react";
import RingLinks from "./ring-links";
import SequenceNav from "./sequence-nav";
import { useClickedPlace } from "../lib/zustand/useClickedPlace";
import Nudge from "./music/Nudge";
import { useToggleStore } from "../lib/zustand/useToggleStore";
import TagButton from "./atoms/tag-button";

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

      // 부모 노트일 경우
      const sorted = [...post.links].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      next = sorted[0];

    } else if (post.backlinks?.[0]) {

      // 부모 노트가 아니며 부모가 있을 경우
      const links = (post.backlinks[0].links ?? [])
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const currentIndex = links.findIndex(p => p.id === post.id);

      prev = links[currentIndex-1] ?? null;
      next = links[currentIndex+1] ?? null;

      // 첫 번째 자식 노트일 경우
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
      block: 'nearest'
    })

    setFromMapPage(null);
  }

  const isToolBoxOpen = useToggleStore((s) => s.toggles['toolBox']);
  
  return (
    <article
      className={`
        ${maruburi.className}
        flex flex-col gap-12 w-full leading-[2em] font-serif
      `}
    >
      <div className="relative h-auto w-auto">
        <h1
          ref={headRef}
          className={`leading-[1.5em] text-3xl md:text-4xl text-text-950 ${maruburi_bold.className} max-w-[25em]`}
        >
          {post?.title}
        </h1>
        {post.tags && <TagButton tagname={post.tags.name} />}
      </div>

      <div
        className={`
          flex flex-col gap-2 max-w-[47em]
        `}
      >
        <RingLink />
        <Metadata post={post} />
      </div>
      
      <div className="flex flex-col w-full">
        {post.status === 'draft'
          ? <p>아직 공개되지 않은 노트입니다.</p>
          : post.content && <Content post={post.content.document} places={post.places} />
        }
      </div>

      {(post.backlinks?.length || (post.links?.length ?? 0) > 0) &&
        <div className={`max-w-[47em]`}>
          <SequenceNav isFirstChild={isFirstChild} prev={prev} next={next} />
        </div>
      }

      <div className={`max-w-[47em]`}>
        <Footer />
      </div>

      {/* 음악버튼 */}
      {!isToolBoxOpen && post.playlists.length !== 0 && <Nudge />}
    </article>
  )
}