"use client"

import React from 'react';


import { useTheme } from "next-themes";

const Welcome = () => {

  const { theme } = useTheme();

  // let theme = "dark111";

  return (
    <div className="p-4 rounded-xl shadow-lg text-center  !bg-amber-300  dark:bg-blue-800 ">
      <h1 className="text-2xl font-bold mb-2">Welcome to the App!</h1>
      <p className="text-gray-600 dark:text-blue-300">This is a simple reusable component in Next.js.</p>

      <div
        className={`w-auto h-screen ${theme === "dark" ? "bg-teal-900" : "bg-amber-200"
          }`}
      >
        Hello
      </div>

    </div>
  );
};

export default Welcome;
