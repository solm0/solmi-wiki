'use client'

import { InternalLinkComponentNode, InternalLinkNode } from "@/app/lib/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useHoveredLink } from "@/app/lib/zustand/useHoveredLink";

export default function InlineInternalLink({
  internalLink,
  internalLinkComponent,
}: {
  internalLink?: InternalLinkNode;
  internalLinkComponent?: InternalLinkComponentNode;
}) {
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const setHoveredId = useHoveredLink((state) => state.setId);

  if (internalLink) {
    return (
      <span>
        <Link
          href={`${internalLink.id}/?${newParams}`}
          target="_self"
          className="inline underline underline-offset-6 decoration-text-900 decoration-[1px] hover:text-text-700 hover:decoration-text-700 hover:cursor-ne-resize transition-colors duration-300"
          onMouseEnter={() => setHoveredId(internalLink.children?.[0].title || null, internalLink.id || null, true)}
          onMouseLeave={() => setHoveredId(null, null)}
          onClick={() => setHoveredId(null, null)}
          style={{ display: 'inline' }}
        >
          {internalLink.children?.[0].text}
        </Link>
      </span>
    )
  } else if (internalLinkComponent) {
    return (
      <span>
        <Link
          href={`${internalLinkComponent.props.post.id}/?${newParams}`}
          target="_self"
          className="inline underline underline-offset-6 decoration-text-900 decoration-[1px] hover:text-text-700 hover:decoration-text-700 hover:cursor-ne-resize transition-colors duration-300"
          onMouseEnter={() => setHoveredId(internalLinkComponent.props.post.label || null, internalLinkComponent.props.post.id || null, true)}
          onMouseLeave={() => setHoveredId(null, null)}
          onClick={() => setHoveredId(null, null)}
          style={{ display: 'inline' }}
        >
          {internalLinkComponent.children?.[0].children?.[0].text}
        </Link>
      </span>
    )
  }
}