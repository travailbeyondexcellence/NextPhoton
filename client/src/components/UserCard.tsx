"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

const UserCard = ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const [data, setData] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${type}`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        setData(users.length);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Handle error appropriately (e.g., show error message to user)
      }
    };
    fetchData();
  }, [type]);

  return (
    <div className={`rounded-2xl p-4 flex-1 min-w-[130px] transition-colors duration-200 ${
      isDark ? "bg-gray-800" : "odd:bg-lamaPurple even:bg-lamaYellow"
    }`}>
      <div className="flex justify-between items-center">
        <span className={`text-[10px] bg-white dark:bg-gray-700 px-2 py-1 rounded-full transition-colors duration-200 ${
          isDark ? "text-green-400" : "text-green-600"
        }`}>
          2024/25
        </span>
        <Image 
          src={isDark ? "/moreDark.png" : "/more.png"} 
          alt="More options" 
          width={20} 
          height={20}
          className="transition-opacity duration-200"
        />
      </div>
      <h1 className="text-2xl font-semibold my-4 text-gray-900 dark:text-white transition-colors duration-200">
        {data !== null ? data : 'Loading...'}
      </h1>
      <h2 className={`capitalize text-sm font-medium transition-colors duration-200 ${
        isDark ? "text-gray-400" : "text-gray-500"
      }`}>
        {type}s
      </h2>
    </div>
  );
};

export default UserCard;
