import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Eye,
    FileImage,
    RefreshCw,
    Search,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    getAdminComplaints,
} from "../../../api/complaintApi";


const PAGE_SIZE = 15;

const STATUS_OPTIONS = [
    { value: "", label: "All statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "ASSIGNED", label: "Assigned" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "REJECTED", label: "Rejected" },
];

const PRIORITY_OPTIONS = [
    { value: "", label: "All priorities" },
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "CRITICAL", label: "Critical" },
];


function getStatusClasses(status) {
    const value = String(status || "").toUpperCase();
    switch (value) {
        case "RESOLVED": return "bg-emerald-50 text-emerald-700 ring-emerald-200";
        case "IN_PROGRESS": return "bg-blue-50 text-blue-700 ring-blue-200";
        case "ASSIGNED": return "bg-indigo-50 text-indigo-700 ring-indigo-200";
        case "REJECTED": return "bg-red-50 text-red-700 ring-red-200";
        case "PENDING": return "bg-amber-50 text-amber-700 ring-amber-200";
        default: return "bg-slate-50 text-slate-600 ring-slate-200";
    }
}


function getPriorityClasses(priority) {
    const value = String(priority || "").toUpperCase();
    switch (value) {
        case "CRITICAL": return "bg-red-100 text-red-700 ring-red-200";
        case "HIGH": return "bg-orange-50 text-orange-700 ring-orange-200";
        case "MEDIUM": return "bg-amber-50 text-amber-700 ring-amber-200";
        case "LOW": return "bg-emerald-50 text-emerald-700 ring-emerald-200";
        default: return "bg-slate-50 text-slate-600 ring-slate-200";
    }
}


function formatStatus(status) {
    if (!status) return "Unknown";
    return String(status)
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}


function formatPriority(priority) {
    if (!priority) return "Not set";
    return String(priority)
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}


function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}


function getComplaintImage(complaint) {
    return complaint?.imageUrl || null;
}

function getCitizenName(complaint) {
    return complaint?.citizenName || "Citizen";
}

function getCitizenEmail(complaint) {
    return complaint?.citizenEmail || "—";
}

function getOfficerName(complaint) {
    return complaint?.assignedOfficer || "Unassigned";
}


function StatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(status)}`}>
            {formatStatus(status)}
        </span>
    );
}


function PriorityBadge({ priority }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getPriorityClasses(priority)}`}>
            {formatPriority(priority)}
        </span>
    );
}


function LoadingState() {
    return (
        <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col items-center gap-3 text-center">
                <RefreshCw size={28} className="animate-spin text-blue-600" />
                <p className="text-sm font-medium text-slate-500">Loading complaints...</p>
            </div>
        </div>
    );
}


function EmptyState({ onRefresh }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Search size={22} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">No complaints found</h3>
            <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-slate-500">
                There are no complaints matching the current search or filters.
            </p>
            <button
                type="button"
                onClick={onRefresh}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
                <RefreshCw size={16} />
                Refresh
            </button>
        </div>
    );
}


