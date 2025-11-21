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
      onClick={handleTheme}
      className='leading-5 w-auto gap-2 text-text-900 flex items-center justify-center rounded-sm pointer-events-auto'
    >
      <p>테마:</p>
      <div className='w-auto h-auto hover:text-text-700 transition-colors duration-300 '>
        {theme === 'light' ?
          <Moon className='h-4 w-4' /> : <SunMedium className='h-4 w-4' />
        }
      </div>
    </button>
  )
}