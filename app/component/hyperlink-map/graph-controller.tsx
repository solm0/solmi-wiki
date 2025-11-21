'use client'

import { ChevronLeft, Expand } from 'lucide-react';
import { Post, Graph } from '@/app/lib/type';
import { useState, useEffect } from 'react';
import GraphRenderer from './graph-renderer';
import clsx from 'clsx';
import expandGraphToDepth from '@/app/lib/expand-graph-to-depth';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function ControllerButton({
  role,
  icon,
  onClick,
  depth,
}: {
  role: string,
  icon: React.ReactNode;
  onClick?: () => void;
  depth?: number;
 }) {
  const disabled =
    (role === 'inc' && depth && depth >= 3 ? true : false) ||
    (role === 'dec' && depth && depth <= 1 ? true : false);
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "px-2 py-2 rounded-sm hover:brightness-90 transition-filter duration-300 backdrop-blur-sm",
        disabled ? 'pointer-events-none text-text-600' : 'pointer-events-auto text-text-800',
      )}
    >
      {icon}
    </button>
  )
}

export default function GraphController({
  post,
}: {
  post: Post;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [depth, setDepth] = useState(1);
  const [graph, setGraph] = useState<Graph>({ nodes: [], links: [] });

  const handleDepthChange = async (newDepth: number) => {
    if (!post) return;
    const newGraph: Graph = { nodes: [], links: [] };
    await expandGraphToDepth(post, newDepth, newGraph);
    setGraph(newGraph);
    setDepth(newDepth);
  };

  useEffect(() => {
    if (post) {
      handleDepthChange(depth);
    }
  }, [post]);

  const handleOpenGraph = () => {
    sessionStorage.setItem('prevPath', pathname);
    router.push(`/graph?${searchParams}`);
  }

  return (
    <div className='flex flex-col gap-1 w-full h-auto'>
      <div className="w-80 h-80 border text-text-800 border-text-600 flex items-center justify-center rounded-sm backdrop-blur-2xl bg-background/70">
        <GraphRenderer data={graph} />
      </div>

      <div className="flex w-full justify-between">
        <div className="flex gap-1 items-center">
          <ControllerButton
            role='dec'
            icon={<ChevronLeft className="w-4 h-4" />}
            onClick={() => handleDepthChange(depth - 1)}
            depth={depth}
          />
          <p className="px-2">{depth}</p>
          <ControllerButton
            role='inc'
            icon={<ChevronLeft className="w-4 h-4 -scale-x-100" />}
            onClick={() => handleDepthChange(depth + 1)}
            depth={depth}
          />
        </div>
        <div className="flex gap-1 items-center">
          <ControllerButton
            role='exp'
            icon={<Expand className="w-4 h-4"/>}
            onClick={handleOpenGraph}
          />
        </div>
      </div>
    </div>
  )
}