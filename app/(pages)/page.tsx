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
    'cmdc93fii008hmdam1nvhb1c2', // 웹사이트에 대해서
    'cmdc92ytj008gmdamgb3x47wl', // 웹사이트 뒤 사람에 대해서
    'cmdc93ok7008imdam853f86o2', // changelog

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
  const travel = minimalData.posts.filter(post => post.tags && post.tags.name === '방랑').sort((a, b) => a.title.localeCompare(b.title));
  const code = minimalData.posts.filter(post => post.tags && post.tags.name === '코딩');
  const unsorted = minimalData.posts.filter(post => post.tags && post.tags.name === '미분류');
  const exchange = exchangeData.posts;

  // read all playlist from file
  const playlistsPath = path.join(process.cwd(), "public/data/all_playlists.json");
  const playlists = JSON.parse(fs.readFileSync(playlistsPath, "utf8")).playlists;

  return (
    <>
      <section className={`${maruburi.className} relative flex flex-col gap-24 text-text-900 w-full pt-[20vh] pb-[20vh] overflow-y-scroll overflow-x-hidden focus:outline-hidden custom-scrollbar`}>

        <article className="flex flex-col gap-4">
          <div className="flex flex-col gap-[1em] break-keep max-w-[47em] leading-[2em] text-text-800">
            <p>반갑습니다.</p>
            <div>
              <b className={`${maruburi_bold.className} text-text-900`}>처음 오신 분을 위한 (진짜로) 간략한 가이드</b>
              <ol className="list-decimal pl-4.5">
                <li className="pl-2">위 · 왼쪽 아이콘 <Funnel className="inline w-4 h-4 mx-1 text-text-900" />을 클릭하면 이 웹사이트의 노트들을 탐색할 수 있는 <strong className="text-text-900">노트 탐색기</strong>가 열립니다.</li>
                <li className="pl-2">위 · 오른쪽 아이콘 <FlaskConical className="inline w-4 h-4 mx-1 text-text-900" />을 클릭하면 열리는 <strong className="text-text-900">도구 상자</strong>에는 현재 노트에서 사용 가능한 도구들이 나타납니다.</li>
                <li className="pl-2">그 옆의 <Settings className="inline w-4 h-4 mx-1 text-text-900" />을 클릭하면 나오는 <strong className="text-text-900">설정</strong> 창에서는 테마를 바꾸거나 도구들을 숨김/표시할 수 있습니다.</li>
              </ol>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full flex-wrap">
            <CardMd post={minimalData.posts.find(post=>post.id==='cmdc93fii008hmdam1nvhb1c2') ?? null} label="웹사이트에 대해서" />
            <CardMd post={minimalData.posts.find(post=>post.id==='cmdc92ytj008gmdamgb3x47wl') ?? null} />
            <CardMd post={minimalData.posts.find(post=>post.id==='cmdc93ok7008imdam853f86o2') ?? null} />
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
        
        {/* <article className="flex flex-col gap-4">
          <h2 className="flex flex-col gap-4 items-start">
            <div className={`${maruburi_bold.className} text-3xl`}>시리즈</div>
            <p className="text-text-800 break-keep max-w-[47em] leading-[2em]">'OpenGL', '셀프호스팅', 'NLP 논문' 등 기존 '코딩' 태그를 세분화시키려고 함, 아직 공사 중...</p>
          </h2>
          <CardSm posts={code} />
        </article> */}

        <Copyright />
      </section>

      {/* 오른쪽 사이드바 */}
      <ToolBox allPlaylists={playlists} />
    </>
  )
}