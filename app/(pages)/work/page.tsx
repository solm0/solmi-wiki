import type { Metadata } from "next";
import { gql, GraphQLClient } from "graphql-request";
import WorkLists from "@/app/component/work-lists";
import { Post } from "@/app/lib/type";
import ToolBox from "@/app/component/hyperlink-map/ToolBox";

const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_ALL_POSTS = gql`
  query {
    posts {
      id
      title
      status
      publishedAt
      thumbnail
      tags {
        name
      }
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
    .filter(post => post.tags.name === '작업')

  return (
    <>
      <WorkLists posts={finalPosts} />

      {/* 오른쪽 사이드바 */}
      <ToolBox />
    </>
  )
}