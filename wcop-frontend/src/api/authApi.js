import api, { refreshSession } from "./axios";
export const loginUser = async (data) => {
    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;
};

export const registerUser = async (data) => {
    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;
};


export const sendOtp = async (identifier) => {
    const response = await api.post(
        "/auth/otp/send",
        {
            identifier: String(identifier).trim(),
        }
    );

    return response.data;
};

export const verifyOtp = async (data) => {
    const response = await api.post(
        "/auth/otp/verify",
        data
    );

    return response.data;
};

export const forgotPassword = async (identifier) => {
    const response = await api.post(
        "/auth/forgot-password",
        {
            identifier: String(identifier).trim(),
        }
    );

    return response.data;
};

export const resetPassword = async (data) => {
    const response = await api.post(
        "/auth/reset-password",
        data
    );

    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.put(
        "/auth/profile",
        data
    );

    return response.data;
};

export const refreshToken = async () => {
    const response = await refreshSession();

    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post(
        "/auth/logout"
    );

    return response.data;
};