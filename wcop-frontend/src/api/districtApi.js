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



export const createDistrict = async (districtName) => {
    const response = await api.post("/districts", null, {
        params: { districtName, },
    }
    );

    return response.data;
};

export const updateDistrict = async (districtId, districtName) => {
    const response = await api.put(`/districts/${districtId}`, null, {
        params: { districtName, },
    }
    );

    return response.data;
};

export const deactivateDistrict = async (
    districtId
) => {
    const response = await api.patch(
        `/districts/${districtId}/deactivate`
    );

    return response.data;
};


const districtApi = {
    getAllDistricts,
    getActiveDistricts,
    getDistrictById,
    createDistrict,
    updateDistrict,
    deactivateDistrict,
};

export default districtApi;