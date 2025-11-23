'use client'

import { useToggleStore } from '@/app/lib/zustand/useToggleStore';
import { useEffect } from 'react';

export default function EnableButton({
  value,
}: {
  value: { value: string, name: React.ReactNode };
}) {
  const initializeToggles = useToggleStore((s) => s.initializeToggles);
  const setIsOpen = useToggleStore((s) => s.setToggle);

  useEffect(() => {
    initializeToggles();
  }, [initializeToggles]);

  const isEnabled = useToggleStore((s) => s.toggles[value.value])

  const handleClick = () => {
    setIsOpen(value.value, !isEnabled);
  };

  return (
    <div
      className={`${isEnabled ? `text-green-500`: `text-text-900`} w-8 h-8 flex items-center justify-center rounded-sm transition-colors duration-300 pointer-events-auto hover:bg-button-100`}
      onClick={handleClick}
    >
      {value.name}
    </div>
  )
}