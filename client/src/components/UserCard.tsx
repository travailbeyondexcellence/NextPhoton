"use client";

import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "./ThemeProvider";
import Image from "next/image";

const UserCard = ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const [data, setData] = useState<number | null>(null);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users/${type}`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Handle error appropriately (e.g., show error message to user)
      }
    };
    fetchData();
  }, [type]);

  return (
    <div className={`rounded-2xl p-4 flex-1 min-w-[130px] ${
      darkMode ? "bg-gray-800" : "odd:bg-lamaPurple even:bg-lamaYellow"
    }`}>
      <div className="flex justify-between items-center">
        <span className={`text-[10px] bg-white px-2 py-1 rounded-full ${
          darkMode ? "text-green-400" : "text-green-600"
        }`}>
          2024/25
        </span>
        <Image src={darkMode ? "/moreDark.png" : "/more.png"} alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data !== null ? data : 'Loading...'}</h1>
      <h2 className={`capitalize text-sm font-medium ${
        darkMode ? "text-gray-400" : "text-gray-500"
      }`}>{type}s</h2>
    </div>
  );
};

export default UserCard;
