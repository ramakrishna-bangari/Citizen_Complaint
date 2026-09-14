import React, { useEffect, useMemo, useState } from "react";

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    ExternalLink,
    FileText,
    Image as ImageIcon,
    Info,
    Loader2,
    MapPin,
    MessageSquare,
    RefreshCw,
    ShieldAlert,
    Users,
    XCircle,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import {
    getOfficerIncident,
    updateOfficerIncidentStatus,
} from "../../../api/officerApi";

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

const formatStatus = (status) => {
    if (!status) return "UNKNOWN";

    return String(status)
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const normalizeStatus = (status) => {
    if (!status) return "";

    return String(status)
        .trim()
        .toUpperCase();
};

const getStatusClasses = (status) => {
    switch (normalizeStatus(status)) {
        case "OPEN":
            return "border-blue-200 bg-blue-50 text-blue-700";
        case "IN_PROGRESS":
            return "border-amber-200 bg-amber-50 text-amber-700";
        case "RESOLVED":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "REJECTED":
            return "border-red-200 bg-red-50 text-red-700";
        case "CLOSED":
            return "border-slate-200 bg-slate-100 text-slate-700";
        default:
            return "border-slate-200 bg-slate-50 text-slate-600";
    }
};

const getStatusIcon = (status) => {
    switch (normalizeStatus(status)) {
        case "RESOLVED":
            return <CheckCircle2 size={15} />;
        case "REJECTED":
            return <XCircle size={15} />;
        case "IN_PROGRESS":
            return <Clock3 size={15} />;
        default:
            return <Info size={15} />;
    }
};

const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    const value = String(imageUrl).trim();

    if (!value) return "";

    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("data:image/")
    ) {
        return value;
    }

    if (value.startsWith("/")) {
        return `http://localhost:8080${value}`;
    }

    return `http://localhost:8080/${value}`;
};

const openGoogleMaps = (latitude, longitude) => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    window.open(url, "_blank", "noopener,noreferrer");
};

function DetailRow({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="flex min-w-0 gap-3 border-b border-slate-100 py-3 last:border-b-0">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <Icon size={16} />
            </div>

            <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                    {value || "Not available"}
                </p>
            </div>
        </div>
    );
}

