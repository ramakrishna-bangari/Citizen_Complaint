import api from "./axios";

export const getAdminDashboard = async () => {

    const response =
        await api.get("/dashboard/admin");
    return response.data;
};

export const getAdminAnalytics = async () => {

    const response =
        await api.get("/dashboard/admin/analytics");

    return response.data;
};
