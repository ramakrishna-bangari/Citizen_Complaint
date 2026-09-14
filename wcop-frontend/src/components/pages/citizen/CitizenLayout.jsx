import { useState } from "react";
import { Outlet } from "react-router-dom";
import HomeNavbar from "../../home/HomeNavbar";
import CitizenSidebar from "./CitizenSidebar";

function CitizenLayout() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <HomeNavbar
                onMenuClick={() => setMobileSidebarOpen(true)}
            />

            <CitizenSidebar
                mobileOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />

            <main className="min-h-[calc(100vh-4rem)] pt-16 lg:ml-64">
                <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 xl:px-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default CitizenLayout;