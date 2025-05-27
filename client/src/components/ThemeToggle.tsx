'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiSun, FiMoon,  } from 'react-icons/fi';
import { BsFillMoonStarsFill } from "react-icons/bs";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme(); // Use next-themes for theme management, theres are destructured from useTheme, they are NOt local state variables

  // Avoid hydration mismatch
  useEffect(() => {

    setMounted(true);
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
      // document.documentElement.classList.toggle('dark', stored === 'dark'); // not needed with next-themes
    }
  }, []);

  const themeObject = useTheme();
  const buttonStyles =
    themeObject.theme === 'dark'
      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
      : 'bg-white test-bold text-gray-700 hover:bg-gray-300 ';


  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    // document.documentElement.classList.toggle('dark', newTheme === 'dark'); // not needed with next-themes
  };

  

  return (
    <button onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors duration-200 ${buttonStyles}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <FiSun className="w-5 h-5 text-yellow-500" />
      ) : (
          <BsFillMoonStarsFill className="w-5 h-5 text-blue-300" />
      )}
    </button>
  );
} 