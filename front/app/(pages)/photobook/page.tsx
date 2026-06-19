import { Metadata } from "next";
import { gql, GraphQLClient } from "graphql-request";
import { CardMd, CardLg } from "../../component/cards";
import ToolBox from "../../component/hyperlink-map/ToolBox";
import { Post } from "../../lib/type";
import { maruburi } from "../../lib/localfont";
import path from "path";
import fs from 'fs';

export const metadata: Metadata = {
  title: "Photobook",
  description: "사진",
};

const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_MINIMAL_POSTS_BY_ID = gql`
  query PostsById($ids: [ID!]!) {
    posts(where: {id: { in: $ids } }) {
      id
      title
      thumbnail
      tags {
        name
      }
    }
  }
`;

export default async function PhotobookPage() {

  const minimalIds = [
    'cmdc6ricb0084mdamubfs2zbp',
    'cmdc6ffot007rmdamyxjls5rl',
    'cmdc68f28007jmdamfoomxsbi',
    'cmdc5xxvn007dmdam3qkfh6ks',
    'cmdc5sw640076mdamz3mvy9gq',
    'cmedxlusw003ttf6mmmkfwbpk',
    'cmee9giwo003ztf6m65nt413w',
    'cmex7mm4p004utf6mmdd281s9',
    'cmera1z1w004ktf6moamgro7r',

  ]


  const minimalData: {posts: Post[]} = await client.request(GET_MINIMAL_POSTS_BY_ID, { ids: minimalIds });

  const travel = minimalData.posts.filter(post => post.tags && post.tags.name === '방랑').sort((a, b) => a.title.localeCompare(b.title));

  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <section className={`${maruburi.className} relative flex flex-col gap-24 text-text-900 w-full pt-[20vh] pb-[20vh] overflow-y-scroll overflow-x-hidden focus:outline-hidden custom-scrollbar`}>
        <article className="flex flex-col gap-4">
          <CardLg posts={travel} />
        </article>
      </section>

      {/* 오른쪽 사이드바 */}
      <ToolBox allPlaylists={playlists} />
    </>
  )
}