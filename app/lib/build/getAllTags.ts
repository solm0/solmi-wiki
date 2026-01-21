import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { gql, GraphQLClient } from "graphql-request";

export type Tag = {
  id: string;
  name: string;
  posts: {keywords: {name: string}[]}[];
};

export type TagsResponse = {
  tags: Tag[];
};

const client = new GraphQLClient(process.env.GRAPHQL_API_URL!);

const GET_ALL_TAGS = gql`
  query {
    tags {
      id
      name
      posts {
        keywords { name }
      }
    }
  }
`;

const dirPath = path.join(process.cwd(), 'public/data/');
fs.mkdirSync(dirPath, { recursive: true });

export default async function main() {
  const data: TagsResponse = await client.request(GET_ALL_TAGS);
  const tags: Tag[] = data.tags;

  tags.forEach(getKeywordsTag);
  writeKeywordFiles();
}

const tagKeywordMap: Record<string, Record<string, number>> = {};
const globalKeywordCount: Record<string, number> = {};

export function getKeywordsTag(tag: Tag) {
  if (!tagKeywordMap[tag.name]) tagKeywordMap[tag.name] = {};

  for (const post of tag.posts) {
    for (const kw of post.keywords) {
      tagKeywordMap[tag.name][kw.name] = (tagKeywordMap[tag.name][kw.name] || 0) + 1;
      globalKeywordCount[kw.name] = (globalKeywordCount[kw.name] || 0) + 1;
    }
  }
}

export function writeKeywordFiles() {
  const keywordsByTag: Record<string, string[]> = {};

  for (const [tag, keywords] of Object.entries(tagKeywordMap)) {
    const sorted = Object.entries(keywords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([kw]) => kw);
    keywordsByTag[tag] = sorted;
  }

  const globalRank = Object.entries(globalKeywordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([kw]) => kw);
  keywordsByTag["전체"] = globalRank;

  fs.writeFileSync(
    path.join(dirPath, 'top_keywords_tag.json'),
    JSON.stringify(keywordsByTag, null, 2)
  );
}

main().catch(console.error);