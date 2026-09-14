import {
    ClipboardList,
    FileWarning,
    LayoutDashboard,
    UserCircle,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function OfficerSidebar({
    mobileOpen = false,
    onClose = () => { },
}) {
    const links = [
        {
            label: "Dashboard",
            path: "/officer/dashboard",
            icon: LayoutDashboard,
            end: true,
        },
        {
            label: "Complaints",
            path: "/officer/complaints",
            icon: ClipboardList,
        },
        {
            label: "Incidents",
            path: "/officer/incidents",
            icon: FileWarning,
        },
        {
            label: "Profile",
            path: "/officer/profile",
            icon: UserCircle,
        },
    ];

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            <div className="shrink-0 border-b border-slate-200 px-5 py-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600">
                    Officer Portal
                </p>

                <h2 className="mt-1 text-base font-bold leading-6 text-slate-900">
                    Operations
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                    Manage assigned civic work.
                </p>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                    {links.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive
                                        ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`
                                }
                            >
                                <Icon size={19} className="shrink-0" />

                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            <div className="shrink-0 border-t border-slate-200 p-3 lg:hidden">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                    <X size={17} />
                    Close Menu
                </button>
            </div>
        </div>
    );

    return (
        <>
            <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
                <SidebarContent />
            </aside>

            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={onClose}
                    className="fixed inset-0 z-[70] bg-slate-950/40 lg:hidden"
                />
            )}

            <aside
                className={`fixed bottom-0 left-0 top-16 z-[80] w-[min(86vw,320px)] border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <SidebarContent />
            </aside>
        </>
    );
}

export default OfficerSidebar;