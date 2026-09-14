import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    AlertCircle,
    CheckCircle2,
    Clock3,
    LoaderCircle,
    RefreshCw,
} from "lucide-react";

import {
    getComplaintHistory,
} from "../../../api/complaintApi";

function ComplaintHistory() {
    const {
        complaintId,
    } = useParams();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadHistory = async () => {
            try {
                setLoading(true);
                setError("");

                if (!complaintId) {
                    setError("Complaint ID is missing.");
                    return;
                }

                const response = await getComplaintHistory(
                    complaintId
                );

                if (!mounted) {
                    return;
                }

                let historyData = [];

                if (Array.isArray(response)) {
                    historyData = response;
                } else if (Array.isArray(response?.content)) {
                    historyData = response.content;
                } else if (Array.isArray(response?.data)) {
                    historyData = response.data;
                } else if (
                    Array.isArray(response?.data?.content)
                ) {
                    historyData = response.data.content;
                }

                setHistory(historyData);
            } catch (err) {
                if (!mounted) {
                    return;
                }

                const message =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Unable to load complaint history.";

                setError(message);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadHistory();

        return () => {
            mounted = false;
        };
    }, [complaintId]);

    const handleRetry = () => {
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="text-center">
                    <LoaderCircle
                        size={34}
                        className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-4 text-sm font-medium text-slate-600">
                        Loading complaint history...
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Please wait while we retrieve the updates.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
                <Link
                    to={`/citizen/complaints/${complaintId}`}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
                >
                    <ArrowLeft size={17} />
                    Back to Complaint
                </Link>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <AlertCircle size={22} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-base font-bold text-red-900">
                                Unable to load complaint history
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-red-700">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={handleRetry}
                                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <Link
                to={`/citizen/complaints/${complaintId}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
                <ArrowLeft size={17} />
                Back to Complaint
            </Link>

            <div className="mt-6 border-b border-slate-200 pb-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                            Complaint Updates
                        </p>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Complaint History
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            View the status updates and actions
                            recorded for your complaint.
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Complaint ID
                        </p>

                        <p className="mt-0.5 text-sm font-bold text-slate-700">
                            #{complaintId}
                        </p>
                    </div>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Clock3 size={27} />
                    </div>

                    <h2 className="mt-4 text-base font-bold text-slate-800">
                        No updates available
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        There are currently no status updates
                        recorded for this complaint.
                    </p>

                    <Link
                        to={`/citizen/complaints/${complaintId}`}
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        <ArrowLeft size={16} />
                        View Complaint
                    </Link>
                </div>
            ) : (
                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute bottom-5 left-[19px] top-5 hidden w-px bg-slate-200 sm:block" />

                        <div className="space-y-5">
                            {history.map((item, index) => (
                                <HistoryItem
                                    key={
                                        item.id ??
                                        `${item.status ?? item.newStatus ?? "update"}-${index}`
                                    }
                                    item={item}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function HistoryItem({
    item,
    index,
}) {
    const status =
        item?.status ??
        item?.newStatus ??
        item?.statusName ??
        "UNKNOWN";

    const oldStatus =
        item?.oldStatus ??
        item?.previousStatus ??
        item?.fromStatus ??
        null;

    const note =
        item?.note ??
        item?.remarks ??
        item?.description ??
        item?.reason ??
        null;

    const changedBy =
        item?.changedBy ??
        item?.updatedBy ??
        item?.createdBy ??
        item?.userName ??
        "Municipal Officer";

    const date =
        item?.createdAt ??
        item?.changedAt ??
        item?.updatedAt ??
        item?.timestamp ??
        null;

    const normalizedStatus = String(status).toUpperCase();

    const isResolved =
        normalizedStatus === "RESOLVED" ||
        normalizedStatus === "CLOSED";

    const isRejected = normalizedStatus === "REJECTED";

    return (
        <div className="relative flex gap-4">
            <div className="relative z-10 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm sm:flex">
                {isResolved ? (
                    <CheckCircle2
                        size={19}
                        className="text-green-600"
                    />
                ) : isRejected ? (
                    <AlertCircle
                        size={19}
                        className="text-red-600"
                    />
                ) : (
                    <Clock3
                        size={19}
                        className="text-blue-600"
                    />
                )}
            </div>

            <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 sm:hidden">
                            {isResolved ? (
                                <CheckCircle2
                                    size={18}
                                    className="text-green-600"
                                />
                            ) : isRejected ? (
                                <AlertCircle
                                    size={18}
                                    className="text-red-600"
                                />
                            ) : (
                                <Clock3
                                    size={18}
                                    className="text-blue-600"
                                />
                            )}
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                                {formatStatus(status)}
                            </h2>

                            {oldStatus && (
                                <p className="mt-1 text-xs text-slate-400">
                                    Previous status:{" "}
                                    <span className="font-medium text-slate-500">
                                        {formatStatus(oldStatus)}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>

                    {date && (
                        <time className="shrink-0 text-xs font-medium text-slate-400">
                            {formatDate(date)}
                        </time>
                    )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />

                    <p className="text-xs text-slate-500">
                        Updated by{" "}
                        <span className="font-semibold text-slate-700">
                            {changedBy}
                        </span>
                    </p>
                </div>

                {note && (
                    <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3">
                        <p className="text-sm leading-6 text-slate-600">
                            {note}
                        </p>
                    </div>
                )}

                {index === 0 && !note && (
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                        This update has been recorded in the
                        complaint tracking system.
                    </p>
                )}
            </div>
        </div>
    );
}

function formatStatus(status) {
    if (!status) {
        return "Unknown";
    }

    return String(status)
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            (character) => character.toUpperCase()
        );
}

function formatDate(value) {
    if (!value) {
        return "";
    }

    try {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    } catch {
        return String(value);
    }
}

export default ComplaintHistory;