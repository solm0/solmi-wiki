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
    <div className="flex flex-col md:flex-row max-w-[47em] gap-7 md:gap-0">
      {layout.layout.map((num, idx) => (
        <div
          key={idx}
          className="w-full md:w-[var(--layout-width)]"
          style={{ ["--layout-width" as string]: `${(num / den) * 100}%` }}
        >
          <Content post={layout.children?.[idx].children} />
        </div>
      ))}
    </div>
  )
}
