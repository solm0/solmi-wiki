import { LayoutNode } from "@/app/lib/type";
import Content from "../content";

export default function LayoutBlock({
  layout,
}: {
  layout: LayoutNode;
}) {
  let den = 0;

  for (let i=0; i<layout.layout.length; i++) {
    den += layout.layout[i];
  }

  return (
    <div className="flex gap-2 md:gap-4">
      {layout.layout.map((num, idx) => (
        <div
          key={idx}
          style={{ width: `${(num / den) * 100}%` }}
        >
          <Content post={layout.children?.[idx].children} />
        </div>
      ))}
    </div>
  )
}