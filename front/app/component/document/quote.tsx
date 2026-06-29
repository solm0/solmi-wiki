import { QuoteNode, FormattedText, ParagraphNode } from "@/app/lib/type";
import Paragraph from "./paragraph";

export default function Quote({
  quote,
}: {
  quote: QuoteNode;
}) {
  const attr = (quote.children?.filter(ch => ch.type === 'component-inline-prop')?.[0].children?.[0] as FormattedText)?.text;
  const text = quote.children?.filter(ch => ch.type === 'component-block-prop')?.[0].children as ParagraphNode[];

  return (
    <blockquote className="border-l-3 border-text-600 px-3 md:px-4 py-1 my-3 text-text-800 flex flex-col gap-1">
      {text.map((t, idx) => (
        <Paragraph key={idx} p={t} />
      ))}
      {attr &&
        <div className="flex">
          <span className={`text-text-700`}>{attr}</span>
        </div>
      }
    </blockquote>
  )
}