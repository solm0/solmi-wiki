import { ArrowUpToLine } from "lucide-react";

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
    <div className="h-8 w-full flex items-center gap-4">
      <div className='text-sm h-8 w-auto rounded-sm items-center pointer-events-auto hidden md:flex'>
        {title}
      </div>

      <button
        onClick={goToTop}
        className="h-6 w-6 rounded-sm flex justify-center items-center hover:text-text-700 transition-all duration-300 pointer-events-auto"
      >
        <ArrowUpToLine className="w-4 h-4" />
      </button>
    </div>
  )
}