'use client'

import Link from "next/link";
import { EmailIcon, GitHubIcon, InstagramIcon } from "./atoms/social-icons";

export default function Copyright() {
  const iconButtons = [
    { label: "instagram", icon: <InstagramIcon className="w-[1.1em] h-[1.1em]" />, link: 'https://www.instagram.com/solmi.wiki/' },
    { label: "github", icon: <GitHubIcon className="w-[1.1em] h-[1.1em]" />, link: 'https://github.com/solm0' },
    { label: "email", icon: <EmailIcon className="w-[1.1em] h-[1.1em] pb-px" />, link: 'mailto:solmii.jeong@gmail.com' },
  ];

  return (
    <div className="text-sm flex flex-col w-full max-w-[47rem] text-text-800/60 gap-3">
      {/* 1층 */}
      <div className="flex w-full justify-between items-center">
        <div className="flex gap-2 items-center text-text-700">
          <span>© 2024-2026 정솔미</span>
        </div>
        <div className="flex gap-3 items-center">
          {iconButtons.map(({ label, icon, link }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="flex items-center justify-center text-current hover:text-text-800 transition-colors"
              onClick={() => window.open(link, "_blank", "noopener,noreferrer")}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* 2층 */}
      <div className="flex w-full gap-8 items-center relative">
        <Link href={'/cmdc93ok7008imdam853f86o2'} className="hover:text-text-800 transition-colors">여긴 뭐하는 곳인가요?</Link>
        <nav className="flex gap-1 absolute left-1/2 -translate-x-1/2">
          <Link href="https://iwfederation.pages.dev?site=solmi&go=prev" className="hover:text-text-800 transition-colors">{`<-`}</Link><br />
          <Link href="https://iwfederation.pages.dev/" className="hover:text-text-800 transition-colors">독립웹연맹</Link><br />
          <Link href="https://iwfederation.pages.dev?site=solmi&go=next" className="hover:text-text-800 transition-colors">{`->`}</Link>
        </nav>
      </div>
    </div>
  )
}
