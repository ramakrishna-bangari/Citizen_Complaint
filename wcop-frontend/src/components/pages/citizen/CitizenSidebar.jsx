import {
    FileText,
    LayoutDashboard,
    PlusCircle,
    UserCircle,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function CitizenSidebar({
    mobileOpen = false,
    onClose = () => { },
}) {
    const links = [
        {
            label: "Dashboard",
            path: "/citizen/dashboard",
            icon: LayoutDashboard,
            end: true,
        },
        {
            label: "My Complaints",
            path: "/citizen/complaints",
            icon: FileText,
            end: true,
        },
        {
            label: "Submit Complaint",
            path: "/citizen/complaints/new",
            icon: PlusCircle,
            end: true,
        },
        {
            label: "Profile",
            path: "/citizen/profile",
            icon: UserCircle,
            end: true,
        },
    ];

    const handleNavigation = () => {
        if (onClose) {
            onClose();
        }
    };

    const navigation = (
        <nav
            aria-label="Citizen navigation"
            className="space-y-1.5"
        >
            {links.map((item) => {
                const Icon = item.icon;

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        onClick={handleNavigation}
                        className={({ isActive }) => {
                            return [
                                "group",
                                "flex",
                                "w-full",
                                "items-center",
                                "gap-3",
                                "rounded-xl",
                                "px-3.5",
                                "py-3",
                                "text-sm",
                                "font-semibold",
                                "transition-all",
                                "duration-200",
                                "outline-none",
                                "focus-visible:ring-2",
                                "focus-visible:ring-blue-500",
                                "focus-visible:ring-offset-2",
                                isActive
                                    ? [
                                        "bg-blue-600",
                                        "text-white",
                                        "shadow-sm",
                                        "hover:bg-blue-700",
                                    ].join(" ")
                                    : [
                                        "text-slate-600",
                                        "hover:bg-blue-50",
                                        "hover:text-blue-700",
                                    ].join(" "),
                            ].join(" ");
                        }}
                    >
                        {({ isActive }) => (
                            <>
                                <span
                                    className={[
                                        "flex",
                                        "h-9",
                                        "w-9",
                                        "shrink-0",
                                        "items-center",
                                        "justify-center",
                                        "rounded-lg",
                                        "transition-all",
                                        "duration-200",
                                        isActive
                                            ? "bg-blue-700 text-white"
                                            : [
                                                "bg-transparent",
                                                "text-slate-600",
                                                "group-hover:bg-white",
                                                "group-hover:text-blue-700",
                                            ].join(" "),
                                    ].join(" ")}
                                >
                                    <Icon
                                        size={19}
                                        strokeWidth={2}
                                    />
                                </span>

                                <span className="min-w-0 flex-1 truncate">
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                );
            })}
        </nav>
    );

    return (
        <>
            <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-white lg:block">
                <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
                    <div className="mb-7 px-2">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Citizen Portal
                        </p>

                        <h2 className="mt-1 text-lg font-bold leading-7 text-slate-900">
                            My Services
                        </h2>
                    </div>

                    {navigation}

                    <div className="mt-auto pt-8">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs font-semibold text-slate-700">
                                Citizen Account
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Manage your complaints and profile
                                from one place.
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close citizen navigation"
                    onClick={onClose}
                    className="fixed inset-0 z-40 cursor-default bg-slate-950/40 lg:hidden"
                />
            )}

            <aside
                aria-label="Citizen mobile navigation"
                className={[
                    "fixed",
                    "left-0",
                    "top-0",
                    "z-50",
                    "flex",
                    "h-full",
                    "w-[min(86vw,320px)]",
                    "flex-col",
                    "border-r",
                    "border-slate-200",
                    "bg-white",
                    "shadow-2xl",
                    "transition-transform",
                    "duration-300",
                    "ease-out",
                    "lg:hidden",
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full",
                ].join(" ")}
            >
                <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 px-5">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Citizen Portal
                        </p>

                        <p className="mt-0.5 text-lg font-bold text-slate-900">
                            My Services
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <X
                            size={21}
                            strokeWidth={2}
                        />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6">
                    {navigation}
                </div>

                <div className="shrink-0 border-t border-slate-200 p-4">
                    <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-700">
                            Citizen Account
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Access your citizen services securely.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default CitizenSidebar;