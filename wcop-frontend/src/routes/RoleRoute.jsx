import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import { useContext } from "react";

import AuthContext from "../context/AuthContext";

function RoleRoute({ allowedRoles = [] }) {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
                    <p className="text-sm text-slate-500">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    let role = user.role ?? user.roleName ?? user.authority ?? user.roles?.[0] ?? "";

    if (typeof role === "object" && role !== null) {
        role = role.roleName ?? role.name ?? role.authority ?? "";
    }

    role = String(role)
        .replace(/^ROLE_/i, "")
        .trim()
        .toUpperCase();

    if (!allowedRoles.includes(role)) {
        if (role === "ADMIN") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        if (role === "OFFICER") {
            return <Navigate to="/officer/dashboard" replace />;
        }

        if (role === "CITIZEN") {
            return <Navigate to="/citizen/dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default RoleRoute;