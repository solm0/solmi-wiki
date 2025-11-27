import { Place, RichTextNode } from "../lib/type"
import Headings from "./document/heading";
import Paragraph from "./document/paragraph";
import Ul from "./document/ul";
import Ol from "./document/ol";
import Blockquote from "./document/blockquote";
import LayoutBlock from "./document/layout-block";
import CodeBlock from "./document/codeblock";
import Notice from "./document/notice";
import Quote from "./document/quote";
import InlineInternalLink from "./document/inline-internallink";
import Carousel from "./document/carousel";
import Iframe from "./document/iframe";
import PlacePlaceholder from "./document/PlacePlaceholder";
import FootNote from "./document/Footnote";

function ContentItem({
  document, idx, font, places
}:{
  document: RichTextNode;
  idx: number;
  font?: string;
  places?: Place[];
}) {
  switch (document.type) {
    case 'heading':
      return (
        <Headings heading={document} font={font ?? 'serif'} />
      )
    case 'paragraph':
      return (
        <div className="py-4">
          <Paragraph p={document} />
        </div>
      );
    case 'unordered-list':
      return (
        <Ul ul={document} />
      )
    case 'ordered-list':
      return (
        <Ol ol={document} />
      )
    case 'divider':
      return (
        <hr className="border-t text-text-600" />
      )
    case 'blockquote':
      return (
        <Blockquote quote={document} />
      )
    case 'layout':
      return (
        <LayoutBlock layout={document} />
      )
    case 'component-block':
      switch (document.component) {
        case 'internalLink': 
          return (
            <InlineInternalLink internalLinkComponent={document} />
          )
        case 'codeBlock':
          return (
            <CodeBlock codeblock={document} />
          )
        case 'notice':
          return (
            <Notice notice={document} />
          )
        case 'quote':
          return (
            <Quote quote={document} />
          )
        case 'carousel':
          return (
            <Carousel carIdx={idx} carousel={document} />
          )
        case 'iframe':
          return (
            <Iframe src={document.children?.[0].children?.[0].text} />
          )
        case 'place':
          return (
            <PlacePlaceholder placeId={document.children?.[0].children?.[0].text} places={places}/>
          )
        case 'footnote':
          return (
            <FootNote text={document.children?.[0].children?.[0].text} link={document.children?.[1].children?.[0].text} />
          )
      }
  }
}

export default function Content({
  post, font, places
}: {
  post: RichTextNode[];
  font?: string;
  places?: Place[];
}) {
  return (
    <>
      {post?.map((document, idx) => 
        <div
          key={idx}
          className={
            document.type === 'component-block' && document.component === 'carousel'
              ? 'w-full'
              : font === 'sans'
                ? 'max-w-[43em]'
                : 'max-w-[47em]'
          }
        >
          <ContentItem
            document={document}
            idx={idx}
            font={font}
            places={places}
          />
        </div>
      )}
    </>
  )
}