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
        <li key={idx} className="flex flex-col leading-[1.7em]">
          {child.children.map((ch, idx) => {
            if (ch.type === 'list-item-content') {
              return (
                <div key={idx} className="flex items-start">
                  <div className="shrink-0 w-[4px] h-[4px] mt-[0.7em] mr-[0.7em] bg-text-900 rounded-full inline" />
                  <Paragraph p={ch} />
                </div>
              );
            } else {
              return (
                <div key={idx} className="pl-7 pt-2">
                  <Ul ul={ch as UnorderedListNode} />
                </div>
              )
            }
          })}
        </li>
      ))}
    </ul>
  )
}