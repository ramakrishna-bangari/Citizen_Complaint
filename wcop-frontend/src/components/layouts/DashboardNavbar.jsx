import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function DashboardNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const menuRef = useRef(null);

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || user?.email || "User";
  const role = String(user?.role || "USER").toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProfilePath = () => {
    if (role === "ADMIN") return "/admin/profile";
    if (role === "OFFICER") return "/officer/profile";
    return "/citizen/profile";
  };

  const handleProfile = () => {
    setMenuOpen(false);
    navigate(getProfilePath());
  };

  const handleLogoutClick = () => {
    setMenuOpen(false);
    setLogoutOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
      setLogoutOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={() => navigate("/")} className="min-w-0 flex items-center gap-2.5 sm:gap-3 text-left">
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
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((previous) => !previous)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {firstName ? firstName[0].toUpperCase() : "U"}
              </div>
              <div className="hidden text-left sm:block">
                <span className="block text-xs font-semibold text-slate-900">{fullName}</span>
                <span className="block text-[11px] font-medium text-slate-500">{role}</span>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={handleProfile}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <UserRound size={16} className="text-slate-400" />
                  My Profile
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {logoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Sign out?</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Are you sure you want to sign out of your account?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardNavbar;
