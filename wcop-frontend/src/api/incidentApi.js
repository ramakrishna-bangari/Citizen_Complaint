import api from "./axios";
export const getAllIncidents = async () => {
    const response = await api.get("/incidents");
    return response.data;
};


export const getIncidents = async (params = {}) => {
    const response = await api.get("/incidents/page", { params, });
    return response.data;
};

export const getOpenIncidents = async () => {
    const response = await api.get("/incidents/open");
    return response.data;
};

export const getIncidentById = async (incidentId) => {
    if (!incidentId) {
        throw new Error("Incident ID is required.");
    }

    const response = await api.get(`/incidents/${incidentId}`);
    return response.data;
};

export const assignIncident = async (incidentId, data) => {
    if (!incidentId) {
        throw new Error("Incident ID is required.");
    }

    const response = await api.put(`/incidents/${incidentId}/assign`, data);
    return response.data;
};

export const updateIncidentStatus = async (incidentId, data) => {
    if (!incidentId) {
        throw new Error("Incident ID is required.");
    }
    const response = await api.put(`/incidents/${incidentId}/status`, data);
    return response.data;
};


export const getIncidentHistory = async (incidentId) => {
    if (!incidentId) {
        throw new Error("Incident ID is required.");
    }

    const response = await api.get(`/incidents/${incidentId}/history`);
    return response.data;
};

export default {
    getAllIncidents,
    getIncidents,
    getOpenIncidents,
    getIncidentById,
    assignIncident,
    updateIncidentStatus,
    getIncidentHistory,
};