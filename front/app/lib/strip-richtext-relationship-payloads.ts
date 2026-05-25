type JsonLike =
  | null
  | string
  | number
  | boolean
  | JsonLike[]
  | { [key: string]: JsonLike };

function stripNode(node: JsonLike): JsonLike {
  if (Array.isArray(node)) {
    return node.map(stripNode);
  }

  if (!node || typeof node !== 'object') {
    return node;
  }

  const cloned: Record<string, JsonLike> = {};

  for (const [key, value] of Object.entries(node)) {
    cloned[key] = stripNode(value);
  }

  if (
    cloned.type === 'component-block' &&
    cloned.component === 'internalLink' &&
    cloned.props &&
    typeof cloned.props === 'object' &&
    !Array.isArray(cloned.props)
  ) {
    const props = cloned.props as Record<string, JsonLike>;
    const post = props.post;

    if (post && typeof post === 'object' && !Array.isArray(post)) {
      const postObj = post as Record<string, JsonLike>;
      props.post = {
        id: postObj.id ?? null,
        label: postObj.label ?? postObj.title ?? null,
        title: postObj.title ?? postObj.label ?? null,
      };
    }
  }

  if (
    cloned.type === 'relationship' &&
    cloned.data &&
    typeof cloned.data === 'object' &&
    !Array.isArray(cloned.data)
  ) {
    const data = cloned.data as Record<string, JsonLike>;
    cloned.data = {
      id: data.id ?? null,
      label: data.label ?? null,
    };
  }

  return cloned;
}

export default function stripRichTextRelationshipPayloads<T>(document: T): T {
  return stripNode(document as JsonLike) as T;
}
