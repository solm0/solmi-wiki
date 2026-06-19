'use client'

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, SunMedium } from 'lucide-react';

export default function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleTheme = () => {
    if (theme === 'light') {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  return (
    <button
      className='flex h-8 w-8 items-center justify-center rounded-sm text-text-900 pointer-events-auto transition-colors duration-300 hover:text-text-700 z-10'
      onClick={handleTheme}
      id='theme-button'
      title='테마 전환'
      type='button'
    >
      {theme === 'dark'
        ? <Moon className='w-4 h-4 md:w-3.5 md:h-3.5' />
        : <SunMedium className='w-4 h-4 md:w-3.5 md:h-3.5' />
      }
    </button>
  )
}
