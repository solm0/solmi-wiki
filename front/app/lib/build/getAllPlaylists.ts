import { gql, GraphQLClient } from "graphql-request";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Playlist } from "../type";

dotenv.config({ quiet: true });
const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

if (!process.env.GRAPHQL_API_URL) {
  throw new Error("GRAPHQL_API_URL is not defined");
}

const GET_ALL_PLAYLISTS = gql`
  query {
    playlists {
      id
      title
      youtubePlaylistId
      posts {
        id
        title
        excerpt
      }
    }
  }
`;

async function main() {
  try {
    const data:{playlists: Playlist[]} = await client.request(GET_ALL_PLAYLISTS);

    const outputPath = path.join(process.cwd(), "public/data/all_playlists.json");
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to fetch posts:", e);
    process.exit(1);
  }
}


main();
