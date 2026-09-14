import {
    useEffect,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    AlertTriangle,
    FileText,
    RefreshCw,
} from "lucide-react";

import {
    getMyComplaints,
} from "../../../api/complaintApi";

function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL");

    const loadComplaints = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyComplaints();

            setComplaints(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                "Unable to load your complaints."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComplaints();
    }, []);

    const filteredComplaints =
        filter === "ALL"
            ? complaints
            : complaints.filter(
                (complaint) =>
                    complaint.status === filter
            );

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <RefreshCw
                    size={28}
                    className="animate-spin text-blue-600"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        My Complaints
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        View and track complaints you have submitted.
                    </p>
                </div>

                <Link
                    to="/citizen/complaints/create"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Submit Complaint
                </Link>
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertTriangle size={18} />

                    <div className="flex-1">
                        {error}
                    </div>

                    <button
                        type="button"
                        onClick={loadComplaints}
                        className="font-semibold underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                {[
                    "ALL",
                    "PENDING",
                    "ASSIGNED",
                    "IN_PROGRESS",
                    "RESOLVED",
                    "REJECTED",
                ].map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => setFilter(status)}
                        className={`
                            rounded-lg
                            border
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            transition
                            ${filter === status
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }
                        `}
                    >
                        {status === "ALL"
                            ? "All"
                            : formatStatus(status)}
                    </button>
                ))}
            </div>

            {filteredComplaints.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <FileText
                        size={32}
                        className="mx-auto text-slate-300"
                    />

                    <h2 className="mt-4 font-semibold text-slate-900">
                        No complaints found
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        There are no complaints matching this filter.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredComplaints.map(
                        (complaint) => (
                            <ComplaintCard
                                key={complaint.id}
                                complaint={complaint}
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
}

function ComplaintCard({
    complaint,
}) {
    return (
        <Link
            to={`/citizen/complaints/${complaint.id}`}
            className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-400">
                        Complaint #{complaint.id}
                    </p>

                    <h2 className="mt-1 truncate font-semibold text-slate-900">
                        {complaint.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {complaint.description}
                    </p>
                </div>

                <StatusBadge
                    status={complaint.status}
                />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
                <Info
                    label="Department"
                    value={complaint.department}
                />

                <Info
                    label="Priority"
                    value={complaint.priority}
                />

                <Info
                    label="District"
                    value={complaint.district}
                />

                <Info
                    label="Created"
                    value={formatDate(complaint.createdAt)}
                />
            </div>
        </Link>
    );
}

function Info({
    label,
    value,
}) {
    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 truncate text-xs font-medium text-slate-700">
                {value || "—"}
            </p>
        </div>
    );
}

function StatusBadge({
    status,
}) {
    const styles = {
        PENDING:
            "bg-amber-50 text-amber-700 border-amber-200",

        ASSIGNED:
            "bg-blue-50 text-blue-700 border-blue-200",

        IN_PROGRESS:
            "bg-indigo-50 text-indigo-700 border-indigo-200",

        RESOLVED:
            "bg-emerald-50 text-emerald-700 border-emerald-200",

        REJECTED:
            "bg-red-50 text-red-700 border-red-200",
    };

    return (
        <span
            className={`
                inline-flex
                shrink-0
                rounded-full
                border
                px-3
                py-1.5
                text-xs
                font-semibold
                ${styles[status] ||
                "bg-slate-50 text-slate-600 border-slate-200"
                }
            `}
        >
            {formatStatus(status)}
        </span>
    );
}

function formatStatus(status) {
    if (!status) {
        return "Unknown";
    }

    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            (letter) => letter.toUpperCase()
        );
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}

export default MyComplaints;