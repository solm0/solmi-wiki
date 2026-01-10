import { Metadata } from "next";
import { gql, GraphQLClient } from "graphql-request";
import Copyright from "../component/copyright";
import { CardSm, CardMd, CardLg, CardXl } from "../component/cards";
import ToolBox from "../component/hyperlink-map/ToolBox";
import { Post } from "../lib/type";
import { maruburi, maruburi_bold } from "../lib/localfont";

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
    'cmder5t660000tf6m7kyppin6',
    'cmjiezvf00000d2plng81x5ea',
    'cmix14nk2008tis47qdxc60cp',
    'cmiet1w8n0005kcwpbwuo3i75',

    // 미분류
    'cmdbofzbb0063mdamktnoe9t0',
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
  const exchange = exchangeData.posts

  return (
    <>
      <section className={`${maruburi.className} relative flex flex-col gap-24 text-text-900 w-full pt-[20vh] pb-[20vh] overflow-y-scroll overflow-x-hidden focus:outline-hidden custom-scrollbar`}>
        <h2>반갑습니다.</h2>

        <article className="flex flex-col gap-4">
          <h2><b className={`${maruburi_bold.className}`}>대해서</b><span className="text-text-800"> 이 웹사이트 &apos;solmi.wiki&apos;와 저에 대한 정보입니다.</span></h2>
          <div className="flex flex-col md:flex-row gap-2 w-full flex-wrap">
            <CardMd post={meta[2]} label="웹사이트에 대해서" />
            <CardMd post={meta[1]} />
            <CardMd post={meta[0]} />
          </div>
        </article>

        <article className="flex flex-col gap-4">
          <h2><b className={`${maruburi_bold.className}`}>작업</b><span className="text-text-800"> 제가 만든 것들입니다.</span></h2>
          <CardXl posts={work} />
        </article>

        <article className="flex flex-col gap-4">
          <h2><b className={`${maruburi_bold.className}`}>방랑</b><span className="text-text-800"> 교환학생 기간의 배낭여행 기록입니다.</span></h2>
          <CardSm posts={exchange} />
          <CardLg posts={travel} />
        </article>
        
        <article className="flex flex-col gap-4">
          <h2><b className={`${maruburi_bold.className}`}>코딩</b><span className="text-text-800"> 공부하고 기록합니다.</span></h2>
          <CardSm posts={code} />
        </article>

        <article className="flex flex-col gap-4">
          <h2><b className={`${maruburi_bold.className}`}>미분류</b><span className="text-text-800"> 기타 관심사를 다루거나, 목적 없이 잡다한 생각을 모읍니다.</span></h2>
          <div className="flex flex-col md:flex-row gap-2 w-full flex-wrap">
            {unsorted.map((post, i) => <CardMd key={i} post={post} />)}
          </div>
        </article>
        <Copyright />
      </section>

      {/* 오른쪽 사이드바 */}
      <ToolBox />
    </>
  )
}