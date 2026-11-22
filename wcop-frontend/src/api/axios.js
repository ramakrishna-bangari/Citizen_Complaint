import axios from "axios";

const baseURL = `${import.meta.env.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || ""}/api`;

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let refreshPromise = null;

export function refreshSession() {
    if (!refreshPromise) {
        const storedRefreshToken = localStorage.getItem("refreshToken");
        refreshPromise = api
            .post("/auth/refresh", { refreshToken: storedRefreshToken })
            .then((res) => {
                const token = res?.data?.accessToken;
                if (token) {
                    localStorage.setItem("accessToken", token);
                }
                const newRefresh = res?.data?.refreshToken;
                if (newRefresh) {
                    localStorage.setItem("refreshToken", newRefresh);
                }
                return res;
            })
            .catch((err) => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                throw err;
            })
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

        const status = error.response.status;
        if (status !== 401 && status !== 403) {
            return Promise.reject(error);
        }

        if (isAuthEndpoint(originalRequest.url)) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            window.dispatchEvent(new CustomEvent("auth:session-expired"));
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
