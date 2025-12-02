import { OrderedListNode } from "@/app/lib/type"
import Paragraph from "./paragraph";

export default function Ol({
  ol,
}: {
  ol: OrderedListNode
}) {
  return (
    <ol className="list-decimal pl-4 flex flex-col gap-2">
      {ol.children.map((child, idx) => (
        <li key={idx} className="leading-[1.7em]">
          {child.children.map((ch, idx) => {
            if (ch.type === 'list-item-content') {
              return (
                <Paragraph key={idx} p={ch} />
              );
            } else {
              return (
                <div key={idx} className="pl-7 pt-2">
                  <Ol ol={ch as OrderedListNode} />
                </div>
              )
            }
          })}
        </li>
      ))}
    </ol>
  )
}