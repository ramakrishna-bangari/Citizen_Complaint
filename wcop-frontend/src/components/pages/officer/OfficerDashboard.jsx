import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    FileText,
    RefreshCw,
    TrendingUp,
} from "lucide-react";

import {
    getOfficerIncidents,
} from "../../../api/officerApi";

import {
    useNavigate,
} from "react-router-dom";

function OfficerDashboard() {
    const navigate = useNavigate();

    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadDashboard = async (refresh = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await getOfficerIncidents();

            if (Array.isArray(response)) {
                setIncidents(response);
            } else if (Array.isArray(response?.content)) {
                setIncidents(response.content);
            } else if (Array.isArray(response?.data)) {
                setIncidents(response.data);
            } else {
                setIncidents([]);
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Unable to load officer dashboard.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const statistics = useMemo(() => {
        const total = incidents.length;

        const pending = incidents.filter(
            (item) =>
                String(item?.status || item?.incidentStatus || "").toUpperCase() === "PENDING"
        ).length;

        const assigned = incidents.filter(
            (item) =>
                String(item?.status || item?.incidentStatus || "").toUpperCase() === "ASSIGNED"
        ).length;

        const inProgress = incidents.filter(
            (item) =>
                String(item?.status || item?.incidentStatus || "").toUpperCase() === "IN_PROGRESS"
        ).length;

        const resolved = incidents.filter((item) =>
            ["RESOLVED", "CLOSED"].includes(
                String(item?.status || item?.incidentStatus || "").toUpperCase()
            )
        ).length;

        return {
            total,
            pending,
            assigned,
            inProgress,
            resolved,
        };
    }, [incidents]);

    const recentIncidents = incidents.slice(0, 5);

    const formatStatus = (status) => {
        return String(status || "UNKNOWN")
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="h-8 w-72 animate-pulse rounded-lg bg-slate-200" />

                    <div className="h-4 w-96 animate-pulse rounded bg-slate-200" />
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-32 animate-pulse rounded-2xl bg-white"
                        />
                    ))}
                </div>

                <div className="h-80 animate-pulse rounded-2xl bg-white" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Officer Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Monitor your assigned incidents and operational workload.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => loadDashboard(true)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
                >
                    <RefreshCw
                        size={16}
                        className={refreshing ? "animate-spin" : ""}
                    />

                    Refresh
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Incidents"
                    value={statistics.total}
                    icon={AlertTriangle}
                />

                <StatCard
                    title="Pending"
                    value={statistics.pending}
                    icon={Clock3}
                />

                <StatCard
                    title="In Progress"
                    value={statistics.assigned + statistics.inProgress}
                    icon={TrendingUp}
                />

                <StatCard
                    title="Resolved"
                    value={statistics.resolved}
                    icon={CheckCircle2}
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Recent Incidents
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Latest incidents assigned to you.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/officer/incidents")}
                            className="text-sm font-semibold text-slate-700 hover:text-slate-950"
                        >
                            View all
                        </button>
                    </div>

                    <div className="mt-6 divide-y divide-slate-100">
                        {recentIncidents.length === 0 ? (
                            <div className="py-12 text-center">
                                <AlertTriangle
                                    size={32}
                                    className="mx-auto text-slate-300"
                                />

                                <p className="mt-3 text-sm font-medium text-slate-600">
                                    No incidents assigned.
                                </p>
                            </div>
                        ) : (
                            recentIncidents.map((incident, index) => {
                                const id = incident?.id ?? incident?.incidentId;

                                const status =
                                    incident?.status ??
                                    incident?.incidentStatus ??
                                    "UNKNOWN";

                                const title =
                                    incident?.title ??
                                    incident?.subject ??
                                    incident?.incidentTitle ??
                                    "Incident";

                                return (
                                    <button
                                        type="button"
                                        key={id ?? `incident-${index}`}
                                        onClick={() =>
                                            id != null &&
                                            navigate(`/officer/incidents/${id}`)
                                        }
                                        className="flex w-full items-center justify-between gap-4 py-4 text-left transition hover:bg-slate-50"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-800">
                                                #{id ?? "N/A"}
                                            </p>

                                            <p className="mt-1 truncate text-sm text-slate-500">
                                                {title}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                            {formatStatus(status)}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                            <FileText
                                size={19}
                                className="text-slate-700"
                            />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-900">
                                Workload
                            </h2>

                            <p className="text-xs text-slate-500">
                                Current status
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-5">
                        <WorkloadRow
                            label="Pending"
                            value={statistics.pending}
                        />

                        <WorkloadRow
                            label="Assigned"
                            value={statistics.assigned}
                        />

                        <WorkloadRow
                            label="In Progress"
                            value={statistics.inProgress}
                        />

                        <WorkloadRow
                            label="Resolved"
                            value={statistics.resolved}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Icon
                        size={19}
                        className="text-slate-700"
                    />
                </div>
            </div>
        </div>
    );
}

function WorkloadRow({
    label,
    value,
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">
                {label}
            </span>

            <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-800">
                {value}
            </span>
        </div>
    );
}

export default OfficerDashboard;