import { HeadingNode, FormattedText } from "../../lib/type";
import { slugify } from "../../lib/slugify";
import { maruburi_bold } from "../../lib/localfont";

export default function Headings({
  heading,
}: {
  heading: HeadingNode;
}) {
  return (
    <>
      {heading.children.map((child) => {
        const text = (child as FormattedText).text || '';
        const id = slugify(text);

        switch(heading.level) {
          case 2:
            return (
              <h2 key={id} id={id} className={`text-3xl pt-16 pb-3 text-text-950 transition-all duration-1000 rounded-sm origin-bottom-left ${maruburi_bold.className}`}>
                {text}
              </h2>
            )
          case 3: 
            return (
              <h3 key={id} id={id} className={`text-2xl pt-14 pb-3 text-text-950 transition-all duration-1000 rounded-sm origin-left ${maruburi_bold.className}`}>
                {text}
              </h3>
            )
          case 4:
            return (
              <h4 key={id} id={id} className={`text-xl pt-8 pb-3 ${maruburi_bold.className}`} >
                {text}
              </h4>
            )
        }
      })}
    </>
  )
  
}