function AdminComplaints() {

    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);


    const loadComplaints = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            setError("");

            const params = { page, size: PAGE_SIZE };

            if (status.trim()) params.status = status.trim();
            if (priority.trim()) params.priority = priority.trim();

            const response = await getAdminComplaints(params);
            const data = response?.data ?? response;

            const content = Array.isArray(data?.content)
                ? data.content
                : Array.isArray(data)
                    ? data
                    : [];

            setComplaints(content);
            setTotalPages(Number(data?.totalPages || 0));
            setTotalElements(Number(data?.totalElements || content.length || 0));

        } catch (err) {
            console.error("Failed to load admin complaints:", err);

            const backendMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.response?.data?.detail;

            if (err?.response?.status === 500) {
                setError(
                    backendMessage ||
                    "The server returned an error while loading complaints. Check the Spring Boot backend console."
                );
            } else {
                setError(backendMessage || err?.message || "Failed to load complaints.");
            }

            setComplaints([]);
            setTotalPages(0);
            setTotalElements(0);

        } finally {
            setLoading(false);
            setRefreshing(false);
        }

    }, [page, status, priority]);


    useEffect(() => {
        loadComplaints();
    }, [loadComplaints]);


    useEffect(() => {
        setPage(0);
    }, [status, priority]);


    const filteredComplaints = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return complaints;

        return complaints.filter((complaint) => {
            const values = [
                complaint?.id,
                complaint?.title,
                complaint?.description,
                complaint?.location,
                complaint?.department,
                complaint?.district,
                complaint?.citizenName,
                complaint?.citizenEmail,
                complaint?.citizenPhone,
                complaint?.problemType,
                complaint?.assignedOfficer,
                complaint?.status,
                complaint?.priority,
            ];

            return values.some((value) =>
                String(value ?? "").toLowerCase().includes(query)
            );
        });
    }, [complaints, search]);


    const handleViewComplaint = (complaint) => {
        if (!complaint?.id) return;
        navigate(`/admin/complaints/${complaint.id}`);
    };


    const clearFilters = () => {
        setSearch("");
        setStatus("");
        setPriority("");
        setPage(0);
    };


    if (loading) {
        return (
            <div className="mx-auto max-w-7xl space-y-6">
                <PageHeader onRefresh={() => loadComplaints(true)} refreshing={refreshing} />
                <LoadingState />
            </div>
        );
    }


    return (
        <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">

            <PageHeader onRefresh={() => loadComplaints(true)} refreshing={refreshing} />

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-red-800">Unable to load complaints</p>
                            <p className="mt-1 break-words text-sm leading-6 text-red-700">{error}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => loadComplaints(true)}
                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                        <RefreshCw size={15} />
                        Try again
                    </button>
                </div>
            )}

            {/* FILTERS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end">

                    <div className="min-w-0 flex-1">
                        <label htmlFor="complaint-search" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Search
                        </label>
                        <div className="relative">
                            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                id="complaint-search"
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search complaint, citizen, district, department..."
                                className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div className="w-full xl:w-48">
                        <label htmlFor="complaint-status" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Status
                        </label>
                        <select
                            id="complaint-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value || "all-status"} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full xl:w-48">
                        <label htmlFor="complaint-priority" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Priority
                        </label>
                        <select
                            id="complaint-priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                            {PRIORITY_OPTIONS.map((option) => (
                                <option key={option.value || "all-priority"} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(search || status || priority) && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="h-11 shrink-0 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* SUMMARY */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-700">
                        {totalElements} {totalElements === 1 ? "complaint" : "complaints"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                        Page {page + 1}{totalPages > 0 ? ` of ${totalPages}` : ""}
                    </p>
                </div>
                {search && (
                    <p className="text-xs text-slate-400">
                        Showing {filteredComplaints.length} matching this page
                    </p>
                )}
            </div>

            {filteredComplaints.length === 0 ? (

                <EmptyState onRefresh={() => loadComplaints(true)} />

            ) : (

                <>
                    {/* DESKTOP TABLE */}
                    <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1050px] border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Complaint</th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Citizen</th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Department</th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">District</th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Officer</th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</th>
                                        <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredComplaints.map((complaint) => {
                                        const image = getComplaintImage(complaint);
                                        return (
                                            <tr key={complaint.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                                            {image ? (
                                                                <img src={image} alt="" className="h-full w-full object-cover" />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                                    <FileImage size={16} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="max-w-[220px] truncate text-sm font-semibold text-slate-900">
                                                                {complaint.title || "Untitled complaint"}
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-slate-400">
                                                                #{complaint.id} · {formatDate(complaint.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <p className="max-w-[150px] truncate text-sm font-medium text-slate-700">
                                                        {getCitizenName(complaint)}
                                                    </p>
                                                    <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-400">
                                                        {getCitizenEmail(complaint)}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <p className="max-w-[160px] truncate text-sm text-slate-600">
                                                        {complaint.department || "Not assigned"}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <p className="max-w-[140px] truncate text-sm text-slate-600">
                                                        {complaint.district || "—"}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <p className="max-w-[160px] truncate text-sm text-slate-600">
                                                        {getOfficerName(complaint)}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <StatusBadge status={complaint.status} />
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <PriorityBadge priority={complaint.priority} />
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleViewComplaint(complaint)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                                    >
                                                        <Eye size={14} />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* MOBILE / TABLET */}
                    <div className="grid grid-cols-1 gap-4 lg:hidden">
                        {filteredComplaints.map((complaint) => {
                            const image = getComplaintImage(complaint);
                            return (
                                <article key={complaint.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    {image && (
                                        <div className="h-40 w-full bg-slate-100">
                                            <img src={image} alt="" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                    <div className="p-4 sm:p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-blue-600">
                                                    Complaint #{complaint.id}
                                                </p>
                                                <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-slate-900">
                                                    {complaint.title || "Untitled complaint"}
                                                </h3>
                                            </div>
                                            <StatusBadge status={complaint.status} />
                                        </div>

                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                                            {complaint.description || "No description available."}
                                        </p>

                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <InfoCell label="Citizen" value={getCitizenName(complaint)} />
                                            <InfoCell label="Priority" value={formatPriority(complaint.priority)} />
                                            <InfoCell label="Department" value={complaint.department || "Not assigned"} />
                                            <InfoCell label="District" value={complaint.district || "—"} />
                                            <InfoCell label="Officer" value={getOfficerName(complaint)} />
                                            <InfoCell label="Created" value={formatDate(complaint.createdAt)} />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleViewComplaint(complaint)}
                                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            <Eye size={16} />
                                            View Complaint
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Page <span className="font-semibold text-slate-700">{page + 1}</span> of{" "}
                                <span className="font-semibold text-slate-700">{totalPages}</span>
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={page <= 0 || refreshing}
                                    onClick={() => setPage((c) => Math.max(0, c - 1))}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    disabled={page >= totalPages - 1 || refreshing}
                                    onClick={() => setPage((c) => Math.min(totalPages - 1, c + 1))}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function PageHeader({ onRefresh, refreshing }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Complaints
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Review citizen complaints, priorities, assignments and supporting evidence.
                </p>
            </div>

            <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                Refresh
            </button>
        </div>
    );
}

function InfoCell({ label, value }) {
    return (
        <div className="min-w-0 rounded-lg bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 truncate text-xs font-semibold text-slate-700">{value || "—"}</p>
        </div>
    );
}


export default AdminComplaints;