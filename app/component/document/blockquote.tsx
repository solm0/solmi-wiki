import { BlockquoteNode } from "@/app/lib/type";
import Paragraph from "./paragraph";

export default function Blockquote({
  quote,
}: {
  quote: BlockquoteNode;
}) {
  return (
    <blockquote className="text-sm leading-[1.75em] border-l-3 border-button-100 px-3 my-3 py-1 text-text-800 flex flex-col gap-[1.2em] max-w-[40em] ml-7">
      {quote.children.map((child, idx) => (
        <Paragraph key={idx} p={child} />
      ))}
    </blockquote>
  )
}