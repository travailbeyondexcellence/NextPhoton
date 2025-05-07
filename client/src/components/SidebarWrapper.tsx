"use client";

import SideBarToggle from "./SideBarToggle";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(true);

  // Toggle visibility of #sidebar-container
  useEffect(() => {
    const sidebar = document.getElementById("sidebar-container");
    if (sidebar) {
      sidebar.style.display = showSidebar ? "block" : "none";
    }
  }, [showSidebar]);

  return (
    <div className="h-screen flex relative">
      {/* Toggle button when sidebar is hidden */}
      {!showSidebar && (
        <div className="absolute top-4 left-4 z-50">
          <SideBarToggle onToggle={() => setShowSidebar(true)} />
        </div>
      )}

      {/* X button to hide sidebar */}
      {showSidebar && (
        <button
          onClick={() => setShowSidebar(false)}
          className="absolute top-4 left-[13%] lg:block z-50 bg-white md:p-2 rounded-full shadow text-blue-950 mt-1 md:mt-0 "
        >
          <X />
        </button>
      )}

      {/* Main content */}
      <div className="flex-1 bg-[#F7F8FA] overflow-y-scroll flex flex-col">
        {children}
      </div>
    </div>
  );
}
