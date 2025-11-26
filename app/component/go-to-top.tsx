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
    <div className="h-auto w-full flex items-center gap-4 mb-1">
      <button
        onClick={goToTop}
        className='text-xs h-auto w-auto rounded-sm items-center pointer-events-auto break-keep hover:text-text-700 transition-all duration-300'
      >
        {title}
      </button>
    </div>
  )
}