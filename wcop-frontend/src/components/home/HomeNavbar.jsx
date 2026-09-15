import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


function HomeNavbar({ onMenuClick, mobileMenuOpen = false }) {

    const { user, isAuthenticated, logout } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [profileOpen, setProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const profileRef = useRef(null);


    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);


    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    // USER DISPLAY DATA

    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || user?.name || "User";
    const email = user?.email || "";
    const role = user?.role || "";

    const initials =
        `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`
            .trim()
            .toUpperCase() || fullName.charAt(0).toUpperCase();


    const getProfilePath = () => {
        if (role === "ADMIN") return "/admin/profile";
        if (role === "OFFICER") return "/officer/profile";
        return "/citizen/profile";
    };



    const handleLogout = async () => {
        setProfileOpen(false);
        try {
            await logout();
        } finally {
            navigate("/login", { replace: true });
        }
    };



    const handleProfile = () => {
        setProfileOpen(false);
        navigate(getProfilePath());
    };


    return (
        <header
            className={`fixed inset-x-0 top-0 z-[100] h-16 border-b transition-all duration-200 ${
                scrolled
                    ? "border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
                    : "border-transparent bg-white/80 backdrop-blur"
            }`}
        >
            <div className="mx-auto flex h-full w-full max-w-[1800px] items-center justify-between px-3 sm:px-5 lg:px-7 xl:px-8">

                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="flex min-w-0 items-center gap-3">

                    {/* MOBILE MENU */}

                    {isAuthenticated && onMenuClick && (
                        <button
                            type="button"
                            onClick={onMenuClick}
                            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
                        >
                            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
                        </button>
                    )}

                    {/* BRAND */}

                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
                            C
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold leading-5 text-slate-900 sm:text-base">
                                Citizen Complaint
                            </p>
                            <p className="truncate text-[11px] leading-4 text-slate-500 sm:text-xs">
                                Management System
                            </p>
                        </div>
                    </div>

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                {!isAuthenticated ? (


                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:px-3"
                        >
                            Sign In
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:px-4"
                        >
                            Register
                        </button>

                    </div>

                ) : (

                   
                     //  LOGGED IN
                    

                    <div ref={profileRef} className="relative shrink-0">

                        <button
                            type="button"
                            onClick={() => setProfileOpen((previous) => !previous)}
                            aria-expanded={profileOpen}
                            className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition hover:bg-slate-50 sm:gap-3"
                        >
                            {/* AVATAR */}
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 ring-1 ring-blue-200">
                                {initials}
                            </div>

                            {/* NAME */}
                            <div className="hidden max-w-[170px] text-left sm:block">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {fullName}
                                </p>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                    {role}
                                </p>
                            </div>

                            <ChevronDown
                                size={17}
                                className={`hidden text-slate-500 transition sm:block ${
                                    profileOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {/*  PROFILE DROPDOWN */}

                        {profileOpen && (
                            <div className="absolute right-0 top-[calc(100%+8px)] w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

                                {/* USER HEADER */}
                                <div className="border-b border-slate-100 px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                                            {initials}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-slate-900">
                                                {fullName}
                                            </p>
                                            <p className="truncate text-xs text-slate-500">
                                                {email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* PROFILE */}
                                <button
                                    type="button"
                                    onClick={handleProfile}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    <User size={18} />
                                    <span>My Profile</span>
                                </button>

                                {/* LOGOUT */}
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                    <LogOut size={18} />
                                    <span>Sign Out</span>
                                </button>

                            </div>
                        )}

                    </div>
                )}

            </div>
        </header>
    );
}


export default HomeNavbar;