import api from "./axios";

export const getAdminDashboard = async () => {

    const response = await api.get(
        "/dashboard/admin"
    );

    return response.data;
};

export const getOfficerDashboard = async () => {

    const response = await api.get(
        "/dashboard/officer"
    );

    return response.data;
};

export const getCitizenDashboard = async () => {

    const response = await api.get(
        "/dashboard/citizen"
    );

    return response.data;
};

export const getAdminAnalytics = async () => {

    const response = await api.get(
        "/dashboard/admin/analytics"
    );

    return response.data;
};