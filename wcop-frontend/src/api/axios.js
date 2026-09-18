import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let refreshPromise = null;

export function refreshSession() {
    if (!refreshPromise) {
        refreshPromise = api
            .post("/auth/refresh")
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

const isAuthEndpoint = (url = "") => {
    return (
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/refresh") ||
        url.includes("/auth/otp/") ||
        url.includes("/auth/forgot-password") ||
        url.includes("/auth/reset-password")
    );
};

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (!error.response || !originalRequest) {
            return Promise.reject(error);
        }

        if (error.response.status !== 401) {
            return Promise.reject(error);
        }

        if (isAuthEndpoint(originalRequest.url)) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            window.dispatchEvent(
                new CustomEvent("auth:session-expired")
            );

            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            await refreshSession();
            return api(originalRequest);
        } catch (refreshError) {
            window.dispatchEvent(new CustomEvent("auth:session-expired"));
            return Promise.reject(refreshError);
        }
    }
);

export default api;