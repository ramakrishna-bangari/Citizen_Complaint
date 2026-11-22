import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function HomeNavbar({ onMenuClick, mobileMenuOpen = false }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || user?.name || "User";
  const email = user?.email || "";
  const role = user?.role || "";

  const initials =
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.trim().toUpperCase() ||
    fullName.charAt(0).toUpperCase();

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
      className={`fixed inset-x-0 top-0 z-[100] h-16 sm:h-20 border-b transition-all duration-200 ${
        scrolled
          ? "border-slate-200 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06)]"
          : "border-transparent bg-white/90 backdrop-blur"
      }`}
    >
      <div className="flex h-full w-full items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          {isAuthenticated && onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <div className="flex items-center gap-2.5 sm:gap-3 select-none cursor-default min-w-0">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-blue-600 text-base sm:text-xl font-extrabold text-white shadow-xs">
              C
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <span className="block text-sm sm:text-base lg:text-xl font-extrabold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
                Citizen Complaint
              </span>
              <span className="block text-[10px] sm:text-xs font-semibold tracking-wide text-slate-500 leading-tight whitespace-nowrap">
                Management System
              </span>
            </div>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-base font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="rounded-lg sm:rounded-xl bg-blue-600 px-3 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-base font-semibold text-white shadow-xs transition hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        ) : (
          <div ref={profileRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setProfileOpen((previous) => !previous)}
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-50 sm:gap-3"
            >
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm sm:text-base font-bold text-blue-700 ring-2 ring-blue-200">
                {initials}
              </div>
              <div className="hidden max-w-[180px] text-left sm:block">
                <p className="truncate text-base font-semibold text-slate-900">{fullName}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{role}</p>
              </div>
              <ChevronDown
                size={18}
                className={`hidden text-slate-500 transition sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[270px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-slate-900">{fullName}</p>
                      <p className="truncate text-xs text-slate-500">{email}</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProfile}
                  className="flex w-full items-center gap-2.5 px-5 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <User size={18} />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 border-t border-slate-100 px-5 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
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
