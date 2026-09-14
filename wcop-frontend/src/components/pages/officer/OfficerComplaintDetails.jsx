import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    ExternalLink,
    FileText,
    History,
    Image as ImageIcon,
    Mail,
    MapPin,
    Navigation,
    Phone,
    RefreshCw,
    UserRound,
    X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const display = (value, fallback = "Not available") => {
    if (value === null || value === undefined || String(value).trim() === "") {
        return fallback;
    }

    return value;
};

const fullName = (firstName, lastName) => {
    const first = firstName ? String(firstName).trim() : "";
    const last = lastName ? String(lastName).trim() : "";

    return [first, last].filter(Boolean).join(" ") || null;
};

const getStatusClass = (status) => {
    const value = String(status || "").toUpperCase();

    if (value === "RESOLVED") {
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (value === "REJECTED") {
        return "border-red-200 bg-red-50 text-red-700";
    }

    if (value === "IN_PROGRESS") {
        return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (value === "PENDING") {
        return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-700";
};

const getPriorityClass = (priority) => {
    const value = String(priority || "").toUpperCase();

    if (value === "HIGH" || value === "URGENT") {
        return "border-red-200 bg-red-50 text-red-700";
    }

    if (value === "MEDIUM") {
        return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-700";
};

function OfficerComplaintDetails() {
    const { complaintId } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [status, setStatus] = useState("");
    const [remarks, setRemarks] = useState("");
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState("");

    const loadComplaint = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/complaints/${complaintId}`);

            const data = response?.data?.data ?? response?.data;

            setComplaint(data);
            setStatus(data?.status || "");
        } catch (err) {
            setError(err?.response?.data?.message || "Unable to load complaint details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (complaintId) {
            loadComplaint();
        }
    }, [complaintId]);

    const citizenName = useMemo(() => {
        if (!complaint?.user) {
            return complaint?.citizenName || "Not available";
        }

        return (
            fullName(complaint.user.firstName, complaint.user.lastName) ||
            complaint.citizenName ||
            "Not available"
        );
    }, [complaint]);

    const citizenPhone = complaint?.user?.phone || complaint?.citizenPhone || complaint?.phone || null;

    const citizenEmail = complaint?.user?.email || complaint?.citizenEmail || complaint?.email || null;

    const image = complaint?.imageUrl || null;

    const latitude = complaint?.latitude;
    const longitude = complaint?.longitude;

    const hasCoordinates =
        latitude !== null &&
        latitude !== undefined &&
        longitude !== null &&
        longitude !== undefined &&
        latitude !== "" &&
        longitude !== "";

    const mapsUrl = hasCoordinates
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${latitude},${longitude}`)}`
        : null;

    const incidentId = complaint?.incidentId || complaint?.incident?.id || null;

    const updateComplaintStatus = async () => {
        if (!status) {
            setUpdateError("Please select a status.");
            return;
        }

        try {
            setUpdating(true);
            setUpdateError("");

            await api.put(`/complaints/${complaintId}/status`, {
                status,
                remarks: remarks.trim() || null,
            });

            setShowStatusModal(false);
            setRemarks("");

            await loadComplaint();
        } catch (err) {
            setUpdateError(err?.response?.data?.message || "Unable to update complaint status.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-[1500px] p-5">
                <div className="animate-pulse space-y-4">
                    <div className="h-7 w-52 rounded bg-slate-200" />

                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="h-[620px] rounded-2xl bg-slate-200" />

                        <div className="space-y-4">
                            <div className="h-48 rounded-2xl bg-slate-200" />
                            <div className="h-56 rounded-2xl bg-slate-200" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !complaint) {
        return (
            <div className="mx-auto max-w-[1000px] p-6">
                <button
                    onClick={() => navigate("/officer/complaints")}
                    className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
                >
                    <ArrowLeft size={17} />
                    Back to complaints
                </button>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                    {error || "Complaint not found."}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[1500px] space-y-4 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <button
                        onClick={() => navigate("/officer/complaints")}
                        className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
                    >
                        <ArrowLeft size={17} />
                        Back to complaints
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Complaint #{complaint.id}
                        </h1>

                        <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(complaint.status)}`}
                        >
                            {display(complaint.status)}
                        </span>

                        {complaint.priority && (
                            <span
                                className={`rounded-full border px-3 py-1 text-xs font-bold ${getPriorityClass(complaint.priority)}`}
                            >
                                {complaint.priority}
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        Review the citizen submission and manage its progress.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={loadComplaint}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>

                    <button
                        onClick={() => {
                            setStatus(complaint.status || "");
                            setRemarks("");
                            setUpdateError("");
                            setShowStatusModal(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800"
                    >
                        <CheckCircle2 size={16} />
                        Update status
                    </button>
                </div>
            </div>

            <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="min-w-0 space-y-4">
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {image ? (
                            <div className="relative h-[280px] bg-slate-100 md:h-[350px]">
                                <img
                                    src={image}
                                    alt={display(complaint.title, "Complaint image")}
                                    className="h-full w-full object-cover"
                                    onError={(event) => {
                                        event.currentTarget.style.display = "none";
                                        event.currentTarget.parentElement?.classList.add(
                                            "flex",
                                            "items-center",
                                            "justify-center"
                                        );
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex h-[220px] items-center justify-center bg-slate-50">
                                <div className="text-center">
                                    <ImageIcon size={42} className="mx-auto text-slate-300" />
                                    <p className="mt-2 text-sm font-semibold text-slate-500">
                                        No image submitted
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="p-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                Complaint
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                {display(complaint.title, "Untitled complaint")}
                            </h2>

                            <div className="mt-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <FileText size={17} className="text-blue-600" />

                                    <h3 className="font-bold text-slate-900">Description</h3>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                                    {display(complaint.description)}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <MapPin size={18} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">Complaint location</h3>

                                    <p className="text-xs text-slate-500">
                                        Location submitted by the citizen.
                                    </p>
                                </div>
                            </div>

                            {mapsUrl && (
                                <a
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                                >
                                    <Navigation size={14} />
                                    Open Maps
                                    <ExternalLink size={13} />
                                </a>
                            )}
                        </div>

                        <div className="p-5">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Address / location
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {display(complaint.location)}
                                </p>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Latitude
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-900">
                                        {display(latitude)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Longitude
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-900">
                                        {display(longitude)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {incidentId && (
                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <FileText size={18} />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900">Linked incident</h3>

                                        <p className="text-xs text-slate-500">
                                            This complaint is associated with an incident.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/officer/incidents/${incidentId}`)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                                >
                                    Incident #{incidentId}
                                    <ExternalLink size={14} />
                                </button>
                            </div>
                        </section>
                    )}
                </div>

                <aside className="space-y-4">
                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <UserRound size={18} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">Citizen information</h3>

                                    <p className="text-xs text-slate-500">
                                        Contact details of the reporter.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 p-5">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Name
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">{citizenName}</p>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone size={16} className="mt-0.5 shrink-0 text-slate-400" />

                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Phone
                                    </p>

                                    {citizenPhone ? (
                                        <a
                                            href={`tel:${citizenPhone}`}
                                            className="mt-1 block break-all text-sm font-semibold text-blue-700 hover:underline"
                                        >
                                            {citizenPhone}
                                        </a>
                                    ) : (
                                        <p className="mt-1 text-sm text-slate-500">Not available</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail size={16} className="mt-0.5 shrink-0 text-slate-400" />

                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Email
                                    </p>

                                    {citizenEmail ? (
                                        <a
                                            href={`mailto:${citizenEmail}`}
                                            className="mt-1 block break-all text-sm font-semibold text-blue-700 hover:underline"
                                        >
                                            {citizenEmail}
                                        </a>
                                    ) : (
                                        <p className="mt-1 text-sm text-slate-500">Not available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                    <FileText size={18} />
                                </div>

                                <h3 className="font-bold text-slate-900">Complaint information</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-5 p-5">
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Problem type
                                </p>

                                <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-900">
                                    {display(complaint.problemType)}
                                </p>
                            </div>

                            <div className="min-w-0">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Priority
                                </p>

                                <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-900">
                                    {display(complaint.priority)}
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-1.5">
                                    <CalendarDays size={14} className="text-slate-400" />

                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Submitted
                                    </p>
                                </div>

                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {formatDate(complaint.createdAt)}
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-1.5">
                                    <Clock3 size={14} className="text-slate-400" />

                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Updated
                                    </p>
                                </div>

                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {formatDate(complaint.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </section>

                    <button
                        onClick={() => navigate(`/officer/complaints/${complaintId}/history`)}
                        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-blue-200 hover:bg-blue-50/30"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                <History size={18} />
                            </div>

                            <div>
                                <p className="font-bold text-slate-900">Complaint history</p>

                                <p className="text-xs text-slate-500">
                                    View status changes and activity.
                                </p>
                            </div>
                        </div>

                        <ExternalLink size={17} className="text-slate-400" />
                    </button>
                </aside>
            </div>

            {showStatusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <div>
                                <h2 className="font-bold text-slate-900">Update complaint</h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Change the complaint status.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 p-5">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(event) => setStatus(event.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                                >
                                    <option value="">Select status</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Remarks
                                </label>

                                <textarea
                                    value={remarks}
                                    onChange={(event) => setRemarks(event.target.value)}
                                    rows={4}
                                    placeholder="Add optional remarks..."
                                    className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500"
                                />
                            </div>

                            {updateError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {updateError}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={updateComplaintStatus}
                                    disabled={updating}
                                    className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {updating ? "Updating..." : "Update status"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OfficerComplaintDetails;