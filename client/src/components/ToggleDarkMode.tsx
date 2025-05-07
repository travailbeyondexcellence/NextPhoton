"use client";

import { useState, useEffect } from "react";
import { FiSun } from "react-icons/fi";
import { BsMoonStarsFill } from "react-icons/bs";

const ToggleDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div
      className="relative w-16 h-8 flex items-center dark:bg-gray-900 bg-teal-500 cursor-pointer rounded-full transition-colors duration-200 ease-in-out"
      onClick={() => setDarkMode(!darkMode)}
    >
      <div
        className="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out"
        style={darkMode ? { transform: "translateX(32px)" } : {}}
      ></div>
      <div className="absolute inset-0 flex items-center justify-around">
        {!darkMode && <FiSun className="text-yellow-400" />}
        {darkMode && <BsMoonStarsFill className="text-blue-400" />}
      </div>
    </div>
  );
};

export default ToggleDarkMode;
