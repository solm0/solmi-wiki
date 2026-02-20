import { Metadata } from "next";
import { gql, GraphQLClient } from "graphql-request";
import Copyright from "../component/copyright";
import { CardSm, CardMd, CardLg, CardXl } from "../component/cards";
import ToolBox from "../component/hyperlink-map/ToolBox";
import { Post } from "../lib/type";
import { maruburi, maruburi_bold } from "../lib/localfont";
import path from "path";
import fs from 'fs';
import Link from "next/link";
import { FlaskConical, Funnel, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "solmi.wiki",
  description: "solmi.wiki",
};

const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_HYDRATED_POSTS_BY_ID = gql`
  query PostsById($ids: [ID!]!) {
    posts(where: {id: { in: $ids } }) {
      id
      title
      excerpt
      content {
        document(hydrateRelationships: true)
      }
    }
  }
`;

const GET_MINIMAL_POSTS_BY_ID = gql`
  query PostsById($ids: [ID!]!) {
    posts(where: {id: { in: $ids } }) {
      id
      title
      thumbnail
      meta
      tags {
        name
      }
    }
  }
`;

export default async function HomePage() {
  const hydratedIds = [
    // 작업
    'cmdbh1znz0018mdam9bp6amgl',
    'cmdbgrn950013mdamemjflr33',
    'cmdbg5oms000kmdam5vx87wxu',
  ];

  const minimalIds = [
    // 대해서
    'cmdc93fii008hmdam1nvhb1c2',
    'cmdc92ytj008gmdamgb3x47wl',
    'cmdc93ok7008imdam853f86o2',

    // 방랑
    'cmdc6ricb0084mdamubfs2zbp',
    'cmdc6ffot007rmdamyxjls5rl',
    'cmdc68f28007jmdamfoomxsbi',
    'cmdc5xxvn007dmdam3qkfh6ks',
    'cmdc5sw640076mdamz3mvy9gq',
    'cmedxlusw003ttf6mmmkfwbpk',
    'cmee9giwo003ztf6m65nt413w',
    'cmex7mm4p004utf6mmdd281s9',
    'cmera1z1w004ktf6moamgro7r',

    // 코딩
    'cmiet1w8n0005kcwpbwuo3i75',
    'cmlrod57v001mfq1i8pp8dyku',
    'cmkl98g3l000jd2pl5631vgs9',
    'cml7n52ej000mfq1iu6vwab46',

    // 미분류
    'cmlaxhg5m000zfq1im0z26gbe',
    'cmdbhzcw20029mdamef7fb909',
    'cmdbj0tkg0031mdamqu9pq9mv',
    'cmdbhketi001vmdam8rxmr4a6',
    'cmdbi1eah002bmdamokt46avt',
  ]

  const hydratedData: {posts: Post[]} = await client.request(GET_HYDRATED_POSTS_BY_ID, { ids: hydratedIds });
  const minimalData: {posts: Post[]} = await client.request(GET_MINIMAL_POSTS_BY_ID, { ids: minimalIds });
  const exchangeData = await client.request(GET_MINIMAL_POSTS_BY_ID, {ids: ['cmdbmtpt8005omdamericlkia']});

  const work = hydratedData.posts;
  const meta = minimalData.posts.filter(post => post.meta === true);
  const travel = minimalData.posts.filter(post => post.tags.name === '방랑').sort((a, b) => a.title.localeCompare(b.title));
  const code = minimalData.posts.filter(post => post.tags.name === '코딩');
  const unsorted = minimalData.posts.filter(post => (post.tags.name === '미분류' && post.meta === false));
  const exchange = exchangeData.posts;

  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <section className={`${maruburi.className} relative flex flex-col gap-24 text-text-900 w-full pt-[20vh] pb-[20vh] overflow-y-scroll overflow-x-hidden focus:outline-hidden custom-scrollbar`}>

        <article className="flex flex-col gap-4">
          <div className="flex flex-col gap-[1em] break-keep max-w-[47em] leading-[2em]">
            <p>반갑습니다.</p>
            <p>
              <b className={maruburi_bold.className}>처음 오신 분을 위한 간략한 가이드 — </b>
              맨 위, 맨 왼쪽 아이콘 <Funnel className="inline w-4 h-4 mx-1" />을 클릭하면 태그, 문자열 검색, 키워드를 통해 이 웹사이트의 노트들을 탐색할 수 있는 '노트 탐색기'가 열립니다.
              맨 위, 맨 오른쪽 아이콘 <FlaskConical className="inline w-4 h-4 mx-1" />을 클릭하면 도구 상자가 열립니다. 여기에는 현재 노트에서 사용 가능한 도구들이 나타납니다.
              <Settings className="inline w-4 h-4 mx-1" />톱니바퀴 아이콘을 클릭해 웹사이트 테마를 바꾸거나 도구를 숨길 수 있습니다.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full flex-wrap">
            <CardMd post={meta[2]} label="웹사이트에 대해서" />
            <CardMd post={meta[1]} />
            <CardMd post={meta[0]} />
          </div>
        </article>

        <article className="flex flex-col gap-4">
          <h2 className="flex flex-col gap-4 items-start">
            <Link href={'/work'} className={`${maruburi_bold.className} text-3xl hover:text-text-700 transition-colors duration-300`}>작업</Link>
            <p className="text-text-800 break-keep max-w-[47em] leading-[2em]">주로 웹과 서체를 가지고 작업합니다.</p>
          </h2>
          <CardXl posts={work} />
        </article>

        <article className="flex flex-col gap-4">
          <h2 className="flex flex-col gap-4 items-start">
            <div className={`${maruburi_bold.className} text-3xl`}>방랑</div>
            <p className="text-text-800 break-keep max-w-[47em] leading-[2em]">교환학생 기간의 배낭여행 기록입니다.</p>
          </h2>
          <CardSm posts={exchange} />
          <CardLg posts={travel} />
        </article>
        
        <article className="flex flex-col gap-4">
          <h2 className="flex flex-col gap-4 items-start">
            <div className={`${maruburi_bold.className} text-3xl`}>코딩</div>
            <p className="text-text-800 break-keep max-w-[47em] leading-[2em]">공부하고 기록합니다. 모든 정보의 정확성은 보장하지 않습니다.</p>
          </h2>
          <CardSm posts={code} />
        </article>

        <article className="flex flex-col gap-4">
          <h2 className="flex flex-col gap-4 items-start">
            <div className={`${maruburi_bold.className} text-3xl`}>미분류</div>
            <p className="text-text-800 break-keep max-w-[47em] leading-[2em]">기타 관심사를 다루거나, 목적 없이 잡다한 생각을 모읍니다.</p>
          </h2>
          <div className="flex flex-col md:flex-row gap-2 w-full flex-wrap">
            {unsorted.map((post, i) => <CardMd key={i} post={post} />)}
          </div>
        </article>
        <Copyright />
      </section>

      {/* 오른쪽 사이드바 */}
      <ToolBox allPlaylists={playlists} />
    </>
  )
}