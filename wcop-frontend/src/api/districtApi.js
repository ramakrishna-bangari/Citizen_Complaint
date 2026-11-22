import api from "./axios";

export const getAllDistricts = async () => {
    const response = await api.get("/districts");
    return response.data;
};

export const getActiveDistricts = async () => {
    const response = await api.get("/districts/active");
    return response.data;
};

export const getDistrictById = async (districtId) => {
    const response = await api.get(`/districts/${districtId}`);
    return response.data;
};

export const createDistrict = async (data) => {
    const payload = typeof data === "string" ? { districtName: data } : data;
    const response = await api.post("/districts", payload);
    return response.data;
};

export const updateDistrict = async (districtId, data) => {
    const payload = typeof data === "string" ? { districtName: data } : data;
    const response = await api.put(`/districts/${districtId}`, payload);
    return response.data;
};

export const deactivateDistrict = async (districtId) => {
    const response = await api.patch(`/districts/${districtId}/deactivate`);
    return response.data;
};

export default {
    getAllDistricts,
    getActiveDistricts,
    getDistrictById,
    createDistrict,
    updateDistrict,
    deactivateDistrict,
};
