import { gql, GraphQLClient } from 'graphql-request';
import Note from '@/app/component/note';
import { mergeInlineInternalLinks } from '@/app/lib/merge-inline-internal-link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Post } from '@/app/lib/type';
import ToolBox from '@/app/component/hyperlink-map/ToolBox';
import path from 'path';
import fs from 'fs';

const client = new GraphQLClient(process.env.GRAPHQL_API_URL ?? '');

const GET_POST_BY_ID = gql`
  query PostById($id: ID!) {
    post(where: { id: $id }) {
      id
      title
      publishedAt
      meta
      order
      status
      content {
        document(hydrateRelationships: true)
      }
      tags {
        id
        name
      }
      keywords {
        id
        name
      }
      places {
        id
        lat
        lng
        name
      }
      internalLinks {
        id
        title
        order
        internalLinks {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
        internalBacklinks {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
        links {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
        backlinks {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
      }
      internalBacklinks {
        id
        title
        internalLinks {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
        internalBacklinks {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
        links {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
        backlinks {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
      }
      links {
        id
        title
        order
        internalLinks {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
        internalBacklinks {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
        links {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
        backlinks {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
      }
      backlinks {
        id
        title
        internalLinks {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
        internalBacklinks {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
        links {
          id
          title
          order
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
        backlinks {
          id
          title
          links { id title }
          backlinks { id title }
          internalLinks { id title }
          internalBacklinks { id title }
        }
      }
      playlists {
        id
        title
        songs { id }
      }
    }
  }
`;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  if (!slug) throw new Error("Missing ID param");

  const data: {post: Post} = await client.request(GET_POST_BY_ID, { id: slug });
  const post = data.post;

  return {
    title: `${post?.title} | solmi.wiki`,
    description: `${post?.title}`,
  };
}

export async function generateStaticParams() {
  const data: {posts: Post[]}= await client.request(gql`
    query {
      posts {
        id
      }
    }
  `);

  return data.posts.map((post: { id: string }) => ({ slug: post.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  if (!slug) throw new Error("Missing ID param");

  const data: {post: Post} = await client.request(GET_POST_BY_ID, { id: slug });
  if (!data.post) {
    return notFound();
  }
  const post = data.post;

  if (!post.content) return;
  post.content.document = mergeInlineInternalLinks(post.content.document);

  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <div
        id="note_wrapper"
        className='flex gap-4 w-full pt-[40vh] text-text-900 break-normal md:break-keep overflow-y-scroll overflow-x-hidden custom-scrollbar focus:outline-0'
      >
        {/* 본문 */}
        <Suspense>
          <Note post={post} />
        </Suspense>
      </div>

      {/* 오른쪽 사이드바 */}
      <ToolBox post={post} allPlaylists={playlists} />
    </>
  )
}