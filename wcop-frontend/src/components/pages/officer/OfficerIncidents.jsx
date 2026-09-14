import React, { useEffect, useState } from "react";
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Eye,
    MapPin,
    RefreshCw,
    Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getOfficerIncidentsPage } from "../../../api/officerApi";

const statusClass = (status) => {
    switch (status) {
        case "RESOLVED":
        case "CLOSED":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "IN_PROGRESS":
            return "border-blue-200 bg-blue-50 text-blue-700";
        case "ASSIGNED":
            return "border-violet-200 bg-violet-50 text-violet-700";
        default:
            return "border-amber-200 bg-amber-50 text-amber-700";
    }
};

const getMapUrl = (lat, lng) => {
    if (lat == null || lng == null) return null;

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
};

function OfficerIncidents() {
    const navigate = useNavigate();

    const [incidents, setIncidents] = useState([]);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(15);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const loadIncidents = async (refresh = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await getOfficerIncidentsPage({ page, size, status });

            const content = Array.isArray(response) ? response : response?.content || [];

            setIncidents(content);
            setTotalPages(response?.totalPages ?? 0);
            setTotalElements(response?.totalElements ?? content.length);
        } catch (err) {
            setError(err?.response?.data?.message || "Unable to load incidents.");
            setIncidents([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadIncidents();
    }, [page, status]);

    const visible = incidents.filter((incident) => {
        const value = [
            incident?.id,
            incident?.title,
            incident?.description,
            incident?.status,
            incident?.department,
            incident?.district,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return value.includes(search.toLowerCase());
    });

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Incidents</h1>
                    <p className="mt-1 text-sm text-slate-500">Monitor and update incidents assigned to you.</p>
                </div>

                <button
                    onClick={() => loadIncidents(true)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
                >
                    <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
                <div className="relative">
                    <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search incidents..."
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(0);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
                >
                    <option value="">All statuses</option>
                    <option value="OPEN">OPEN</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                </select>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="space-y-3 p-5">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100" />
                        ))}
                    </div>
                ) : visible.length === 0 ? (
                    <div className="py-20 text-center">
                        <AlertCircle size={42} className="mx-auto text-slate-300" />
                        <p className="mt-4 font-semibold text-slate-700">No incidents found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {visible.map((incident) => {
                            const mapUrl = getMapUrl(incident.latitude, incident.longitude);

                            return (
                                <div
                                    key={incident.id}
                                    className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 md:flex-row"
                                >
                                    {incident.imageUrl ? (
                                        <img
                                            src={incident.imageUrl}
                                            alt="Incident"
                                            className="h-28 w-full rounded-xl object-cover md:h-28 md:w-40"
                                        />
                                    ) : (
                                        <div className="flex h-28 w-full items-center justify-center rounded-xl bg-slate-100 md:w-40">
                                            <AlertCircle size={25} className="text-slate-400" />
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-bold text-slate-400">#{incident.id}</span>

                                            <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(incident.status)}`}>
                                                {(incident.status || "OPEN").replaceAll("_", " ")}
                                            </span>
                                        </div>

                                        <h2 className="mt-2 text-lg font-bold text-slate-900">{incident.title}</h2>

                                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                                            {incident.description}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                                            {incident.department && (
                                                <span>
                                                    Department: <b>{incident.department}</b>
                                                </span>
                                            )}

                                            {incident.district && (
                                                <span>
                                                    District: <b>{incident.district}</b>
                                                </span>
                                            )}

                                            <span>
                                                Reports: <b>{incident.citizenReportCount ?? 0}</b>
                                            </span>
                                        </div>

                                        {mapUrl && (
                                            <a
                                                href={mapUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600"
                                            >
                                                <MapPin size={14} />
                                                Open in Maps
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <button
                                            onClick={() => navigate(`/officer/incidents/${incident.id}`)}
                                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                <span className="text-sm text-slate-500">
                    {totalElements} incident{totalElements === 1 ? "" : "s"}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                    >
                        <ChevronLeft size={17} />
                    </button>

                    <span className="text-sm font-medium text-slate-600">Page {page + 1}</span>

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

export default OfficerIncidents;