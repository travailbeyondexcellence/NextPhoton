"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { Menu as MenuIcon } from "lucide-react";
import React from "react";
import { useSidebarStore } from "../lib/store";

export default function Navbar({ role, name }: { role: string; name: string }) {
  const toggleSidebar = useSidebarStore((state) => state.toggle);
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      {/* HAMBURGER + SEARCH BAR */}
      <div className="flex items-center gap-2">
        <button
          className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
          type="button"
        >
          <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 dark:ring-gray-700 px-2 bg-white dark:bg-gray-800 transition-colors duration-200">
          <Image src="/search.png" alt="" width={14} height={14} className="dark:invert" />
          <input
            type="text"
            placeholder="Search..."
            className="w-[200px] p-2 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <ThemeToggle />
        <div className="bg-white dark:bg-gray-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer transition-colors duration-200">
          <Image src="/message.png" alt="" width={20} height={20} className="dark:invert" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative transition-colors duration-200">
          <Image src="/announcement.png" alt="" width={20} height={20} className="dark:invert" />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium text-gray-900 dark:text-gray-100">{name}</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 text-right">
            {role}
          </span>
        </div>
        <UserButton />
      </div>
    </div>
  );
}
