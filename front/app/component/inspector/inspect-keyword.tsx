'use client'

import ParamKwButton from "../atoms/param-kw-button";
import { useSearchParams } from "next/navigation";
import { KeywordsByTag } from "@/app/lib/type";

export default function InspectKeyword({
  kwByTag
}: {
  kwByTag: KeywordsByTag;
}) {
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());
  const tag = newParams.get("tag");
  const urlKeywords = newParams.getAll("keyword");
  const baseKeywords = tag ? kwByTag[tag] ?? [] : kwByTag['전체'] ?? [];
  const noteKeywords = urlKeywords.filter(kw => !baseKeywords.includes(kw));
  const keywords = [...baseKeywords, ...noteKeywords];

  return (
    <>
      <div className="w-64 flex gap-1 flex-wrap py-1">
        <ParamKwButton keywords={keywords} />
      </div>
    </>
  )
}
