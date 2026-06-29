import type { Metadata } from "next";
import { gql, GraphQLClient } from "graphql-request";
import { Suspense } from "react";
import GenerateChron from "../lib/gererate-chron";
import BlogLists from "../component/blog-lists";
import { Post } from "@/app/lib/type";
import ToolBox from "@/app/component/hyperlink-map/ToolBox";
import path from "path";
import fs from 'fs';

const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_ALL_POSTS = gql`
  query {
    posts {
      id
      title
      status
      publishedAt
      tags { name }
    }
  }
`;

export const metadata: Metadata = {
  title: "Timeline",
  description: "블로그",
};

export default async function TimelinePage() {
  const data: {posts: Post[]} = await client.request(GET_ALL_POSTS);
  const posts = data.posts.filter(post => post.status === 'published');
  const finalPosts = GenerateChron(posts);

  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-1 overflow-y-auto pl-4 pr-4 md:pl-32 md:pr-0  ">
        <Suspense>
          <BlogLists posts={finalPosts} />
        </Suspense>
      </div>

      {/* 오른쪽 사이드바 */}
      <ToolBox allPlaylists={playlists} />
    </>
  )
}
