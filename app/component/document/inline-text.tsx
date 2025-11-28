import { FormattedText } from "@/app/lib/type";
import { maruburi_bold } from "@/app/lib/localfont";

export default function InlineText ({
    text,
}: {
  text: FormattedText;
}) {
  const styles: string[] = [];

  if (text.bold) styles.push(`${maruburi_bold.className} font-bold`);
  if (text.italic) styles.push('italic');
  if (text.underline) styles.push('underline underline-offset-[0.4em] decoration-text-900 decoration-[1px]');
  if (text.strikethrough) styles.push('line-through decoration-text-900 decoration-[1px]');
  if (text.code) styles.push('text-sm font-mono bg-button-100 rounded-sm px-[5px] py-[2px] border border-text-600 mx-1');
  if (text.keyboard) styles.push('text-sm font-mono px-2 py-1');
  if (text.subscript) styles.push('text-[0.7rem] align-0');
  if (text.superscript) styles.push('text-[0.7rem] align-[9px]');
  
  const style = styles.join(' ');

  if (text.code) {
    return (
      <code className={`inline ${style}`}>
        {text.text}
      </code>
    )
  } else if (text.subscript) {
    return (
      <sub className={`inline ${style}`}>
        {text.text}
      </sub>
    )
  } else if (text.superscript) {
    return (
      <sup className={`inline ${style}`}>
        {text.text}
      </sup>
    )
  } else if (text.bold) {
    return (
      <b className={`inline ${style}`}>
        {text.text}
      </b>
    )
  } else if (text.italic) {
    return (
      <i className={`inline ${style}`}>
        {text.text}
      </i>
    )
  } else if (text.underline) {
    return (
      <u className={`inline ${style}`}>
        {text.text}
      </u>
    )
  } else if (text.strikethrough) {
    return (
      <u className={`inline ${style}`}>
        {text.text}
      </u>
    )
  } else if (text.keyboard) {
    return (
      <kbd className={`inline ${style}`}>
        {text.text}
      </kbd>
    )
  } else {
    return (
      <span className={`inline ${style}`}>
        {text.text}
      </span>
    )
  }
}