import dynamic from "next/dynamic";
import { Graph } from "../../lib/type";
import { useRef } from "react";

export default function GraphRenderer({
  data
}: {
  data: Graph | undefined;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);
  if (data === undefined) return (<div>no graph</div>);
  const DynamicLocalGraph = dynamic(() => import('./graph-local'), {ssr: false});

  return (
    <div ref={divRef} className="w-full aspect-square relative overflow-hidden">
      <DynamicLocalGraph graphData={data} divRef={divRef} />
    </div>
  );
}