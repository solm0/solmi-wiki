export default function GoToTop({
  title,
}: {
  title: string;
}) {
  const goToTop = () => {
    const page = document.getElementById('note_wrapper');
    if (!page) return;
    console.log(page)

    page.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  
  return (
    <button
      onClick={goToTop}
      className='text-left leading-[1.5em] mb-1 text-xs h-auto w-full pointer-events-auto break-keep hover:text-text-700 transition-all duration-300'
    >
      {title}
    </button>
  )
}