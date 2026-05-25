import { Graph, GraphPost } from "./type";

export function addLinkIfNotExists(graph: Graph, link: { source: string; target: string }) {
  if (!graph.links.find((l) =>
    ((l.source === link.source) && (l.target === link.target))
    || ((l.source === link.target) && (l.target === link.source))
  )) {
    graph.links.push(link);
  }
}

export function processLinks(
  post: GraphPost,
  graph: Graph,
  field: 'internalLinks' | 'links',
) {
  post[field]?.forEach(l => {
    if (!l.id) return;
    const link = { source: post.id, target: l.id };
    const node = graph.nodes.find((node) => node.id === post.id)
    if (node?.val) node.val += 1;
    addLinkIfNotExists(graph, link);
  })
}

export default async function generateGlobalGraph(
  posts: GraphPost[],
  graph: Graph,
) {
  posts.map((post) => {

    // nodes
    const node = { id: post.id, title: post.title, val: 1};
    graph.nodes.push(node);

    processLinks(post, graph, 'internalLinks');
    processLinks(post, graph, 'links');
  })
}
