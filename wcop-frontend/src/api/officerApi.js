import api from "./axios";


export const getOfficerComplaints = async () => {

    const response = await api.get(
        "/officer/complaints"
    );

    return response.data;
};


export const getOfficerComplaintsPage = async ({
    page = 0,
    size = 15,
    status = "",
    priority = "",
} = {}) => {

    const params = {
        page: Number(page),
        size: Number(size),
    };


    if (typeof status === "string" && status.trim()) {
        params.status = status.trim().toUpperCase();
    }


    if (typeof priority === "string" && priority.trim()) {
        params.priority = priority.trim().toUpperCase();
    }


    const response = await api.get(
        "/officer/complaints/page",
        {
            params,
        }
    );
    return response.data;
};


export const getOfficerComplaint = async (complaintId) => {

    if (!complaintId) {
        throw new Error("Complaint ID is required.");
    }

    const response = await api.get(
        `/officer/complaints/${complaintId}`
    );

    return response.data;
};


export const getComplaintHistory = async (complaintId) => {

    if (!complaintId) {

        throw new Error("Complaint ID is required.");
    }


    const response = await api.get(`/complaints/${complaintId}/history`);
    return response.data;
};


export const updateOfficerComplaintStatus = async (complaintId, data) => {

    if (!complaintId) {

        throw new Error("Complaint ID is required.");
    }

    const response = await api.put(`/officer/complaints/${complaintId}/status`, data);

    return response.data;
};


export const rejectOfficerComplaint = async (complaintId, data
) => {

    if (!complaintId) {

        throw new Error("Complaint ID is required.");
    }


    const response = await api.put(
        `/officer/complaints/${complaintId}/reject`,
        data
    );

    return response.data;
};


export const getOfficerIncidents = async () => {

    const response = await api.get("/officer/incidents");
    return response.data;
};


export const getOfficerIncidentsPage = async ({
    page = 0,
    size = 15,
    status = "",
    departmentId = "",
    districtId = "",
} = {}) => {

    const params = {
        page: Number(page),
        size: Number(size),
    };


    if (typeof status === "string" && status.trim()) {
        params.status = status.trim().toUpperCase();
    }


    if (departmentId !== "" && departmentId !== null && departmentId !== undefined
    ) {
        params.departmentId = Number(departmentId);
    }


    if (districtId !== "" && districtId !== null && districtId !== undefined) {
        params.districtId = Number(districtId);
    }

    const response = await api.get("/officer/incidents/page", { params, });

    return response.data;
};


export const getOfficerIncident = async (incidentId) => {
    if (!incidentId) {
        throw new Error("Incident ID is required.");
    }


    const response = await api.get(`/officer/incidents/${incidentId}`);
    return response.data;
};

export const updateOfficerIncidentStatus = async (incidentId, data) => {
    if (!incidentId) {
        throw new Error("Incident ID is required.");
    }

    const response = await api.put(`/officer/incidents/${incidentId}/status`, data);
    return response.data;
};


export const getIncidentHistory = async (incidentId) => {
    if (!incidentId) {
        throw new Error("Incident ID is required.");
    }


    const response = await api.get(`/officer/incidents/${incidentId}/history`);
    return response.data;
};




export default {

    // Complaints
    getOfficerComplaints,
    getOfficerComplaintsPage,
    getOfficerComplaint,
    getComplaintHistory,
    updateOfficerComplaintStatus,
    rejectOfficerComplaint,

    // Incidents
    getOfficerIncidents,
    getOfficerIncidentsPage,
    getOfficerIncident,
    updateOfficerIncidentStatus,
    getIncidentHistory,
};