import type { Metadata } from "next";
import { gql, GraphQLClient } from "graphql-request";
import { Suspense } from "react";
import GenerateChron from "../../lib/gererate-chron";
import BlogLists from "../../component/blog-lists";
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
    }
  }
`;

export const metadata: Metadata = {
  title: "블로그",
  description: "블로그",
};

export default async function BlogPage() {
  const data: {posts: Post[]} = await client.request(GET_ALL_POSTS);
  const posts = data.posts.filter(post => post.status === 'published');
  const finalPosts = GenerateChron(posts)

  return (
    <>
      <Suspense>
        <BlogLists posts={finalPosts} />
      </Suspense>

      {/* 오른쪽 사이드바 */}
      <ToolBox/>
    </>
  )
}