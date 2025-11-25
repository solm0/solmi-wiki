import dynamic from "next/dynamic";
import { Graph } from "../../lib/type";

export default function GraphRenderer({
  data
}: {
  data: Graph | undefined;
}) {
  if (data === undefined) return (<div>no graph</div>);
  const DynamicLocalGraph = dynamic(() => import('./graph-local'), {ssr: false});

  return <DynamicLocalGraph graphData={data} />;
}