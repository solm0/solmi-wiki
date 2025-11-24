import { gql, GraphQLClient } from 'graphql-request';
import Note from '@/app/component/note';
import { mergeInlineInternalLinks } from '@/app/lib/merge-inline-internal-link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Post } from '@/app/lib/type';
import ToolBox from '@/app/component/hyperlink-map/ToolBox';

const client = new GraphQLClient(process.env.GRAPHQL_API_URL ?? '');

const GET_POST_BY_ID = gql`
  query PostById($id: ID!) {
    post(where: { id: $id }) {
      id
      title
      publishedAt
      meta
      order
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
        langtitude
        latitude
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
  post.content.document = mergeInlineInternalLinks(post.content.document)

  return (
    <>
      <div
        id="note_wrapper"
        className='flex gap-8 w-full pt-[40vh] text-text-900 break-keep overflow-y-scroll overflow-x-hidden custom-scrollbar'
      >
        {/* 본문 */}
        <Suspense>
          <Note post={post} />
        </Suspense>
      </div>

      {/* 오른쪽 사이드바 */}
      <ToolBox post={post}/>
    </>
  )
}