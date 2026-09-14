import api from "./axios";

export const getAllDepartments = async () => {
    const response = await api.get("/departments");
    return response.data;
};


export const getActiveDepartments = async () => {
    const response = await api.get("/departments/active");
    return response.data;
};


export const getDepartmentById = async (departmentId) => {
    const response = await api.get(`/departments/${departmentId}`);
    return response.data;
};

export const createDepartment = async (data) => {
    const response = await api.post("/departments", {
        departmentName: data.departmentName,
        description: data.description || "",
    }
    );

    return response.data;
};


export const updateDepartment = async (departmentId, data) => {

    const response = await api.put(`/departments/${departmentId}`, {
        departmentName: data.departmentName,
        description: data.description || "",
        active: Boolean(data.active),
    }
    );

    return response.data;
};

const departmentApi = {
    getAllDepartments,
    getActiveDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
};

export default departmentApi;