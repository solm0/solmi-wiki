import { gql, GraphQLClient } from "graphql-request";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Post } from "../type";

dotenv.config();
const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_ALL_POSTS = gql`
  query {
    posts {
      id
      title
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
    console.log("Fetching posts...");
    const data:{posts: Post[]} = await client.request(GET_ALL_POSTS);

    const outputPath = path.join(process.cwd(), "public/_all_posts.json");
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log("Saved to public/_all_posts.json");
  } catch (e) {
    console.error("Failed to fetch posts:", e);
    process.exit(1);
  }
}

main();