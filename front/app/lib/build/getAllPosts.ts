import { gql, GraphQLClient } from "graphql-request";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Post } from "../type";
import stripRichTextRelationshipPayloads from "../strip-richtext-relationship-payloads";

dotenv.config({ quiet: true });
const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_ALL_POSTS = gql`
  query {
    posts {
      id
      title
      status
      excerpt
      publishedAt
      tags { name }
      keywords { name }
      content {
        document(hydrateRelationships: true)
      }
    }
  }
`;

async function main() {
  try {
    const data:{posts: Post[]} = await client.request(GET_ALL_POSTS);
    const posts = data.posts
      .filter(post => post.status === 'published')
      .map((post) => ({
        ...post,
        content: post.content
          ? {
              ...post.content,
              document: stripRichTextRelationshipPayloads(post.content.document),
            }
          : post.content,
      }));

    const outputPath = path.join(process.cwd(), "public/data/all_posts.json");
    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  } catch (e) {
    console.error("Failed to fetch posts:", e);
    process.exit(1);
  }
}

main();
