import { useState } from "react";
import { Outlet } from "react-router-dom";
import HomeNavbar from "../../home/HomeNavbar";
import CitizenSidebar from "./CitizenSidebar";

function CitizenLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <HomeNavbar
        onMenuClick={() => setMobileSidebarOpen((prev) => !prev)}
        mobileMenuOpen={mobileSidebarOpen}
      />

      <CitizenSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className="min-h-screen pt-16 sm:pt-20 lg:pl-64">
        <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] w-full px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default CitizenLayout;
