import type { Metadata } from "next";
import { gql, GraphQLClient } from "graphql-request";
import WorkLists from "@/app/component/work-lists";
import { Post } from "@/app/lib/type";
import ToolBox from "@/app/component/hyperlink-map/ToolBox";
import { Suspense } from "react";
import path from "path";
import fs from 'fs';

const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_ALL_POSTS = gql`
  query {
    posts (where: {
      meta: {equals: true}
    }) {
      id
      title
      status
      publishedAt
      thumbnail
    }
  }
`;

export const metadata: Metadata = {
  title: "작업",
  description: "작업",
};

type Data = {
  posts: Post[]
}

export default async function BlogPage() {
  const data:Data = await client.request(GET_ALL_POSTS);
  const posts = data.posts;
  const finalPosts = posts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  
  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <Suspense>
        <WorkLists posts={finalPosts} />
      </Suspense>

      {/* 오른쪽 사이드바 */}
      <ToolBox allPlaylists={playlists} />
    </>
  )
}