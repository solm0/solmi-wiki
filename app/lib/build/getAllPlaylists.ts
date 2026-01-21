import { gql, GraphQLClient } from "graphql-request";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Playlist } from "../type";

dotenv.config();
const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

if (!process.env.GRAPHQL_API_URL) {
  throw new Error("GRAPHQL_API_URL is not defined");
}

const GET_ALL_PLAYLISTS = gql`
  query {
    playlists {
      id
      title
      posts {
        id
        title
        excerpt
      }
      songs {
        id
        artist
        album
        thumbnailId
        youtubeVideoId
        desc
        lyric
      }
    }
  }
`;

async function main() {
  try {
    console.log("Fetching playlists...");
    const data:{playlists: Playlist[]} = await client.request(GET_ALL_PLAYLISTS);

    const outputPath = path.join(process.cwd(), "public/data/all_playlists.json");
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log("Saved to app/lib/data/all_playlists.json");
  } catch (e) {
    console.error("Failed to fetch posts:", e);
    process.exit(1);
  }
}

main();