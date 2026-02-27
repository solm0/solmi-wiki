'use client'

import { Post } from "@/app/lib/type"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { maruburi_bold } from "../lib/localfont"
import { useState } from "react"

export function CardSm({posts}: {posts: Post[] | Post}) {
  return (
    <div className="flex gap-2 w-full max-w-[47rem] flex-wrap">
      {Array.isArray(posts) ? posts.map((post) => (
        <Link
        key={post.id}
        href={post.id}
        className={`shrink-0 w-full bg-button-100 h-auto flex items-center rounded-sm p-4 justify-between hover:bg-button-200 hover:translate-x-1 transition-[colors, transform] duration-300`}
        >
          <h3 className="self-end break-keep">{post.title}</h3>
          <ArrowUpRight className="shrink-0 self-start w-5 h-5" />
        </Link>
      )) : (
        <Link
          key={posts.id}
          href={posts.id}
          className={`shrink-0 w-full bg-button-100 h-auto flex items-center rounded-sm p-4 justify-between hover:bg-button-200 hover:translate-x-1 transition-[colors, transform] duration-300`}
        >
          <h3 className="self-end break-keep">{posts.title}</h3>
          <ArrowUpRight className="shrink-0 self-start w-5 h-5" />
        </Link>
      )}
    </div>
  )
}

export function CardMd({post, label}: {post: Post | null, label?: string}) {
  if (post === null) return <div>post를 찾을 수 없습니다</div>;
  else return (
    <Link
      key={post.id}
      href={post.id}
      className={`shrink-0 w-full md:w-60 h-auto md:h-36 rounded-sm p-4 flex justify-between hover:translate-x-1 md:hover:translate-x-0 md:hover:translate-y-1 transition-[colors, transform] duration-300
        ${post.id === 'cmdc92ytj008gmdamgb3x47wl' || post.id ==='cmdc93fii008hmdam1nvhb1c2' ? 'bg-green-500 hover:bg-green-600' : 'bg-button-100 hover:bg-button-200' }`}
    >
      <h3 className="self-end break-keep max-h-full overflow-hidden">{label ? label : post.title}</h3>
      <ArrowUpRight className="shrink-0 self-start w-5 h-5" />
    </Link>
  )
}

const cloudName = "dpqjfptr6";
const transformations = "f_auto,q_auto,w_400,c_fill";

export function CardLg({posts}: {posts: Post[]}) {
  const generateUrl = (id: string) => {
    const publicId = id;
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}.jpg`;
  }

  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex gap-2 w-full flex-wrap">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={post.id}
          className={`relative shrink-0 w-full h-32 md:w-61 md:h-61 rounded-sm hover:translate-x-1 md:hover:translate-x-0 md:hover:translate-y-1 transition-[filter, transform] duration-300 overflow-clip`}
          onMouseEnter={() => setHovered(post.id)}
          onMouseLeave={() => setHovered(null)}
        >
          {post.thumbnail ?
            <Image
              src={generateUrl(post.thumbnail)}
              width={800}
              height={800}
              className="h-32 w-32 md:h-full md:w-full object-cover rounded-sm cursor-pointer"
              alt={post.id}
              unoptimized
            />
            :
            <Image
              src='https://images.unsplash.com/photo-1579546929518-9e396f3cc809'
              width={800}
              height={800}
              className="h-32 w-32 md:h-full md:w-full bg-button-50"
              alt={post.id}
              unoptimized
            />
          }
          <div className={`absolute bottom-0 left-32 md:left-0 w-[calc(100%-8rem)] md:w-full h-32 md:h-auto flex gap-4 bg-button-100 ${hovered === post.id && 'bg-button-200'} transition-colors duration-300 justify-between p-4 text-sm`}>
            <h3 className="break-keep">{post.title}</h3>
            <ArrowUpRight className="shrink-0 self-start w-5 h-5" />
          </div>
        </Link>
      ))}
    </div>
  )
}

export function CardXl({posts}: {posts: Post[]}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {posts.map((post) => {
        const carousels = post.content?.document.filter(cmp => cmp.type === 'component-block' && cmp.component === 'carousel').slice(0,2);
        if (!carousels) return null;

        return (
          <div
            key={post.id}
            className="flex h-[50vh] md:h-[60vh] w-full overflow-x-scroll cursor-default overscroll-x-none custom-hor-scrollbar rounded-sm"
          >
            <div className="flex gap-1 ml-72">
              {carousels.map((img, idx) => {
                return (
                  <div key={idx} className="flex gap-1 w-auto shrink-0">
                    {img.props.items.slice(0,2).map((item, idx) => {
                      const publicId = item.imageSrc;
                      const transformationsXl = "f_auto,q_auto";
                      const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformationsXl}/${publicId}.jpg`;

                      return (
                        <div
                          key={idx}
                          className="relative flex flex-col gap-1 snap-start snap-normal h-full w-auto shrink-0"
                        >
                          <Image
                            src={imageUrl}
                            width={800}
                            height={800}
                            className="h-full w-auto object-contain rounded-sm"
                            alt={item.alt}
                            unoptimized
                          />
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            <Link
              className="absolute flex flex-col w-60 md:w-80 pr-4 h-auto bg-button-100 p-4 rounded-br-sm rounded-tl-sm gap-[1rem] shrink-0 cursor-pointer hover:bg-button-200 transition-colors duration-300"
              href={post.id}
            >
              <div className="flex h-auto justify-between">
                <h3 className={`${maruburi_bold.className} break-keep`}>{post.title}</h3>
                <ArrowUpRight className="shrink-0 w-5 h-5" />
              </div>
              <div className="w-full text-sm break-keep leading-[1.7em]">{post.excerpt}</div>
            </Link>

          </div>
        )
      })}
    </div>
  )
}