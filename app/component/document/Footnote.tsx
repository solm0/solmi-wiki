export default function FootNote({text, link}: {text:string; link: string}) {
  return (
    <p className="leading-[1.3em] pb-7 text-text-800 pl-14">
      <span>*</span>
      <span className="text-xs pl-1">{text}</span>
      <a
        href={link}
        target="_blank"
        className="text-xs pl-1 underline underline-offset-[0.4em] decoration-text-800 decoration-[1px] hover:text-text-700 hover:decoration-text-700 hover:cursor-ne-resize transition-colors duration-300"
      >
        {link}
      </a>
    </p>
  )
}