import { UnorderedListNode } from "@/app/lib/type"
import Paragraph from "./paragraph";

export default function Ul({
  ul,
}: {
  ul: UnorderedListNode
}) {
  return (
    <ul className="list-none flex flex-col gap-2">
      {ul.children.map((child, idx) => (
        <li key={idx} className="flex items-start leading-[1.7em]">
          <div className="shrink-0 w-[4px] h-[4px] mt-[0.7em] mr-[0.7em] bg-text-900 rounded-full inline" />
          {child.children.map((ch, idx) => {
            if (ch.type === 'list-item-content') {
              return (
                <Paragraph key={idx} p={ch} />
              );
            } else {
              return (
                <Ul key={idx} ul={ch as UnorderedListNode} />
              )
            }
          })}
        </li>
      ))}
    </ul>
  )
}