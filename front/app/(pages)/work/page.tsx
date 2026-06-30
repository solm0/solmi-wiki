import type { Metadata } from "next";
import { gql, GraphQLClient } from "graphql-request";
import WorkLists from "@/app/component/work-lists";
import { Post } from "@/app/lib/type";
import ToolBox from "@/app/component/hyperlink-map/ToolBox";
import { Suspense } from "react";

const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_ALL_POSTS = gql`
  query {
    posts (where: {
      work: {equals: true}
    }) {
      id
      title
      status
      externalLink
      publishedAt
      thumbnail
    }
  }
`;

export const metadata: Metadata = {
  title: "Work",
  description: "진열대",
};

type Data = {
  posts: Post[]
}

export default async function WorkPage() {
  const data:Data = await client.request(GET_ALL_POSTS);
  const posts = data.posts;
  const finalPosts = posts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  
  return (
    <>
      <Suspense>
        <WorkLists posts={finalPosts} />
      </Suspense>

      {/* 오른쪽 사이드바 */}
      <ToolBox />
    </>
  )
}
