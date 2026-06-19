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
    <div className={`text-sm flex justify-between items-center w-full max-w-[47rem] text-text-700`}>
      <div className="flex gap-2 items-center">
        <span>© 2024-2026 정솔미</span>
        <Link href={'/cmdc93ok7008imdam853f86o2'} className="hover:text-text-800 transition-colors">Changelog</Link>
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
  )
}
