import { LinkNode } from "@/app/lib/type";
import Link from "next/link";
import InlineText from "./inline-text";

export default function InlineLink({
  link,
}: {
  link: LinkNode;
}) {
  return (
    <span>
      <Link
        href={link.href || ''}
        target="_blank"
        className="underline underline-offset-[0.4em] decoration-text-900 decoration-[1px] hover:text-text-700 hover:decoration-text-700 transition-colors duration-300"
      >
        {link.children?.map((child, idx) => 
          <InlineText key={idx} text={child} />
        )}
        <span> ↗</span>
      </Link>
    </span>
  )
}