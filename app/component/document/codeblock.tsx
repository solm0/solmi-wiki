import { CodeBlockNode, FormattedText, ParagraphNode } from "@/app/lib/type";
import { pretendard } from "@/app/lib/localfont";
import highlighter from "@/app/lib/code-highlighter";

export default function CodeBlock({
  codeblock,
}: {
  codeblock: CodeBlockNode;
}) {
  const caption = (codeblock.children?.filter(ch => ch.type === 'component-inline-prop')?.[0].children?.[0] as FormattedText)?.text;
  const code = codeblock.children?.filter(ch => ch.type === 'component-block-prop')?.[0].children as ParagraphNode[];

  return (
    <figure className="flex flex-col gap-1 py-4">
      {caption && <figcaption className={`${pretendard.className} text-sm text-text-700`}>{caption}</figcaption>}

      <pre className="h-auto bg-button-100 text-sm rounded-sm font-mono p-4 selection:bg-background! overflow-x-auto flex flex-col">
        {code.map((child, idx) => (
          <code
            key={idx}
            className="text-text-900"
            dangerouslySetInnerHTML={{ __html: highlighter((child.children?.[0] as FormattedText).text) }}
          />
        ))}
      </pre>
    </figure>
  )
}