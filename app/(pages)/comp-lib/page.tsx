import ToolBox from "@/app/component/hyperlink-map/ToolBox";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "컴포넌트 라이브러리",
  description: "컴포넌트 라이브러리",
};

export default function CompLibPage() {
  const pathNames = ['book', 'chron-post-list', 'continuous-post-nav', 'cpnia-buttons', 'cpnia-logotype', 'cpnia-player', 'floor-plan', 'go-to-top', 'image-scroll-scale', 'network-graph', 'keyword-cmp', 'search-cmp', 'tag-cmp', 'sequence-nav','solmi-wiki-2-colors','solmi-wiki-2-typography','toc']
  function toCamelCase(str: string) {
    return str
      .split('-')
      .map(part =>
        part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join('');
  }

  const compName = pathNames.map(toCamelCase);

  return (
    <>
      <div className="w-full h-full flex flex-wrap overflow-y-scroll">
        {pathNames.map((comp, i) => 
          <div key={i} className="relative w-96 flex-1 h-1/3 flex items-center justify-center">
            <iframe
              src={`https://lib-comp-teal.vercel.app/${comp}`}
              className="w-96 h-full shrink-0"
            />
            <Link
              href={`https://github.com/solm0/lib-comp/blob/main/app/components/${compName[i]}.tsx`}
              target="_blank"
              className="absolute bottom-0 left-0 px-3 text-text-900 bg-background hover:text-text-700 transition-colors duration-300"
            >
              {comp}
            </Link>
          </div>
        )}
      </div>

      {/* 오른쪽 사이드바 */}
      <ToolBox />
    </>
  )
}