import { useState } from "react";

import { Outlet } from "react-router-dom";

import HomeNavbar from "../../home/HomeNavbar";
import OfficerSidebar from "./OfficerSidebar";

function OfficerLayout() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const openSidebar = () => {
        setMobileSidebarOpen(true);
    };

    const closeSidebar = () => {
        setMobileSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <HomeNavbar
                onMenuClick={openSidebar}
                mobileMenuOpen={mobileSidebarOpen}
            />

            <OfficerSidebar
                mobileOpen={mobileSidebarOpen}
                onClose={closeSidebar}
            />

            <main className="min-h-screen pt-16 sm:pt-20 lg:pl-64">
                <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] w-full px-4 py-6 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default OfficerLayout;
