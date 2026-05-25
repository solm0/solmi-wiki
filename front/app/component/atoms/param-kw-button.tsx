'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ParamKwButton({
  keywords,
}: {
  keywords: string[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentKeywords = searchParams.getAll("keyword");
  const [animVersion, setAnimVersion] = useState(0);

  const handleClick = (kw: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (currentKeywords.includes(kw)) {
      const updated = currentKeywords.filter(keyword => keyword !== kw);
      newParams.delete("keyword");
      updated.forEach(keyword => newParams.append("keyword", keyword));
    } else {
      newParams.append("keyword", kw);
    }

    router.push(`${pathname}?${newParams.toString()}`);
    setAnimVersion(v => v + 1);
  }

  return (
    keywords && keywords.map((kw, idx) => (
      <button
        key={kw}
        className={`
          w-auto h-[2.3em] px-[0.8em] text-text-900 font-medium flex items-center rounded-sm transition-colors duration-300 pointer-events-auto opacity-0
          ${currentKeywords.includes(kw) ? "bg-green-500 hover:bg-green-600" : "bg-button-100 hover:bg-button-200"}
          animate-fadeInOnce
        `}
        style={{
          animationDelay: `${idx * 80}ms`,
        }}
        onClick={() => handleClick(kw)}
      >
        {kw}
      </button>
    ))
  )
}