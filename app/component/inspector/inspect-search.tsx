'use client'

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter } from 'next/navigation';
import clsx from "clsx";

export default function InspectSearch() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState('');

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(window.location.search);

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 100);

  const handleClear = () => {
    setValue("");
    handleSearch("");
  };

  return (
    <div
      id="search-input"
      className="h-auto w-full flex flex-col gap-1 pointer-events-auto"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const term = e.target.value;
          setValue(term);
          handleSearch(term);
        }}
        className="h-8 bg-transparent focus:outline-none placeholder-text-700 text-text-900 font-medium pr-8"
        placeholder="문자열을 입력하세요."
        spellCheck="false"
      />
      <div
        className={clsx(
          "w-auto transition-all duration-300 self-start overflow-clip",
          value ? 'h-8' : 'h-0'
        )}
      >
        <button
          onClick={handleClear}
          className={clsx(
            "w-auto h-[2.3em] bg-button-100 text-text-900 px-[0.8em] flex items-center rounded-sm hover:bg-button-200 transition-[opacity] duration-300 delay-200 text-xs",
            value ? 'opacity-100' : 'opacity-0'
          )}
        >
          지우기
        </button>
      </div>
    </div>
  )
}