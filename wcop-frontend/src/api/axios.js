import axios from "axios";
const api = axios.create({
    baseURL: //"http://localhost:8080/api",
    "https://citizen-complaint-y7q2.onrender.com/api",

    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let refreshPromise = null;

export function refreshSession() {

    if (!refreshPromise) {

        refreshPromise = api.post(
            "/auth/refresh"
        ).finally(() => {

            refreshPromise = null;

        });
    }

    return refreshPromise;
}

api.interceptors.response.use(

    (response) => {
        return response;
    },

    async (error) => {

        const originalRequest = error.config;
        if (!error.response) {
            return Promise.reject(error);
        }

        if (error.response.status !== 401) {
            return Promise.reject(error);
        }

        if (!originalRequest) {
            return Promise.reject(error);
        }


        if (
            originalRequest.url?.includes(
                "/auth/refresh"
            )
        ) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }
        originalRequest._retry = true;

        try {
            await refreshSession();
            return api(originalRequest);

        } catch (refreshError) {
            window.dispatchEvent(
                new CustomEvent("auth:session-expired")
            );

            return Promise.reject(
                refreshError
            );
        }
    }
);


export default api;