import { useCallback, useEffect, useMemo, useState } from "react";

import AuthContext from "./AuthContext";

import {
    loginUser,
    logoutUser,
    refreshToken,
    registerUser,
    verifyOtp,
} from "../api/authApi";

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const extractUser = useCallback((response) => {
        if (!response) {
            return null;
        }

        if (response.user) {
            return response.user;
        }

        if (response.data?.user) {
            return response.data.user;
        }

        if (
            response.data &&
            typeof response.data === "object" &&
            response.data.id
        ) {
            return response.data;
        }

        if (response.id) {
            return response;
        }

        return null;
    }, []);

    const normalizeUser = useCallback((rawUser) => {
        if (!rawUser) {
            return null;
        }

        let role =
            rawUser.role ||
            rawUser.roleName ||
            rawUser.userRole ||
            null;

        if (typeof role === "object" && role !== null) {
            role = role.roleName || role.name || null;
        }

        role = String(role)
            .replace(/^ROLE_/i, "")
            .toUpperCase();

        return {
            ...rawUser,
            role,
        };
    }, []);

    const updateUser = useCallback(
        (updatedUser) => {
            const normalized = normalizeUser(updatedUser);

            if (!normalized) {
                return;
            }

            setUser((currentUser) => ({
                ...(currentUser || {}),
                ...normalized,
            }));
        },
        [normalizeUser]
    );

    const initializeAuth = useCallback(async () => {
        setLoading(true);

        try {
            const response = await refreshToken();
            const rawUser = extractUser(response);
            const authenticatedUser = normalizeUser(rawUser);

            if (!authenticatedUser) {
                setUser(null);
                return;
            }

            setUser(authenticatedUser);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [extractUser, normalizeUser]);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const login = useCallback(
        async (data) => {
            const response = await loginUser(data);

            const rawUser = extractUser(response);
            const authenticatedUser = normalizeUser(rawUser);

            if (!authenticatedUser) {
                throw new Error(
                    "Login succeeded, but user information was not returned."
                );
            }

            setUser(authenticatedUser);

            return authenticatedUser;
        },
        [extractUser, normalizeUser]
    );

    const loginWithOtp = useCallback(
        async (data) => {
            const response = await verifyOtp(data);

            const rawUser = extractUser(response);
            const authenticatedUser = normalizeUser(rawUser);

            if (!authenticatedUser) {
                throw new Error(
                    "OTP verification succeeded, but user information was not returned."
                );
            }

            setUser(authenticatedUser);

            return authenticatedUser;
        },
        [extractUser, normalizeUser]
    );

    const register = useCallback(async (data) => {
        return await registerUser(data);
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    }, []);

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: Boolean(user),

            login,
            loginWithOtp,
            register,
            logout,
            updateUser,

            refreshAuth: initializeAuth,
        }),
        [
            user,
            loading,
            login,
            loginWithOtp,
            register,
            logout,
            updateUser,
            initializeAuth,
        ]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;