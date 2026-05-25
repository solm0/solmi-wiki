// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { RichTextNode } from "./type";

export function mergeInlineInternalLinks(doc: RichTextNode[]): RichTextNode[] {
  if (!Array.isArray(doc)) return doc;

  const newDoc: RichTextNode[] = [];
  let i = 0;

  while (i < doc.length) {
    const curr = doc[i];

    // Only start merging if current node is a paragraph
    if (curr.type !== 'paragraph' && curr.children?.[0].type) {
      newDoc.push(curr);
      i++;
      continue;
    }

    // Clone the children to build a potential merged paragraph
    const mergedChildren = [...curr.children];
    let merged = false;
    let j = i + 1;

    // Absorb following internalLink component-blocks and optionally one paragraph
    while (j < doc.length) {
      const node = doc[j];

      if (node.type === 'component-block' && node.component === 'internalLink') {
        const aliasNode = node.children?.[0]?.children?.[0];
        const post = node.props?.post;

        const text = aliasNode?.text || post?.label || post?.title || '링크';
        const title = post?.label || post?.title || '';
        const id = post?.id;

        if (id) {
          mergedChildren.push({
            type: 'internal-link',
            id,
            children: [{ text, title }],
          });
        }

        merged = true;
        j++;
      } else if (node.type === 'paragraph' && doc[j - 1]?.type === 'component-block' && doc[j - 1]?.component === 'internalLink') {
        // Absorb this paragraph ONLY if it's directly after a component-block
        mergedChildren.push(...node.children);
        j++;
      } else {
        break;
      }
    }

    // Push merged paragraph or original
    newDoc.push({
      ...curr,
      children: mergedChildren,
    });

    // Move i forward to next unprocessed node
    i = merged ? j : i + 1;
  }

  return newDoc;
}