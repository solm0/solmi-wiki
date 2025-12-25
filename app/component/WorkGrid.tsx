import { Suspense, useState } from "react";
import { Post } from "../lib/type";
import ThumbnailList from "./thumbnail-list";

export default function WorkGrid({ 
  filters, posts
}: {
  filters: Record<string, boolean>
  posts: Post[] | null;
}) {
  if (!posts) return;

  const [hovered, setHovered] = useState<string | null>(null);

  const years = ['2026', '2025', '2024', '2023', '2022'];
  const medias = ['web', 'typeface', 'etc'];

  const web = [
    'cmdbfks15000emdamuc896vyo',
    'cmdbfu3ze000hmdam9lea1rid',
    'cmdbg0vqi000jmdamb87btaj8',
    'cmdbg84v6000rmdamvkyn1byx',
    'cmdbgijlo000vmdam79xyvru1',
    'cmdbgko8e000wmdam8p56c3fe',
    'cmdbgmanq000xmdamhyd07aoq',
    'cmdbh1znz0018mdam9bp6amgl',
    'cmdbh3etx0019mdamahvx21fq',
    'cmdc93fii008hmdam1nvhb1c2',
    'cmfmm0h3b0067tf6m8s65tl70',
    'cmfmm64yg0068tf6mubv7duf6',
  ];
  const typeface = [
    'cmdbfxchq000imdampt826hpv',
    'cmdbgfm09000tmdamevlc9zxu',
    'cmdbggydg000umdam4pl46dnp',
    'cmdbgon5b0010mdamfnqyzmv9',
    'cmdbgrn950013mdamemjflr33',
  ];

  function getYear(post: Post) {
    return post.publishedAt.toString().slice(0, 4);
  }

  function getMedia(post: Post): string {
    if (web.includes(post.id)) return 'web';
    if (typeface.includes(post.id)) return 'typeface';
    return 'etc';
  }

  function isEmpty(year: string): boolean {
    return Object.values(matrix[year]).every(arr => arr.length === 0);
  }

  // Year × Media 매트릭스 생성
  function getPostsByCell(posts: Post[], years: string[], medias: string[]) {
    const map: Record<string, Record<string, Post[]>> = {};

    years.forEach(year => {
      map[year] = {};
      medias.forEach(media => {
        map[year][media] = posts.filter(p =>
          getYear(p) === year && getMedia(p) === media
        );
      });
    });

    return map;
  }

  const matrix = getPostsByCell(posts, years, medias);

  let grids;

  // 1) year + media 동시에 활성화 → Year × Media 매트릭스
  if (filters.year && filters.media) {
    grids = (
      <Suspense>
        {years.map((year, row) =>
          medias.map((media, col) => (
            <div
              key={`${year}-${media}`}
              className={`row-start-${row + 1} col-start-${col + 1}`}
            >
              {row === 0 &&<p>{media}</p>}
              {!isEmpty(year) && <p className={`bg-button-100 ${col === 0 ? 'text-text-900' : 'text-button-100'}`}>{year}</p>}

              <div className="flex flex-wrap">
                {matrix[year][media].map(post =>
                  <ThumbnailList
                    key={post.id}
                    note={post}
                    hovered={hovered}
                    setHovered={setHovered}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </Suspense>
    );
  }

  // 2) year만 활성화 → 세로로 years 나열
  else if (filters.year) {
    grids = (
      <Suspense>
        {years.map((year, row) => (
          <div
            key={year}
            className={`row-start-${row + 1} col-start-1`}
          >
            {!isEmpty(year) && <p className={`bg-button-100`}>{year}</p>}

            <div className="flex flex-wrap">
              {posts
                .filter(post => getYear(post) === year)
                .map(post =>
                  <ThumbnailList
                    key={post.id}
                    note={post}
                    hovered={hovered}
                    setHovered={setHovered}
                    noColumn={true}
                  />
                )}
            </div>
          </div>
        ))}
      </Suspense>
    );
  }

  // 3) media만 활성화 → 가로로 medias 나열
  else if (filters.media) {
    grids = (
      <Suspense>
        {medias.map((media, col) => (
          <div
            key={media}
            className={`col-start-${col + 1} row-start-1`}
          >
            <p>{media}</p>
            <div className="flex flex-wrap">
              {posts
                .filter(post => getMedia(post) === media)
                .map(post =>
                  <ThumbnailList
                    key={post.id}
                    note={post}
                    hovered={hovered}
                    setHovered={setHovered}
                  />
                )}
            </div>
          </div>
        ))}
      </Suspense>
    );
  }

  // 4) 아무 필터도 없음 → 전체 posts 나열
  else {
    grids = (
      <div className="flex flex-wrap">
        <Suspense>
          {posts.map(post =>
            <ThumbnailList
              key={post.id}
              note={post}
              hovered={hovered}
              setHovered={setHovered}
              noColumn={true}
            />
          )}
        </Suspense>
      </div>
    );
  }

  return (
    <div
      className={
        `grid 
         ${filters.media ? `grid-cols-3` : 'grid-cols-1'} 
         ${filters.year ? `grid-rows-${years.length}` : 'grid-rows-1'}
         w-full h-full text-sm text-text-900`
      }
    >
      {grids}
    </div>
  );
}