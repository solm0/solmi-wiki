'use client'

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';


export default function Giscus() {
  const { theme } = useTheme();
  const giscusTheme = theme === 'light' ? 'noborder_light' : 'noborder_dark'
  const commentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'solm0/solmi-wiki');
    script.setAttribute('data-repo-id', 'R_kgDOO7JeOQ');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDOO7JeOc4Cr__s');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', giscusTheme);
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    if (commentRef.current) {
      commentRef.current.innerHTML = '';
      commentRef.current.appendChild(script);
    }
  }, [giscusTheme]);

  return <div className='min-h-96' ref={commentRef} />;
}