export default function NotFoundPage() {
  return (
    <section className="relative flex flex-col items-start gap-8 w-full text-text-800 pt-[40vh] pb-8 overflow-y-scroll focus:outline-hidden custom-scrollbar">
      <p className="font-bold text-4xl">404 Not Found</p>
      <p>이상한 url을 치신 듯?</p>
      <a href="/" className="w-auto h-8 text-text-900 px-3 flex items-center rounded-sm transition-colors duration-300 pointer-events-auto bg-button-100 hover:bg-button-200">홈으로</a>
    </section>
  )
}