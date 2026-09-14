import {
    useState,
} from "react";

import {
    Outlet,
} from "react-router-dom";

import HomeNavbar from "../../home/HomeNavbar";
import AdminSidebar from "./AdminSidebar";


// =========================================================
// ADMIN LAYOUT
// =========================================================
// Desktop:
//
// ┌──────────────────────────────────────────────┐
// │                 HOME NAVBAR                  │ 64px
// ├──────────────┬───────────────────────────────┤
// │              │                               │
// │   SIDEBAR    │         PAGE CONTENT          │
// │    256px     │                               │
// │              │                               │
// └──────────────┴───────────────────────────────┘
//
// Mobile:
//
// ┌──────────────────────────────────────────────┐
// │             HOME NAVBAR                     │
// ├──────────────────────────────────────────────┤
// │             PAGE CONTENT                     │
// └──────────────────────────────────────────────┘
//
// Sidebar becomes a drawer.
// =========================================================

function AdminLayout() {

    const [
        mobileSidebarOpen,
        setMobileSidebarOpen,
    ] = useState(false);


    const openSidebar = () => {

        setMobileSidebarOpen(true);

    };


    const closeSidebar = () => {

        setMobileSidebarOpen(false);

    };


    return (

        <div
            className="
                min-h-screen
                bg-slate-50
            "
        >

            {/* =================================================
                COMMON HOME NAVBAR
            ================================================= */}

            <HomeNavbar
                onMenuClick={openSidebar}
                mobileMenuOpen={
                    mobileSidebarOpen
                }
            />


            {/* =================================================
                ADMIN SIDEBAR
            ================================================= */}

            <AdminSidebar
                mobileOpen={
                    mobileSidebarOpen
                }
                onClose={
                    closeSidebar
                }
            />


            {/* =================================================
                MAIN PAGE
            ================================================= */}

            <main
                className="
                    min-h-screen
                    pt-16
                    lg:pl-64
                "
            >

                <div
                    className="
                        min-h-[calc(100vh-4rem)]
                        w-full
                        px-3
                        py-4
                        sm:px-5
                        sm:py-5
                        lg:px-7
                        lg:py-6
                        xl:px-8
                    "
                >

                    <Outlet />

                </div>

            </main>

        </div>
    );
}


export default AdminLayout;