function SectionHeader({
    icon: Icon,
    title,
    description,
}) {
    return (
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon size={18} />
            </div>

            <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900">
                    {title}
                </h2>

                {description && (
                    <p className="mt-0.5 text-xs text-slate-500">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

function OfficerIncidentDetails() {
    const { incidentId } = useParams();
    const navigate = useNavigate();

    const [incident, setIncident] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("");
    const [remarks, setRemarks] = useState("");

    const imageUrl = useMemo(
        () => getImageUrl(incident?.imageUrl),
        [incident?.imageUrl]
    );

    const reportCount = Number(incident?.citizenReportCount ?? 0);

    const loadIncident = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const data = await getOfficerIncident(incidentId);

            setIncident(data);

            setSelectedStatus(normalizeStatus(data?.status));

            setRemarks("");
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to load incident details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (incidentId) {
            loadIncident();
        }
    }, [incidentId]);

    const handleStatusUpdate = async () => {
        if (!incidentId || !selectedStatus) {
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await updateOfficerIncidentStatus(incidentId, {
                status: selectedStatus,
                remarks: remarks.trim() || null,
            });

            setSuccess("Incident status updated successfully.");

            await loadIncident();
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to update incident status."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-52 animate-pulse rounded-lg bg-slate-200" />

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="h-[520px] animate-pulse rounded-2xl bg-slate-200" />

                    <div className="h-[360px] animate-pulse rounded-2xl bg-slate-200" />
                </div>
            </div>
        );
    }

    if (!incident) {
        return (
            <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
                <ShieldAlert
                    size={42}
                    className="mx-auto text-red-400"
                />

                <h2 className="mt-4 text-lg font-bold text-slate-900">
                    Incident not found
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    {error || "The requested incident could not be loaded."}
                </p>

                <button
                    onClick={() => navigate("/officer/incidents")}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
                >
                    <ArrowLeft size={16} />
                    Back to incidents
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <button
                        onClick={() => navigate("/officer/incidents")}
                        className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to Incidents
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Incident #{incident.id}
                        </h1>

                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${getStatusClasses(
                                incident.status
                            )}`}
                        >
                            {getStatusIcon(incident.status)}
                            {formatStatus(incident.status)}
                        </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        Review the reported civic incident and update its progress.
                    </p>
                </div>

                <button
                    onClick={loadIncident}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <ShieldAlert
                        size={18}
                        className="mt-0.5 shrink-0"
                    />

                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0"
                    />

                    <span>{success}</span>
                </div>
            )}

            <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="min-w-0 space-y-4">
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="relative bg-slate-100">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={incident.title || "Incident"}
                                    className="block max-h-[420px] w-full object-contain"
                                    onError={(event) => {
                                        event.currentTarget.style.display = "none";

                                        const fallback =
                                            event.currentTarget.parentElement?.querySelector(
                                                "[data-image-fallback]"
                                            );

                                        if (fallback) {
                                            fallback.classList.remove("hidden");
                                        }
                                    }}
                                />
                            ) : null}

                            <div
                                data-image-fallback
                                className={`flex min-h-[220px] items-center justify-center ${imageUrl ? "hidden" : ""
                                    }`}
                            >
                                <div className="text-center">
                                    <ImageIcon
                                        size={42}
                                        className="mx-auto text-slate-300"
                                    />

                                    <p className="mt-3 text-sm font-semibold text-slate-500">
                                        No image submitted
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        The citizen did not provide an image.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative px-5 py-5 pr-28">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                    INCIDENT #{incident.id}
                                </span>
                            </div>

                            <h2 className="mt-1 text-xl font-bold leading-tight text-slate-900">
                                {incident.title || "Untitled incident"}
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {incident.description || "No description provided."}
                            </p>

                            <div className="absolute bottom-5 right-5 flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-blue-200 bg-blue-50">
                                <Users
                                    size={16}
                                    className="text-blue-600"
                                />

                                <span className="mt-0.5 text-base font-bold leading-none text-blue-700">
                                    {reportCount}
                                </span>

                                <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wide text-blue-500">
                                    Reports
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={FileText}
                            title="Incident Information"
                            description="Information associated with this incident."
                        />

                        <div className="grid grid-cols-1 gap-x-8 px-5 md:grid-cols-2">
                            <DetailRow
                                icon={Info}
                                label="Problem / Incident"
                                value={incident.title}
                            />

                            <DetailRow
                                icon={Info}
                                label="Department"
                                value={incident.department}
                            />

                            <DetailRow
                                icon={MapPin}
                                label="District"
                                value={incident.district}
                            />

                            <DetailRow
                                icon={CalendarDays}
                                label="Created"
                                value={formatDate(incident.createdAt)}
                            />

                            <DetailRow
                                icon={Clock3}
                                label="Last Updated"
                                value={formatDate(incident.updatedAt)}
                            />
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <SectionHeader
                            icon={MapPin}
                            title="Incident Location"
                            description="Location captured when the incident was reported."
                        />

                        <div className="px-5 py-4">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                            Latitude
                                        </p>

                                        <p className="mt-1 font-mono text-sm font-bold text-slate-800">
                                            {incident.latitude ?? "Not available"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                            Longitude
                                        </p>

                                        <p className="mt-1 font-mono text-sm font-bold text-slate-800">
                                            {incident.longitude ?? "Not available"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    disabled={
                                        incident.latitude == null ||
                                        incident.longitude == null
                                    }
                                    onClick={() =>
                                        openGoogleMaps(
                                            incident.latitude,
                                            incident.longitude
                                        )
                                    }
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <MapPin size={17} />
                                    Open Exact Location in Google Maps
                                    <ExternalLink size={15} />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <aside className="min-w-0">
                    <section className="sticky top-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <RefreshCw size={18} />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        Update Incident
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Change the incident status.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 p-5">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                    Current Status
                                </p>

                                <div
                                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                                        incident.status
                                    )}`}
                                >
                                    {getStatusIcon(incident.status)}
                                    {formatStatus(incident.status)}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                                    New Status
                                </label>

                                <select
                                    value={selectedStatus}
                                    onChange={(event) =>
                                        setSelectedStatus(event.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="OPEN">
                                        Open
                                    </option>

                                    <option value="IN_PROGRESS">
                                        In Progress
                                    </option>

                                    <option value="RESOLVED">
                                        Resolved
                                    </option>

                                    <option value="REJECTED">
                                        Rejected
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                                    {selectedStatus === "REJECTED" ? (
                                        <>
                                            <XCircle size={14} />
                                            Rejection Reason / Remarks
                                        </>
                                    ) : (
                                        <>
                                            <MessageSquare size={14} />
                                            Remarks
                                        </>
                                    )}
                                </label>

                                <textarea
                                    value={remarks}
                                    onChange={(event) =>
                                        setRemarks(event.target.value)
                                    }
                                    rows={4}
                                    placeholder={
                                        selectedStatus === "REJECTED"
                                            ? "Enter the reason for rejecting this incident..."
                                            : "Add optional remarks about this status update..."
                                    }
                                    className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {selectedStatus === "REJECTED" && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                                    <div className="flex gap-2">
                                        <XCircle
                                            size={17}
                                            className="mt-0.5 shrink-0 text-red-600"
                                        />

                                        <p className="text-xs leading-5 text-red-700">
                                            This will mark the incident as rejected.
                                            Provide a clear reason in the remarks field.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleStatusUpdate}
                                disabled={saving || !selectedStatus}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={17} />
                                        Update Status
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/officer/incidents/${incident.id}/history`
                                    )
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                                <Clock3 size={17} />
                                View Incident History
                            </button>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default OfficerIncidentDetails;