import React, { useEffect, useState } from "react";

import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    History,
    Loader2,
    RefreshCw,
    ShieldAlert,
    XCircle,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import {
    getIncidentHistory,
    getOfficerIncident,
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
    if (!status) return "Unknown";

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
            return <History size={15} />;
    }
};

function OfficerIncidentHistory() {
    const { incidentId } = useParams();

    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [incident, setIncident] = useState(null);

    const [loading, setLoading] = useState(true);

    const [incidentLoading, setIncidentLoading] = useState(true);

    const [error, setError] = useState("");

    const [incidentError, setIncidentError] = useState("");

    const loadIncident = async () => {
        try {
            setIncidentLoading(true);
            setIncidentError("");

            const data = await getOfficerIncident(incidentId);

            setIncident(data);
        } catch (err) {
            setIncidentError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to load incident."
            );
        } finally {
            setIncidentLoading(false);
        }
    };

    const loadHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getIncidentHistory(incidentId);

            let result = [];

            if (Array.isArray(data)) {
                result = data;
            } else if (Array.isArray(data?.content)) {
                result = data.content;
            } else if (Array.isArray(data?.data)) {
                result = data.data;
            }

            setHistory(result);
        } catch (err) {
            setHistory([]);

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Incident history could not be loaded because the server returned an error."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!incidentId) return;

        loadIncident();
        loadHistory();
    }, [incidentId]);

    if (loading && incidentLoading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-20 animate-pulse rounded-xl bg-slate-100"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <button
                        onClick={() =>
                            navigate(`/officer/incidents/${incidentId}`)
                        }
                        className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to incident
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Incident History
                        </h1>

                        {incident?.status && (
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${getStatusClasses(
                                    incident.status
                                )}`}
                            >
                                {getStatusIcon(incident.status)}
                                {formatStatus(incident.status)}
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        Status changes for incident #{incidentId}
                    </p>
                </div>

                <button
                    onClick={() => {
                        loadIncident();
                        loadHistory();
                    }}
                    disabled={loading || incidentLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {incident && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                        <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                                INCIDENT #{incident.id}
                            </p>

                            <h2 className="mt-1 truncate text-lg font-bold text-slate-900">
                                {incident.title || "Untitled incident"}
                            </h2>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-center">
                                <p className="text-[9px] font-bold uppercase tracking-wide text-blue-500">
                                    Reports
                                </p>

                                <p className="text-base font-bold leading-none text-blue-700">
                                    {incident.citizenReportCount ?? 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {incidentError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <ShieldAlert
                        size={18}
                        className="mt-0.5 shrink-0"
                    />

                    <span>{incidentError}</span>
                </div>
            )}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <ShieldAlert
                        size={18}
                        className="mt-0.5 shrink-0"
                    />

                    <div>
                        <p className="font-semibold">
                            Unable to load incident history
                        </p>

                        <p className="mt-1 text-xs">{error}</p>
                    </div>
                </div>
            )}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <History size={18} />
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Status History
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Every recorded status change for this incident.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-5">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2
                                size={28}
                                className="animate-spin text-blue-600"
                            />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="py-12 text-center">
                            <History
                                size={42}
                                className="mx-auto text-slate-300"
                            />

                            <p className="mt-4 font-semibold text-slate-700">
                                No status history available
                            </p>

                            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                                No status changes have been returned for this incident.
                            </p>

                            {error && (
                                <button
                                    onClick={loadHistory}
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
                                >
                                    <RefreshCw size={15} />
                                    Try Again
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute bottom-6 left-[15px] top-6 w-px bg-slate-200" />

                            <div className="space-y-5">
                                {history.map((item, index) => {
                                    const oldStatus = normalizeStatus(
                                        item?.oldStatus
                                    );

                                    const newStatus = normalizeStatus(
                                        item?.newStatus
                                    );

                                    return (
                                        <div
                                            key={item?.id ?? `history-${index}`}
                                            className="relative flex gap-4"
                                        >
                                            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                                                {getStatusIcon(newStatus)}
                                            </div>

                                            <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {oldStatus ? (
                                                            <>
                                                                <span
                                                                    className={`rounded-full border px-2 py-1 text-[11px] font-bold ${getStatusClasses(
                                                                        oldStatus
                                                                    )}`}
                                                                >
                                                                    {formatStatus(
                                                                        oldStatus
                                                                    )}
                                                                </span>

                                                                <span className="text-xs font-bold text-slate-400">
                                                                    →
                                                                </span>
                                                            </>
                                                        ) : null}

                                                        <span
                                                            className={`rounded-full border px-2 py-1 text-[11px] font-bold ${getStatusClasses(
                                                                newStatus
                                                            )}`}
                                                        >
                                                            {formatStatus(
                                                                newStatus
                                                            )}
                                                        </span>
                                                    </div>

                                                    <span className="text-xs font-medium text-slate-400">
                                                        {formatDate(
                                                            item?.changedAt
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-xs text-slate-500">
                                                    Status changed
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <div className="flex justify-start">
                <button
                    onClick={() =>
                        navigate(`/officer/incidents/${incidentId}`)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    <ArrowLeft size={16} />
                    Back to Incident Details
                </button>
            </div>
        </div>
    );
}

export default OfficerIncidentHistory;