import { Metadata } from "next";
import { gql, GraphQLClient } from "graphql-request";
import ToolBox from "../../component/hyperlink-map/ToolBox";
import path from "path";
import fs from "fs";
import PhotobookTimeline from "../../component/photobook/photobook-timeline";
import { PhotobookEntry, Post } from "../../lib/type";
import { photobookPostIds } from "../../lib/photobook";

export const metadata: Metadata = {
  title: "Photobook",
  description: "사진집",
};

const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_MINIMAL_POSTS_BY_ID = gql`
  query PostsById($ids: [ID!]!) {
    posts(where: {id: { in: $ids } }) {
      id
      title
      tags {
        name
      }
    }
  }
`;

export default async function PhotobookPage() {
  const data: { posts: Post[] } = await client.request(GET_MINIMAL_POSTS_BY_ID, {
    ids: photobookPostIds,
  });

  const photobookPath = path.join(process.cwd(), "public/data/photobook_images.json");
  const photobookEntries: PhotobookEntry[] = fs.existsSync(photobookPath)
    ? JSON.parse(fs.readFileSync(photobookPath, "utf8"))
    : [];

  const postMap = new Map(data.posts.map((post) => [post.id, post]));
  const timelineEntries = photobookEntries
    .map((entry) => {
      const post = postMap.get(entry.postId);
      if (!post) return null;

      return {
        id: post.id,
        title: post.title,
        folder: entry.folder,
        images: entry.images,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <section className="fixed top-0 left-0 w-full h-full flex justify-center items-center text-text-800 text-xs">
        <PhotobookTimeline entries={timelineEntries} />
      </section>

      <ToolBox allPlaylists={playlists} />
    </>
  );
}
