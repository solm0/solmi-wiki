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

export default function Content({
  post, font, places
}: {
  post: RichTextNode[];
  font?: string;
  places?: Place[];
}) {
  return (
    <div>
      {
        post?.map((document, idx) => {
          switch (document.type) {
            case 'heading':
              return (
                <Headings key={idx} heading={document} font={font ?? 'serif'} />
              )
            case 'paragraph':
              return (
                <div key={idx} className="py-4">
                  <Paragraph p={document} />
                </div>
              );
            case 'unordered-list':
              return (
                <Ul key={idx} ul={document} />
              )
            case 'ordered-list':
              return (
                <Ol key={idx} ol={document} />
              )
            case 'divider':
              return (
                <hr key={idx} className="border-t text-text-600" />
              )
            case 'blockquote':
              return (
                <Blockquote key={idx} quote={document} />
              )
            case 'layout':
              return (
                <LayoutBlock key={idx} layout={document} />
              )
            case 'component-block':
              switch (document.component) {
                case 'internalLink': 
                  return (
                    <InlineInternalLink key={idx} internalLinkComponent={document} />
                  )
                case 'codeBlock':
                  return (
                    <CodeBlock key={idx} codeblock={document} />
                  )
                case 'notice':
                  return (
                    <Notice key={idx} notice={document} />
                  )
                case 'quote':
                  return (
                    <Quote key={idx} quote={document} />
                  )
                case 'carousel':
                  return (
                    <Carousel key={idx} carIdx={idx} carousel={document} />
                  )
                case 'iframe':
                  return (
                    <Iframe key={idx} src={document.children?.[0].children?.[0].text} />
                  )
                case 'place':
                  return (
                    <PlacePlaceholder key={idx} placeId={document.children?.[0].children?.[0].text} places={places}/>
                  )
                case 'footnote':
                  return (
                    <FootNote key={idx} text={document.children?.[0].children?.[0].text} link={document.children?.[1].children?.[0].text} />
                  )
              }
          }
        })
      }
    </div>
  )
}