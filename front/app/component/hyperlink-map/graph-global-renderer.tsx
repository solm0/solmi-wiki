'use client'

import dynamic from "next/dynamic";
import { Graph, GraphPost } from "@/app/lib/type";
import { useEffect, useState } from "react";
import generateGlobalGraph from "@/app/lib/generate-global-graph";
import { useSearchParams } from "next/navigation";
import filterPosts from "@/app/lib/filter-posts";

export default function GlobalGraphRenderer() {
  // set graph
  const [graph, setGraph] = useState<Graph>({ nodes: [], links: [] });
  const [posts, setPosts] = useState<GraphPost[]>([]);
  useEffect(() => {
    async function loadGraphPosts() {
      const res = await fetch('/data/all_graph_posts.json');
      const graphPosts: GraphPost[] = await res.json();
      setPosts(graphPosts);
    }

    loadGraphPosts().catch(console.error);
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;
    const nextGraph: Graph = { nodes: [], links: [] };
    generateGlobalGraph(posts, nextGraph);
    setGraph(nextGraph);
  }, [posts]);

  // filter
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());
  const tag = newParams.get("tag");
  const search = newParams.get("search");
  const keywords = newParams.getAll("keyword");

  const filteredPosts = filterPosts({
    posts: posts,
    tag: tag,
    search: search,
    keywords: keywords,
  })

  const DynamicGlobalGraph = dynamic(() => import('./graph-global'), {ssr: false});

  return (
      <DynamicGlobalGraph graphData={graph} filteredData={filteredPosts} />
  )
}
