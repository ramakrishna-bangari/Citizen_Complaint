import React, { useEffect, useState } from "react";
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Filter,
    MapPin,
    RefreshCw,
    Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    getOfficerComplaintsPage,
} from "../../../api/officerApi";

const STATUS_OPTIONS = [
    "",
    "PENDING",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
    "REJECTED",
];

const PRIORITY_OPTIONS = [
    "",
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
];

const statusClass = (status) => {
    switch (status) {
        case "RESOLVED":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "IN_PROGRESS":
            return "bg-blue-50 text-blue-700 border-blue-200";
        case "ASSIGNED":
            return "bg-violet-50 text-violet-700 border-violet-200";
        case "REJECTED":
            return "bg-red-50 text-red-700 border-red-200";
        default:
            return "bg-amber-50 text-amber-700 border-amber-200";
    }
};

const priorityClass = (priority) => {
    switch (priority) {
        case "CRITICAL":
            return "text-red-700 bg-red-50 border-red-200";
        case "HIGH":
            return "text-orange-700 bg-orange-50 border-orange-200";
        case "MEDIUM":
            return "text-amber-700 bg-amber-50 border-amber-200";
        default:
            return "text-slate-600 bg-slate-50 border-slate-200";
    }
};

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

function OfficerComplaints() {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const [size] = useState(15);

    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const loadComplaints = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await getOfficerComplaintsPage({
                page,
                size,
                status,
                priority,
            });

            const content = Array.isArray(response) ? response : response?.content || [];

            setComplaints(content);

            setTotalPages(response?.totalPages ?? (content.length < size ? page + 1 : page + 2));
            setTotalElements(response?.totalElements ?? content.length);
        } catch (err) {
            setError(err?.response?.data?.message || "Unable to load complaints.");
            setComplaints([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadComplaints();
    }, [page, status, priority]);

    const filteredComplaints = complaints.filter((complaint) => {
        const text = [
            complaint?.id,
            complaint?.title,
            complaint?.description,
            complaint?.location,
            complaint?.problemType,
            complaint?.priority,
            complaint?.status,
            complaint?.citizenName,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return text.includes(search.toLowerCase());
    });

    const handleFilter = (setter, value) => {
        setter(value);
        setPage(0);
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Complaints</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Review and manage complaints assigned to your department.
                    </p>
                </div>

                <button
                    onClick={() => loadComplaints(true)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                >
                    <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
                <div className="relative">
                    <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search complaints..."
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-400"
                    />
                </div>

                <div className="relative">
                    <Filter
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                        value={status}
                        onChange={(e) => handleFilter(setStatus, e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-400"
                    >
                        <option value="">All statuses</option>
                        {STATUS_OPTIONS.filter(Boolean).map((item) => (
                            <option key={item} value={item}>
                                {item.replaceAll("_", " ")}
                            </option>
                        ))}
                    </select>
                </div>

                <select
                    value={priority}
                    onChange={(e) => handleFilter(setPriority, e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                >
                    <option value="">All priorities</option>
                    {PRIORITY_OPTIONS.filter(Boolean).map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="space-y-3 p-5">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-24 animate-pulse rounded-xl bg-slate-100"
                            />
                        ))}
                    </div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="py-20 text-center">
                        <AlertCircle size={42} className="mx-auto text-slate-300" />

                        <p className="mt-4 font-semibold text-slate-700">
                            No complaints found
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            Try changing your filters or search.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden grid-cols-[70px_minmax(220px,1.5fr)_180px_130px_130px_90px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 lg:grid">
                            <div>ID</div>
                            <div>Complaint</div>
                            <div>Citizen</div>
                            <div>Priority</div>
                            <div>Status</div>
                            <div></div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {filteredComplaints.map((complaint) => (
                                <div
                                    key={complaint.id}
                                    className="grid gap-4 px-5 py-5 transition hover:bg-slate-50 lg:grid-cols-[70px_minmax(220px,1.5fr)_180px_130px_130px_90px] lg:items-center"
                                >
                                    <div className="text-sm font-bold text-slate-700">
                                        #{complaint.id}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-start gap-3">
                                            {complaint.imageUrl ? (
                                                <img
                                                    src={complaint.imageUrl}
                                                    alt="Complaint"
                                                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                                    <AlertCircle size={20} className="text-slate-400" />
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <h2 className="truncate font-semibold text-slate-900">
                                                    {complaint.title || "Complaint"}
                                                </h2>

                                                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                                    {complaint.description || "No description"}
                                                </p>

                                                <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                                                    <MapPin size={13} />
                                                    <span className="truncate">
                                                        {complaint.location || "Location unavailable"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-slate-800">
                                            {complaint.citizenName || "Citizen"}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                            <Clock size={12} />
                                            {formatDate(complaint.createdAt)}
                                        </p>
                                    </div>

                                    <div>
                                        <span
                                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${priorityClass(
                                                complaint.priority
                                            )}`}
                                        >
                                            {complaint.priority || "LOW"}
                                        </span>
                                    </div>

                                    <div>
                                        <span
                                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(
                                                complaint.status
                                            )}`}
                                        >
                                            {(complaint.status || "PENDING").replaceAll("_", " ")}
                                        </span>
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => navigate(`/officer/complaints/${complaint.id}`)}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                                        >
                                            <Eye size={14} />
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-sm text-slate-500">
                    {totalElements} complaint{totalElements === 1 ? "" : "s"}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                    >
                        <ChevronLeft size={17} />
                    </button>

                    <span className="min-w-20 text-center text-sm font-medium text-slate-600">
                        Page {page + 1}
                        {totalPages ? ` / ${totalPages}` : ""}
                    </span>

                    <button
                        disabled={totalPages > 0 && page >= totalPages - 1}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                    >
                        <ChevronRight size={17} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OfficerComplaints;