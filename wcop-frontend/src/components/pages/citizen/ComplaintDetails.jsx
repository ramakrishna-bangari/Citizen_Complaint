import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    AlertTriangle,
    ArrowLeft,
    Clock3,
    FileText,
    MapPin,
    RefreshCw,
} from "lucide-react";

import {
    getComplaintById,
} from "../../../api/complaintApi";

function ComplaintDetails() {
    const {
        complaintId,
    } = useParams();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadComplaint = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getComplaintById(
                    complaintId
                );

                if (!mounted) {
                    return;
                }

                setComplaint(response);
            } catch (error) {
                if (!mounted) {
                    return;
                }

                setError(
                    error?.response?.data?.message ||
                    "Unable to load complaint details."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        if (complaintId) {
            loadComplaint();
        } else {
            setError("Complaint ID is missing.");
            setLoading(false);
        }

        return () => {
            mounted = false;
        };
    }, [complaintId]);

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="text-center">
                    <RefreshCw
                        size={28}
                        className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                        Loading complaint...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-3">
                    <AlertTriangle
                        size={20}
                        className="mt-0.5 shrink-0 text-red-600"
                    />

                    <div>
                        <h2 className="font-semibold text-red-800">
                            Unable to load complaint
                        </h2>

                        <p className="mt-1 text-sm text-red-700">
                            {error}
                        </p>

                        <Link
                            to="/citizen/complaints"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                            <ArrowLeft size={16} />
                            Back to Complaints
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!complaint) {
        return null;
    }

    const status = complaint.status || "UNKNOWN";
    const isRejected = status === "REJECTED";
    const statusStyle = getStatusStyle(status);

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <Link
                to="/citizen/complaints"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
                <ArrowLeft size={16} />
                My Complaints
            </Link>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Complaint #{complaint.id}
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {complaint.title}
                    </h1>
                </div>

                <span
                    className={`
                        inline-flex
                        w-fit
                        items-center
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        ${statusStyle}
                    `}
                >
                    {formatStatus(status)}
                </span>
            </div>

            {isRejected && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-600"
                        />

                        <div>
                            <h2 className="font-semibold text-red-800">
                                Complaint Rejected
                            </h2>

                            {complaint.rejectionReason && (
                                <p className="mt-2 text-sm font-semibold text-red-700">
                                    Reason:{" "}
                                    {formatStatus(
                                        complaint.rejectionReason
                                    )}
                                </p>
                            )}

                            {complaint.rejectionNote && (
                                <p className="mt-1 text-sm leading-6 text-red-700">
                                    {complaint.rejectionNote}
                                </p>
                            )}

                            {complaint.rejectedBy && (
                                <p className="mt-2 text-xs text-red-600">
                                    Rejected by{" "}
                                    {complaint.rejectedBy}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <FileText
                                size={19}
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-semibold text-slate-900">
                                Complaint Description
                            </h2>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                            {complaint.description}
                        </p>
                    </section>

                    {complaint.imageUrl && (
                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="p-6 pb-4">
                                <h2 className="text-base font-semibold text-slate-900">
                                    Supporting Evidence
                                </h2>
                            </div>

                            <img
                                src={complaint.imageUrl}
                                alt="Complaint evidence"
                                className="max-h-[500px] w-full bg-slate-100 object-contain"
                            />
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-900">
                            Complaint Details
                        </h2>

                        <div className="mt-5 space-y-5">
                            <Detail
                                label="District"
                                value={
                                    complaint.district ||
                                    "Not available"
                                }
                            />

                            <Detail
                                label="Department"
                                value={
                                    complaint.department ||
                                    "Under classification"
                                }
                            />

                            <Detail
                                label="Problem Type"
                                value={
                                    complaint.problemType
                                        ? formatStatus(
                                            complaint.problemType
                                        )
                                        : "Under classification"
                                }
                            />

                            <Detail
                                label="Priority"
                                value={
                                    complaint.priority
                                        ? formatStatus(
                                            complaint.priority
                                        )
                                        : "Under classification"
                                }
                            />

                            <Detail
                                label="Assigned Officer"
                                value={
                                    complaint.assignedOfficer ||
                                    "Not assigned"
                                }
                            />
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <MapPin
                                size={19}
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-semibold text-slate-900">
                                Location
                            </h2>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-600">
                            {complaint.location ||
                                "Location not provided."}
                        </p>

                        {(
                            complaint.latitude != null &&
                            complaint.longitude != null
                        ) && (
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <Coordinate
                                        label="Latitude"
                                        value={complaint.latitude}
                                    />

                                    <Coordinate
                                        label="Longitude"
                                        value={complaint.longitude}
                                    />
                                </div>
                            )}
                    </section>

                    <Link
                        to={`/citizen/complaints/${complaint.id}/history`}
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        <Clock3 size={17} />
                        View Complaint History
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:justify-between">
                <span>
                    Created:{" "}
                    {formatDate(complaint.createdAt)}
                </span>

                <span>
                    Updated:{" "}
                    {formatDate(complaint.updatedAt)}
                </span>
            </div>
        </div>
    );
}

function Detail({
    label,
    value,
}) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1.5 text-sm font-medium text-slate-700">
                {value}
            </p>
        </div>
    );
}

function Coordinate({
    label,
    value,
}) {
    return (
        <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 break-all text-xs font-medium text-slate-600">
                {value}
            </p>
        </div>
    );
}

function getStatusStyle(status) {
    switch (status) {
        case "PENDING":
            return "bg-amber-50 text-amber-700";

        case "ASSIGNED":
            return "bg-blue-50 text-blue-700";

        case "IN_PROGRESS":
            return "bg-indigo-50 text-indigo-700";

        case "RESOLVED":
            return "bg-emerald-50 text-emerald-700";

        case "REJECTED":
            return "bg-red-50 text-red-700";

        default:
            return "bg-slate-100 text-slate-700";
    }
}

function formatStatus(status) {
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
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    );
}

export default ComplaintDetails;