import { ParagraphNode, LinkNode, FormattedText, InternalLinkNode } from "@/app/lib/type";
import InlineLink from "./inline-link";
import InlineText from "./inline-text";
import InlineInternalLink from "./inline-internallink";

export default function Paragraph({
  p,
}: {
  p: ParagraphNode;
}) {
  const styles: string[] = [];

  if (p.textAlign === 'start') styles.push('text-left');
  if (p.textAlign === 'center') styles.push('text-center');
  if (p.textAlign === 'end') styles.push('text-right');

  const style = styles.join(' ');

  return (
    <p className={`${style}`}>
      {p.children.map((child, idx) => {
        if (child.type === 'link') {
          return (
            <InlineLink key={idx} link={child as LinkNode} />
          )
        } else if (child.type === 'internal-link') {
            return (
              <InlineInternalLink key={idx} internalLink={child as InternalLinkNode} />
            )
        } else if (child.type === undefined) {
          return (
            <InlineText key={idx} text={child as FormattedText} />
          )
        }
      })}
    </p>
  )
}