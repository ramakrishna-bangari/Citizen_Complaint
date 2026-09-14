import {
    Navigate,
    Outlet,
} from "react-router-dom";

import {
    useContext,
} from "react";

import AuthContext from "../context/AuthContext";

function ProtectedRoute({ allowedRoles = [] }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
                    <p className="mt-3 text-sm text-slate-500">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const role = String(user.role || "")
        .replace(/^ROLE_/i, "")
        .toUpperCase();

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
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

export default ProtectedRoute;