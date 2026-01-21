import type { Metadata } from "next";
import GlobalGraphRenderer from "../../component/hyperlink-map/graph-global-renderer";
import { gql, GraphQLClient } from "graphql-request";
import { Suspense } from "react";
import BackButton from "../../component/atoms/back-button";
import { Post } from "@/app/lib/type";
import ToolBox from "@/app/component/hyperlink-map/ToolBox";
import path from "path";
import fs from 'fs';

const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_ALL_POSTS_GRAPH = gql`
  query {
    posts {
      id
      title
      tags {
        name
      }
      keywords {
        name
      }
      links {
        id
        title
      }
      internalLinks {
        id
        title
      }
    }
  }
`;

export const metadata: Metadata = {
  title: "하이퍼링크 맵",
  description: "하이퍼링크 맵",
};

export default async function GraphPage() {
  const data: {posts: Post[]} = await client.request(GET_ALL_POSTS_GRAPH);
  const posts = data.posts;

  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
        <Suspense fallback={<div>로딩 중</div>}>
          <GlobalGraphRenderer posts={posts} />
          <BackButton />
        </Suspense>
      </div>

      <div className="relative gap-8 w-full pointer-events-none"></div>
      {/* 오른쪽 사이드바 */}
      <ToolBox allPlaylists={playlists} />
    </>
  )
}