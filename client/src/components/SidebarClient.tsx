"use client";
import Navbar from "./Navbar";
import Menu from "./Menu";
import Image from "next/image";
import Link from "next/link";
import { useSidebarStore, useUserStore } from "../lib/store";
import { useEffect } from "react";

export default function SidebarClient({ children, role, name, user }: { children: React.ReactNode; role: string; name: string; user: any }) {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const setOpen = useSidebarStore((state) => state.setOpen);
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    setUser(user);
  }, [user, setUser]);
  const sidebarTransition =
    "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]";

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div
        className={`z-30 bg-white dark:bg-gray-900 p-4
          w-[70vw] max-w-xs fixed top-0 left-0 h-full md:static md:w-[8%] lg:w-[16%] xl:w-[14%] md:max-w-none
          ${sidebarTransition}
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          shadow-lg md:shadow-none
        `}
      >
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">Next Photon</span>
        </Link>
        <Menu />
      </div>
      {/* OVERLAY for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* RIGHT */}
      <div className="flex-1 w-full md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] dark:bg-gray-700 overflow-auto min-h-0 min-w-0 flex flex-col">
        <Navbar role={role} name={name} />
        {children}
      </div>
    </div>
  );
} 