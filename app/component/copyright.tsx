import Link from "next/link"

export default function Copyright() {
  return (
    <div className={`text-sm flex justify-between items-center w-full max-w-[47rem]`}>
      <span>© 2024-2026 정솔미</span>
      <div className="flex gap-3 items-center">
        <Link href='https://github.com/solm0/solmi-wiki' target="_blank" className="hover:opacity-60 transition-opacity duration-300">소스코드</Link>
      </div>
    </div>
  )
}