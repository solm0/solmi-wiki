import { gql, GraphQLClient } from 'graphql-request';
import Note from '@/app/component/note';
import { mergeInlineInternalLinks } from '@/app/lib/merge-inline-internal-link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Post } from '@/app/lib/type';
import ToolBox from '@/app/component/hyperlink-map/ToolBox';
import NoteScrollContainer from '@/app/component/layout/NoteScrollContainer';
import path from 'path';
import fs from 'fs';
import stripRichTextRelationshipPayloads from '@/app/lib/strip-richtext-relationship-payloads';

const client = new GraphQLClient(process.env.GRAPHQL_API_URL ?? '');

const GET_POST_BY_ID = gql`
  query PostById($id: ID!) {
    post(where: { id: $id }) {
      id
      title
      disclaimerOn
      publishedAt
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
      links {
        id
        title
        order
      }
      backlinks {
        id
        title
        links {
          id
          title
          order
        }
      }
      playlists {
        id
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
  post.content.document = stripRichTextRelationshipPayloads(post.content.document);
  post.content.document = mergeInlineInternalLinks(post.content.document);

  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <NoteScrollContainer>
        {/* 본문 */}
        <Suspense>
          <Note post={post} />
        </Suspense>
      </NoteScrollContainer>

      {/* 오른쪽 사이드바 */}
      <ToolBox post={post} allPlaylists={playlists} />
    </>
  )
}
