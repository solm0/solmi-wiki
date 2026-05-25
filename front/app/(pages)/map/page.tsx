import { gql, GraphQLClient } from "graphql-request";
import { Metadata } from "next";
import dotenv from "dotenv";
import { Place } from "@/app/lib/type";
import MapScreen from "@/app/component/map/MapScreen";
import path from "path";
import fs from 'fs';

export const metadata: Metadata = {
  title: "세계지도",
  description: "세계지도",
};

dotenv.config();
const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_ALL_PLACES = gql`
  query {
    places {
      id
      lng
      lat
      name
      posts {
        title
        id
        excerpt
      }
    }
  }
`

async function getAllPlaces() {
  try {
    const data:{places: Place[]} = await client.request(GET_ALL_PLACES);
    return data;
  } catch(e) {
    console.error("Failed to fetch posts:", e);
    process.exit(1);
  }
}

export default async function MapPage() {
  const data = await getAllPlaces();
  const places = data.places;

  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <MapScreen allPlaces={places} allPlaylists={playlists} />
  )
}