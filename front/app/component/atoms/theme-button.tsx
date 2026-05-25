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
    <div
      className='leading-5 w-auto gap-2 text-text-900 flex items-center justify-center rounded-sm pointer-events-auto'
    >
      <label htmlFor='theme-button'>테마:</label>
      <button
        className='w-auto h-auto hover:text-text-700 transition-colors duration-300'
        onClick={handleTheme}
        id='theme-button'
      >
        {theme === 'dark' ?
          <Moon className='h-3.5 w-3.5' /> : <SunMedium className='h-3.5 w-3.5' />
        }
      </button>
    </div>
  )
}