import SidebarWrapper from "../../components/SidebarWrapper";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex">
      {/* Sidebar + Main inside SidebarWrapper */}
      <SidebarWrapper>
        <div className="flex w-full">
          {/* Sidebar container */}
          <div id="sidebar-container" className="transition-all duration-300 w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]">
            <Sidebar />
          </div>

          {/* Main content area */}
          <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-y-scroll flex flex-col">
            <Navbar />
            {children}
          </div>
        </div>
      </SidebarWrapper>
    </div>
  );
}
