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
import { usePlaceList } from "../lib/zustand/usePlaceList";
import CmpPreview from "./document/CmpPreview";

function ContentItem({
  document, idx,
  placesData
}:{
  document: RichTextNode;
  idx: number;
  placesData?: Place[];
}) {
  switch (document.type) {
    case 'heading':
      return (
        <Headings heading={document} />
      )
    case 'paragraph':
      return (
        <div className="py-3">
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
          const placeId = document.children?.[0].children?.[0].text;
          return (
            <PlacePlaceholder placeId={placeId} places={placesData}/>
          )
        case 'footnote':
          return (
            <FootNote text={document.children?.[0].children?.[0].text} link={document.children?.[1].children?.[0].text} />
          )
        case 'componentPreview':
          return (
            <CmpPreview cmpName={document.children?.[0].children?.[0].text} />
          )
      }
  }
}

export default function Content({
  post, places
}: {
  post: RichTextNode[];
  places?: Place[];
}) {
  const setGlobalPlaces = usePlaceList(s => s.setPlaces);
  let accumulated: Place[] = [];

  return (
    <>
      {post?.map((document, idx) => {
        let placesDataForThisNode = accumulated; // 이전까지 누적된 배열

        if (
          document.type === "component-block" &&
          document.component === "place"
        ) {
          const placeId = document.children?.[0]?.children?.[0]?.text;
          const placeObj = places?.find((p) => p.id === placeId);

          if (placeObj) {
            accumulated = [...accumulated, placeObj];
            placesDataForThisNode = accumulated; // 자기 자신까지 포함
            setGlobalPlaces(accumulated);
          }
        }

        return (
          <div
            key={idx}
            className={
              document.type === 'component-block' && document.component === 'carousel'
                ? 'w-full'
                : 'max-w-[47em]'
            }
          >
            <ContentItem
              document={document}
              idx={idx}
              placesData={placesDataForThisNode} // 순서대로 된 places
            />
          </div>
        )
      })}
    </>
  )
}