import api from "./axios";

export const getCitizenProfile = async () => {
    const response = await api.get(
        "/citizen/profile"
    );

    return response.data;
};


export const updateCitizenProfile = async (data) => {
    const response = await api.put("/citizen/profile", data);

    return response.data;
};


export const changeCitizenPassword = async (data) => {
    const response = await api.put("/citizen/password", data);

    return response.data;
};

export const getOfficerProfile = async () => {
    const response = await api.get("/officer/profile");
    return response.data;
};


export const updateOfficerProfile = async (data) => {
    const response = await api.put("/officer/profile", data);

    return response.data;
};


export const changeOfficerPassword = async (data) => {
    const response = await api.put("/officer/password", data);

    return response.data;
};


export const getAdminProfile = async () => {
    const response = await api.get("/admin/profile");

    return response.data;
};

export const updateAdminProfile = async (data) => {
    const response = await api.put("/admin/profile", data);

    return response.data;
};


export const changeAdminPassword = async (data) => {
    const response = await api.put("/admin/password", data);

    return response.data;
};

const userApi = {

    // Citizen
    getCitizenProfile,
    updateCitizenProfile,
    changeCitizenPassword,

    // Officer
    getOfficerProfile,
    updateOfficerProfile,
    changeOfficerPassword,

    // Admin
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,

};


export default userApi;