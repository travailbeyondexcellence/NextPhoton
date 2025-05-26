"use client";

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";

// ✅ Outer wrapper
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutWithSidebar>{children}</LayoutWithSidebar>
    </SidebarProvider>
  );
}

// ✅ Actual layout logic using sidebar context
function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  // console.log("Sidebar open state:", open);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <aside
        className={`sidebar fixed top-0 left-0 h-screen w-56 z-50 bg-background transition-transform duration-300 ease-in-out border-transparent dark:border-transparent overflow-hidden bg-gray-900 light:bg-gray-300 text-gray-500 dark:text-gray-400
   
    
        ${open ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <DashboardSidebar />
      </aside>


      <div
        className={`w-screen flex flex-col min-h-screen transition-all duration-300 ${open ? "ml-56" : "ml-0 pl-0"
          }`}
      >
        <DashboardNavbar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
