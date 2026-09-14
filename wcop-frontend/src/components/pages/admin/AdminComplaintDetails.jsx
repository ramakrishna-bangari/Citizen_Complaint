import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    User,
    Mail,
    Phone,
    Building2,
    ShieldCheck,
    Image as ImageIcon,
    ExternalLink,
    RefreshCw,
    AlertCircle,
    XCircle,
} from "lucide-react";

import { getAdminComplaintById } from "../../../api/adminApi";


const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};


const getStatusStyle = (status) => {
    const value = String(status || "").toUpperCase();

    if (value === "RESOLVED" || value === "COMPLETED") {
        return { badge: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" };
    }
    if (value === "IN_PROGRESS" || value === "INPROGRESS" || value === "PROCESSING") {
        return { badge: "bg-blue-50 text-blue-700 ring-blue-200", dot: "bg-blue-500" };
    }
    if (value === "REJECTED") {
        return { badge: "bg-red-50 text-red-700 ring-red-200", dot: "bg-red-500" };
    }
    return { badge: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" };
};


const getPriorityStyle = (priority) => {
    const value = String(priority || "").toUpperCase();

    if (value === "HIGH" || value === "CRITICAL") {
        return "bg-red-50 text-red-700 ring-red-200";
    }
    if (value === "MEDIUM") {
        return "bg-orange-50 text-orange-700 ring-orange-200";
    }
    return "bg-slate-50 text-slate-600 ring-slate-200";
};


function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-3">
            {Icon && (
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon size={15} />
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-400">{label}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
}


function SectionCard({ icon: Icon, title, children, className = "" }) {
    return (
        <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
                {Icon && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Icon size={16} />
                    </div>
                )}
                <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}


export default function AdminComplaintDetails() {

    const { complaintId } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [imageOpen, setImageOpen] = useState(false);


    const loadComplaint = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminComplaintById(complaintId);
            setComplaint(data);

        } catch (err) {
            console.error("Complaint details loading failed:", err);
            setError(
                err?.response?.data?.message ||
                "Unable to load complaint details."
            );
        } finally {
            setLoading(false);
        }
    }, [complaintId]);


    useEffect(() => {
        loadComplaint();
    }, [loadComplaint]);


    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
                <div className="text-center">
                    <RefreshCw size={28} className="mx-auto mb-3 animate-spin text-blue-600" />
                    <p className="text-sm text-slate-500">Loading complaint...</p>
                </div>
            </div>
        );
    }


    if (error || !complaint) {
        return (
            <div className="min-h-[70vh] bg-slate-50 p-6">
                <button
                    onClick={() => navigate("/admin/complaints")}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft size={16} />
                    Back to complaints
                </button>

                <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <AlertCircle size={24} className="text-red-500" />
                    </div>
                    <h2 className="font-semibold text-slate-900">Unable to load complaint</h2>
                    <p className="mt-1.5 text-sm text-slate-500">
                        {error || "Complaint not found."}
                    </p>
                    <button
                        onClick={loadComplaint}
                        className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }


    const statusStyle = getStatusStyle(complaint.status);
    const hasRejection =
        complaint.rejectionReason ||
        complaint.rejectionNote ||
        complaint.rejectedBy ||
        complaint.rejectedAt;


    return (
        <div className="min-h-screen bg-slate-50">

            {/* HEADER */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/complaints")}
                        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600"
                    >
                        <ArrowLeft size={15} />
                        Complaints
                    </button>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                <span>Complaint</span>
                                <span>·</span>
                                <span className="font-mono">#{complaint.id}</span>
                            </div>
                            <h1 className="mt-1 break-words text-xl font-bold text-slate-900 sm:text-2xl">
                                {complaint.title || "Untitled complaint"}
                            </h1>
                            <p className="mt-1.5 text-xs text-slate-400">
                                Submitted {formatDate(complaint.createdAt)}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyle.badge}`}
                            >
                                <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                                {complaint.status || "OPEN"}
                            </span>

                            {complaint.priority && (
                                <span
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getPriorityStyle(complaint.priority)}`}
                                >
                                    {complaint.priority}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {/* BODY */}
            <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                    {/* MAIN COLUMN */}
                    <div className="space-y-5 lg:col-span-2">

                        <SectionCard icon={AlertCircle} title="Description">
                            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                                {complaint.description || "No description provided."}
                            </p>
                        </SectionCard>

                        {complaint.imageUrl && (
                            <SectionCard icon={ImageIcon} title="Photo Evidence">
                                <button
                                    type="button"
                                    onClick={() => setImageOpen(true)}
                                    className="group block w-full overflow-hidden rounded-xl bg-slate-50"
                                >
                                    <img
                                        src={complaint.imageUrl}
                                        alt="Complaint"
                                        className="max-h-[420px] w-full object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                </button>
                                <p className="mt-2.5 text-center text-xs text-slate-400">
                                    Click to view full size
                                </p>
                            </SectionCard>
                        )}

                        <SectionCard icon={Building2} title="Classification & Location">
                            <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                                <div className="sm:pr-5">
                                    <DetailRow icon={Building2} label="Department" value={complaint.department} />
                                    <DetailRow icon={MapPin} label="District" value={complaint.district} />
                                    <DetailRow label="Problem Type" value={complaint.problemType} />
                                </div>
                                <div className="sm:pl-5">
                                    <DetailRow icon={MapPin} label="Location" value={complaint.location} />
                                    <DetailRow
                                        label="Coordinates"
                                        value={
                                            complaint.latitude != null && complaint.longitude != null
                                                ? `${complaint.latitude}, ${complaint.longitude}`
                                                : "—"
                                        }
                                    />
                                </div>
                            </div>
                        </SectionCard>

                        {complaint.incidentId && (
                            <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                        Related Incident
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        Incident #{complaint.incidentId}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Linked to this civic issue's incident record
                                    </p>
                                </div>
                                <Link
                                    to={`/admin/incidents/${complaint.incidentId}`}
                                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    View Incident
                                    <ExternalLink size={14} />
                                </Link>
                            </div>
                        )}

                        {hasRejection && (
                            <div className="rounded-2xl border border-red-100 bg-red-50/60 p-5">
                                <div className="flex items-center gap-2 text-red-700">
                                    <XCircle size={16} />
                                    <h2 className="text-sm font-semibold">Rejection Details</h2>
                                </div>

                                <div className="mt-3 space-y-3">
                                    {complaint.rejectionReason && (
                                        <div>
                                            <p className="text-xs font-medium text-red-500">Reason</p>
                                            <p className="mt-0.5 text-sm text-red-800">{complaint.rejectionReason}</p>
                                        </div>
                                    )}
                                    {complaint.rejectionNote && (
                                        <div>
                                            <p className="text-xs font-medium text-red-500">Note</p>
                                            <p className="mt-0.5 whitespace-pre-wrap text-sm text-red-800">
                                                {complaint.rejectionNote}
                                            </p>
                                        </div>
                                    )}
                                    {complaint.rejectedBy && (
                                        <div>
                                            <p className="text-xs font-medium text-red-500">Rejected By</p>
                                            <p className="mt-0.5 text-sm text-red-800">{complaint.rejectedBy}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>


                    {/* SIDEBAR */}
                    <div className="space-y-5">

                        <SectionCard icon={User} title="Citizen">
                            <DetailRow icon={User} label="Name" value={complaint.citizenName} />
                            <DetailRow icon={Mail} label="Email" value={complaint.citizenEmail} />
                            <DetailRow icon={Phone} label="Phone" value={complaint.citizenPhone} />
                        </SectionCard>

                        <SectionCard icon={ShieldCheck} title="Assigned Officer">
                            <DetailRow
                                icon={User}
                                label="Officer"
                                value={complaint.assignedOfficer || "Unassigned"}
                            />
                            <DetailRow
                                icon={ShieldCheck}
                                label="Employee ID"
                                value={complaint.assignedOfficerEmployeeId}
                            />
                        </SectionCard>

                        <SectionCard icon={CalendarDays} title="Timeline">
                            <DetailRow icon={CalendarDays} label="Created" value={formatDate(complaint.createdAt)} />
                            <DetailRow icon={CalendarDays} label="Last Updated" value={formatDate(complaint.updatedAt)} />
                        </SectionCard>
                    </div>
                </div>
            </main>


            {/* IMAGE LIGHTBOX */}
            {imageOpen && complaint.imageUrl && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
                    onClick={() => setImageOpen(false)}
                >
                    <div
                        className="relative flex max-h-[95vh] max-w-[95vw] items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={complaint.imageUrl}
                            alt="Complaint full size"
                            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                        />
                        <button
                            type="button"
                            onClick={() => setImageOpen(false)}
                            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}