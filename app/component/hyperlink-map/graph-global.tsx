'use client'

import ForceGraph2D from 'react-force-graph-2d';
import { NodeObject, LinkObject, GraphData } from 'react-force-graph-2d';
import { Graph, Node, Post } from '@/app/lib/type';
import { useHoveredLink } from '@/app/lib/zustand/useHoveredLink';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function GlobalGraph({
  graphData,
  filteredData,
}: {
  graphData: Graph;
  filteredData: Post[];
}) {
  const [colors, setColors] = useState<{nodeGreen: string, text950: string, text800: string, text700: string, text600: string, bg: string}>({
    nodeGreen: '#FFFFFF',
    text950: '#000000',
    text800: '#000000',
    text700: '#000000',
    text600: '#000000',
    bg: '#000000'
  })
  useEffect(() => {
    const nodeGreen = getComputedStyle(document.documentElement)
      .getPropertyValue('--node')
      .trim();
    const text950 = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-950')
      .trim();
    const text800 = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-800')
      .trim();
    const text700 = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-700')
      .trim();
    const text600 = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-600')
      .trim();
    const bg = getComputedStyle(document.documentElement)
      .getPropertyValue('--background')
      .trim();
    if (nodeGreen && text800 && text700) setColors({nodeGreen: nodeGreen, text950: text950, text800: text800, text700: text700, text600: text600, bg: bg});
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [depth1Nodes, setDepth1Nodes] = useState(new Set());

  const setHoveredNode = useHoveredLink((state) => state.setId);
  const hoveredId = useHoveredLink((state) => state.id);
  const handleNodeHover = (node: NodeObject<Node> | null) => {
    if (node) {
      setHoveredNode(node.title, node.id, false);
      
      const neighbors = new Set();

      graphData.links?.forEach((link: LinkObject) => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;

        if (sourceId === node.id) {
          neighbors.add(targetId);
        } else if (targetId === node.id) {
          neighbors.add(sourceId);
        }
      });

      setDepth1Nodes(neighbors);
      console.log('hovered:', hoveredId)
    } else {
      setDepth1Nodes(new Set());
      setHoveredNode(null, null);
      console.log('not hovered:', hoveredId)
    }
  }
  useEffect(() => {
    setHoveredNode(null, null)
  }, [graphData])
  const handleNodeClick = (node: NodeObject<Node> | null) => {
    if (node) {
      const newParams = new URLSearchParams(searchParams.toString());
      router.push(`/${node.id}?${newParams.toString()}`);
    }
  }

  const filteredNodes = new Set(filteredData?.map(post => post.id));

  return (
    <ForceGraph2D
      graphData={graphData as GraphData<NodeObject<Node>, LinkObject<Node>>}
      width={1600}
      height={1000}
      onNodeHover={handleNodeHover}
      onNodeClick={handleNodeClick}
      minZoom={2}
      maxZoom={6}
      nodeRelSize={4}
      // nodeVal={(node) => node.depth === 0 ? 3 : 1}
      // nodeColor={() => colors.nodeGreen}
      // linkWidth={1}
      // linkDirectionalArrowLength={5}
      // linkDirectionalArrowRelPos={1}
      // linkCurvature={1}

      d3AlphaDecay={0.08} // 0.0228
      d3AlphaMin={0} // 0
      d3VelocityDecay={0.2} // 0.4
      enableZoomInteraction={true}
      enablePanInteraction={true}
      linkDirectionalParticles={1}
      linkDirectionalParticleColor={() => colors.text600}
      linkDirectionalParticleWidth={3}
      linkDirectionalParticleSpeed={0.005}

      nodeCanvasObject={(node, ctx, globalScale) => {
        const size = Math.sqrt(node.val ?? 1) * 2;

        if (filteredNodes.has(node.id)) {
          if (hoveredId) {
            if (node.id === hoveredId) {
              ctx.fillStyle = colors.nodeGreen;
            } else if (depth1Nodes.has(node.id)) {
              ctx.fillStyle = colors.text800;
            } else {
              ctx.fillStyle = colors.text600;
            }
          } else {
            ctx.fillStyle = colors.nodeGreen;
          }
        } else {
          ctx.fillStyle = colors.text600;
        }
        
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI, false);
        ctx.fill();

        function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
          const words = text.split(' ');
          let line = '';
          const lines: string[] = [];
          
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
              lines.push(line);
              line = words[n] + ' ';
            } else {
              line = testLine;
            }
          }
          lines.push(line);
        
          lines.forEach((l, i) => {
            ctx.fillText(l.trim(), x, y + i * lineHeight);
          });
        }

        if (filteredNodes.has(node.id)) {
          if (hoveredId) {
            if (node.id === hoveredId || depth1Nodes.has(node.id)) {
              ctx.fillStyle = colors.text950;
            } else {
              ctx.fillStyle = colors.text600;
            }
          } else {
            ctx.fillStyle = colors.text600;
          }
        } else {
          ctx.fillStyle = colors.text600;
        }

        const fontSize = 14 / globalScale;
        ctx.font = `${fontSize}px Pretendard, sans-serif`
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        wrapText(ctx, node.title.slice(0, 50)+'…', node.x!, node.y!+8, 50, 17 / globalScale);
      }}
      
      linkCanvasObject={(link, ctx, globalScale) => {
        ctx.lineWidth = 0.8 / globalScale;

        const sourceId = typeof link.source === 'object' ? link.source.id : '';
        const targetId = typeof link.target === 'object' ? link.target.id : '';

        if (filteredNodes.has(sourceId) && filteredNodes.has(targetId)) {
          if (hoveredId) {
            const isDirectlyConnected = sourceId === hoveredId || targetId === hoveredId;
  
            if (isDirectlyConnected) {
              ctx.strokeStyle = colors.text800;
            } else {
              ctx.strokeStyle = colors.text600;
            }
          } else {
            ctx.strokeStyle = colors.text800;
          }
        } else {
          ctx.strokeStyle = colors.text600;
        }

        ctx.beginPath();
        // 타입스크립트 이놈자식
        const sourceX = typeof link.source === 'object' ? link.source.x : 0;
        const sourceY = typeof link.source === 'object' ? link.source.y : 0;
        const targetX = typeof link.target === 'object' ? link.target.x : 0;
        const targetY = typeof link.target === 'object' ? link.target.y : 0;
        ctx.moveTo(sourceX!, sourceY!);
        ctx.lineTo(targetX!, targetY!);
        ctx.stroke();
      }}
    />
  )
}