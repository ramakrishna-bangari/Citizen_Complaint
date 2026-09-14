import api from "./axios";

export const COMPLAINT_STATUS = {
    PENDING: "PENDING",
    ASSIGNED: "ASSIGNED",
    IN_PROGRESS: "IN_PROGRESS",
    RESOLVED: "RESOLVED",
    REJECTED: "REJECTED",
};


export const COMPLAINT_PRIORITY = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    CRITICAL: "CRITICAL",
};


export const createComplaint = async (data) => {
    const response = await api.post(
        "/complaints",
        data
    );

    return response.data;
};

export const getAllComplaints = async () => {
    const response = await api.get(
        "/complaints"
    );

    return response.data;
};

export const getAdminComplaints = async ({
    page = 0,
    size = 15,
    status = "",
    priority = "",
} = {}) => {

    const params = {
        page: Number(page),
        size: Number(size),
    };

    if (
        typeof status === "string" &&
        status.trim() !== ""
    ) {
        params.status =
            status.trim().toUpperCase();
    }

    if (
        typeof priority === "string" &&
        priority.trim() !== ""
    ) {
        params.priority =
            priority.trim().toUpperCase();
    }

    const response = await api.get(
        "/complaints/page",
        {
            params,
        }
    );

    return response.data;
};


export const getComplaintById = async (complaintId) => {

    if (complaintId === null ||
        complaintId === undefined ||
        complaintId === "") {
        throw new Error("Complaint ID is required.");
    }

    const response = await api.get(
        `/complaints/${complaintId}`
    );

    return response.data;
};


export const getMyComplaints = async () => {

    const response = await api.get(
        "/complaints/my"
    );

    return response.data;
};


export const getComplaintHistory = async (complaintId) => {

    if (complaintId === null ||
        complaintId === undefined ||
        complaintId === "") {
        throw new Error("Complaint ID is required.");
    }

    const response = await api.get(
        `/complaints/${complaintId}/history`
    );

    return response.data;
};



export const updateComplaintStatus = async (complaintId, data) => {

    if (complaintId === null || complaintId === undefined || complaintId === "") {
        throw new Error("Complaint ID is required.");
    }

    const response = await api.put(
        `/complaints/${complaintId}/status`,
        data
    );

    return response.data;
};


export const assignComplaint = async (complaintId, data) => {
    if (complaintId === null || complaintId === undefined || complaintId === "") {
        throw new Error("Complaint ID is required.");
    }

    const response = await api.put(
        `/complaints/${complaintId}/assign`,
        data
    );

    return response.data;
};

// ADMIN / OFFICER - REJECT COMPLAINT
export const rejectComplaint = async (
    complaintId,
    data
) => {

    if (complaintId === null || complaintId === undefined || complaintId === "") {
        throw new Error("Complaint ID is required.");
    }

    const response = await api.put(
        `/complaints/${complaintId}/reject`,
        data
    );

    return response.data;
};



const complaintApi = {
    createComplaint,
    getAllComplaints,
    getAdminComplaints,
    getComplaintById,
    getMyComplaints,
    getComplaintHistory,
    updateComplaintStatus,
    assignComplaint,
    rejectComplaint,
};

export default complaintApi;