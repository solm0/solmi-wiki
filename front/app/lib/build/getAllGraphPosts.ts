import { gql, GraphQLClient } from "graphql-request";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GraphPost } from "../type";

dotenv.config({ quiet: true });
const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_ALL_GRAPH_POSTS = gql`
  query {
    posts {
      id
      title
      status
      tags {
        id
        name
      }
      keywords {
        id
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
        order
      }
      internalLinks {
        id
        title
        order
      }
      internalBacklinks {
        id
        title
        order
      }
    }
  }
`;

async function main() {
  try {
    const data: { posts: GraphPost[] } = await client.request(GET_ALL_GRAPH_POSTS);
    const publishedPosts = data.posts.filter((post) => post.status === "published");
    const publishedIds = new Set(publishedPosts.map((post) => post.id));
    const filterLinks = (links?: GraphPost["links"]) => {
      return links?.filter((link) => link.id && publishedIds.has(link.id));
    };
    const posts = publishedPosts.map((post) => ({
      ...post,
      links: filterLinks(post.links),
      backlinks: filterLinks(post.backlinks),
      internalLinks: filterLinks(post.internalLinks),
      internalBacklinks: filterLinks(post.internalBacklinks),
    }));

    const outputPath = path.join(process.cwd(), "public/data/all_graph_posts.json");
    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  } catch (e) {
    console.error("Failed to fetch graph posts:", e);
    process.exit(1);
  }
}

main();
