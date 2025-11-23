import { Metadata } from "next";
import { gql, GraphQLClient } from "graphql-request";
import Copyright from "../component/copyright";
import { CardSm, CardMd, CardLg, CardXl } from "../component/cards";
import ToolBox from "../component/hyperlink-map/ToolBox";
import { Post } from "../lib/type";

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
    'cmdbjy3bl003pmdamzzp5bd6e',
    'cmdd4lavh00asmdam6xyklcah',
    'cmdc874vg0089mdam4fcceslp',

    // 독서

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
  const meta = minimalData.posts.filter(post => post.tags.name === '미분류' && post.meta === true);
  const travel = minimalData.posts.filter(post => post.tags.name === '방랑').sort((a, b) => a.title.localeCompare(b.title));
  const code = minimalData.posts.filter(post => post.tags.name === '코딩');
  const read = minimalData.posts.filter(post => post.tags.name === '독서');
  const unsorted = minimalData.posts.filter(post => (post.tags.name === '미분류' && post.meta === false));
  const exchange = exchangeData.posts

  return (
    <>
      <section className="relative flex flex-col gap-24 text-text-900 w-full pt-[20vh] pb-[20vh] overflow-y-scroll overflow-x-hidden focus:outline-hidden custom-scrollbar">
        <h2>반갑습니다.</h2>

        <article className="flex flex-col gap-4">
          <h2><b>대해서</b><span className="text-text-800"> 이 웹사이트 &apos;solmi.wiki&apos;와 저에 대한 정보입니다.</span></h2>
          <CardMd posts={meta} />
        </article>

        <article className="flex flex-col gap-4">
          <h2><b>작업</b><span className="text-text-800"> 제가 만드는 것들입니다.</span></h2>
          <CardXl posts={work} />
        </article>

        <article className="flex flex-col gap-4">
          <h2><b>방랑</b><span className="text-text-800"> 교환학생 기간의 배낭여행 기록입니다.</span></h2>
          <CardSm posts={exchange} />
          <CardLg posts={travel} />
        </article>
        
        <article className="flex flex-col gap-4">
          <h2><b>코딩</b><span className="text-text-800"> 공부하고 기록합니다.</span></h2>
          <CardSm posts={code} />
        </article>

        <h2><b>독서</b><span className="text-text-800"> 추가 예정입니다.</span></h2>
        <div>
          {read.map((post) => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              {/* other UI */}
            </div>
          ))}
        </div>

        <article className="flex flex-col gap-4">
          <h2><b>미분류</b><span className="text-text-800"> 기타 관심사를 다루거나, 목적 없이 잡다한 생각을 모읍니다.</span></h2>
          <CardMd posts={unsorted} />
        </article>
        <Copyright />
      </section>

      {/* 오른쪽 사이드바 */}
      <ToolBox />
    </>
  )
}