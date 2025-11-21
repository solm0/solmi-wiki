'use client'

import { useState } from "react";
import clsx from 'clsx';
import { useIsSettingOpen } from "@/app/lib/use-is-setting-open";
import { useEffect } from "react";

export default function ExpandButton({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string | React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    const newOpen = !isOpen;
    setIsOpen(newOpen);
  }

  const setIsSettingOpen = useIsSettingOpen((state) => state.setValue);
  useEffect(() => {
    if (typeof(name) !== "string") {
      setIsSettingOpen(isOpen)
    }
  }, [isOpen])

  return (
    <div className="flex flex-col gap-1 w-auto items-end">

      {/* 버튼 */}
      <button
        onClick={handleClick}
        className={`${isOpen ? `text-green-500`: `text-text-900`} w-8 h-8 flex items-center justify-center rounded-sm transition-colors duration-300 pointer-events-auto hover:bg-button-100`}
      >
        {name}
      </button>

      {/* 창 */}
      <div className={clsx(
        "bg-button-100 h-auto w-40 flex flex-col p-3 mt-2 items-start gap-1 overflow-clip transition-all rounded-sm text-sm",
        isOpen ? "max-h-96" : "opacity-0 max-h-0"
      )}>
        {children}
      </div>
    </div>
  )
}