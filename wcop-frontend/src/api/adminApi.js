import api from "./axios";

export const getAdminOfficers = async (params = {}) => {
    const response = await api.get("/admin/officers", { params });
    return response.data;
};

export const getAdminOfficerById = async (officerId) => {
    const response = await api.get(`/admin/officers/${officerId}`);
    return response.data;
};

export const createAdminOfficer = async (data) => {
    const response = await api.post("/admin/officers", data);
    return response.data;
};

export const updateAdminOfficer = async (officerId, data) => {
    const response = await api.put(`/admin/officers/${officerId}`, data);
    return response.data;
};


export const activateAdminOfficer = async (officerId) => {
    const response = await api.patch(`/admin/officers/${officerId}/activate`);
    return response.data;
};

export const deactivateAdminOfficer = async (officerId) => {
    const response = await api.patch(`/admin/officers/${officerId}/deactivate`);
    return response.data;
};


export const getAdminDepartments = async (params = {}) => {
    const response = await api.get("/departments", { params });
    return response.data;
};

export const getAdminDepartmentById = async (departmentId) => {
    const response = await api.get(`/departments/${departmentId}`);
    return response.data;
};

export const createAdminDepartment = async (data) => {
    const response = await api.post("/departments", data);
    return response.data;
};

export const updateAdminDepartment = async (departmentId, data) => {
    const response = await api.put(`/departments/${departmentId}`, data);
    return response.data;
};

export const getAdminDistricts = async (params = {}) => {
    const response = await api.get("/districts", { params });
    return response.data;
};

export const getAdminDistrictById = async (districtId) => {
    const response = await api.get(`/districts/${districtId}`);
    return response.data;
};

export const createAdminDistrict = async (data) => {
    const response = await api.post("/districts", data);
    return response.data;
};

export const updateAdminDistrict = async (districtId, data) => {
    const response = await api.put(`/districts/${districtId}`, data);
    return response.data;
};

export const activateAdminDistrict = async (districtId) => {
    const response = await api.patch(`/districts/${districtId}/activate`);
    return response.data;
};

export const deactivateAdminDistrict = async (districtId) => {
    const response = await api.patch(`/districts/${districtId}/deactivate`);
    return response.data;
};


export const getAdminComplaintById = async (complaintId) => {
    const response = await api.get(`/admin/complaints/${complaintId}`);
    return response.data;
};

export const getAdminIncidentById = async (incidentId) => {
    const response = await api.get(`/admin/incidents/${incidentId}`);
    return response.data;
};