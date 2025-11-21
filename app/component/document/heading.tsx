import { HeadingNode, FormattedText } from "../../lib/type";
import { slugify } from "../../lib/slugify";
import { maruburi_bold } from "../../lib/localfont";

export default function Headings({
  heading,
  font
}: {
  heading: HeadingNode;
  font: string
}) {
  return (
    <>
      {heading.children.map((child) => {
        const text = (child as FormattedText).text || '';
        const id = slugify(text);

        switch(heading.level) {
          case 2:
            return (
              <h2 key={id} id={id} className={`text-2xl py-4 pt-16 text-text-950 ${font === 'serif' ? maruburi_bold.className : 'font-medium'}`}>
                {text}
              </h2>
            )
          case 3: 
            return (
              <h3 key={id} id={id} className={`text-xl py-4 pt-16 text-text-950 ${font === 'serif' ? maruburi_bold.className : 'font-medium'}`}>
                {text}
              </h3>
            )
          case 4:
            return (
              <h4 key={id} id={id} className={`text-base py-4`} >
                {text}
              </h4>
            )
        }
      })}
    </>
  )
  
}