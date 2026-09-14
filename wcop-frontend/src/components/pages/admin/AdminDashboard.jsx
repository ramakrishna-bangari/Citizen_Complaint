import {
    AlertTriangle,
    BarChart3,
    Building2,
    CheckCircle2,
    Clock3,
    FileText,
    MapPin,
    RefreshCw,
    Users,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getAdminDashboard,
} from "../../../api/dashboardApi";


// =========================================================
// ADMIN DASHBOARD
// =========================================================

function AdminDashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD
    // =====================================================

    const loadDashboard = useCallback(
        async (refresh = false) => {

            try {

                setError("");

                if (refresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const data =
                    await getAdminDashboard();

                setDashboard(data);

            } catch (err) {

                console.error(
                    "Admin dashboard loading failed:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to load admin dashboard."
                );

            } finally {

                setLoading(false);
                setRefreshing(false);

            }
        },
        []
    );


    useEffect(() => {

        loadDashboard();

    }, [loadDashboard]);


    const complaintTotal =
        Number(
            dashboard?.totalComplaints
        ) || 0;


    const incidentTotal =
        Number(
            dashboard?.totalIncidents
        ) || 0;


    const complaintStatus = useMemo(
        () => [
            {
                label: "Pending",
                value:
                    dashboard?.pendingComplaints || 0,
                icon: Clock3,
                className:
                    "bg-amber-50 text-amber-700",
            },
            {
                label: "Assigned",
                value:
                    dashboard?.assignedComplaints || 0,
                icon: Users,
                className:
                    "bg-violet-50 text-violet-700",
            },
            {
                label: "In Progress",
                value:
                    dashboard?.inProgressComplaints || 0,
                icon: RefreshCw,
                className:
                    "bg-blue-50 text-blue-700",
            },
            {
                label: "Resolved",
                value:
                    dashboard?.resolvedComplaints || 0,
                icon: CheckCircle2,
                className:
                    "bg-emerald-50 text-emerald-700",
            },
        ],
        [dashboard]
    );


    const incidentStatus = useMemo(
        () => [
            {
                label: "Open",
                value:
                    dashboard?.openIncidents || 0,
                icon: AlertTriangle,
                className:
                    "bg-red-50 text-red-700",
            },
            {
                label: "Assigned",
                value:
                    dashboard?.assignedIncidents || 0,
                icon: Users,
                className:
                    "bg-violet-50 text-violet-700",
            },
            {
                label: "In Progress",
                value:
                    dashboard?.inProgressIncidents || 0,
                icon: Clock3,
                className:
                    "bg-amber-50 text-amber-700",
            },
            {
                label: "Resolved",
                value:
                    dashboard?.resolvedIncidents || 0,
                icon: CheckCircle2,
                className:
                    "bg-emerald-50 text-emerald-700",
            },
        ],
        [dashboard]
    );


    const priority = useMemo(
        () => [
            {
                label: "High",
                value:
                    dashboard?.highPriorityComplaints || 0,
                className:
                    "bg-red-500",
            },
            {
                label: "Medium",
                value:
                    dashboard?.mediumPriorityComplaints || 0,
                className:
                    "bg-amber-500",
            },
            {
                label: "Low",
                value:
                    dashboard?.lowPriorityComplaints || 0,
                className:
                    "bg-emerald-500",
            },
        ],
        [dashboard]
    );


    if (loading) {

        return (
            <div className="flex min-h-[500px] items-center justify-center">

                <div className="text-center">

                    <RefreshCw
                        size={30}
                        className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                        Loading dashboard...
                    </p>

                </div>

            </div>
        );
    }


    return (
        <div className="mx-auto max-w-7xl space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Admin Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Monitor complaints, incidents and operational activity.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        loadDashboard(true)
                    }
                    disabled={refreshing}
                    className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
                >

                    <RefreshCw
                        size={16}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* ERROR */}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}


            {/* MAIN TOTALS */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <SummaryCard
                    title="Total Complaints"
                    value={complaintTotal}
                    icon={FileText}
                    description="All registered complaints"
                />

                <SummaryCard
                    title="Total Incidents"
                    value={incidentTotal}
                    icon={AlertTriangle}
                    description="All operational incidents"
                />

                <SummaryCard
                    title="Departments"
                    value={
                        dashboard?.totalDepartments || 0
                    }
                    icon={Building2}
                    description="Registered departments"
                />

                <SummaryCard
                    title="Users"
                    value={
                        dashboard?.totalUsers || 0
                    }
                    icon={Users}
                    description="Registered platform users"
                />

            </div>


            {/* COMPLAINT STATUS */}

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <SectionTitle
                    title="Complaint Status"
                    icon={FileText}
                />

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {complaintStatus.map(
                        (item) => (

                            <MetricCard
                                key={item.label}
                                {...item}
                            />

                        )
                    )}

                </div>

            </section>


            {/* INCIDENT STATUS */}

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <SectionTitle
                    title="Incident Status"
                    icon={AlertTriangle}
                />

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {incidentStatus.map(
                        (item) => (

                            <MetricCard
                                key={item.label}
                                {...item}
                            />

                        )
                    )}

                </div>

            </section>


            {/* PRIORITY */}

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <SectionTitle
                    title="Complaint Priority"
                    icon={BarChart3}
                />

                <div className="mt-6 space-y-5">

                    {priority.map(
                        (item) => {

                            const percentage =
                                complaintTotal > 0
                                    ? Math.min(
                                        100,
                                        (Number(item.value) /
                                            complaintTotal) *
                                        100
                                    )
                                    : 0;

                            return (
                                <div key={item.label}>

                                    <div className="mb-2 flex items-center justify-between">

                                        <span className="text-sm font-semibold text-slate-700">
                                            {item.label}
                                        </span>

                                        <span className="text-sm font-bold text-slate-900">
                                            {item.value}
                                        </span>

                                    </div>

                                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                                        <div
                                            className={`h-full rounded-full ${item.className}`}
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>

            </section>


            {/* OPERATIONAL SUMMARY */}

            <div className="grid gap-6 lg:grid-cols-2">

                <OperationalCard
                    title="Incident Resolution"
                    icon={CheckCircle2}
                    resolved={
                        dashboard?.resolvedIncidents || 0
                    }
                    total={incidentTotal}
                />

                <OperationalCard
                    title="Unassigned Incidents"
                    icon={MapPin}
                    resolved={
                        dashboard?.unassignedIncidents || 0
                    }
                    total={incidentTotal}
                    inverse
                />

            </div>

        </div>
    );
}


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
    title,
    value,
    icon: Icon,
    description,
}) {

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </p>

                </div>


                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <Icon size={21} />
                </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
                {description}
            </p>

        </div>
    );
}


// =========================================================
// METRIC CARD
// =========================================================

function MetricCard({
    label,
    value,
    icon: Icon,
    className,
}) {

    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-xs font-semibold text-slate-500">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        {value}
                    </p>

                </div>


                <div className={`rounded-lg p-2.5 ${className}`}>
                    <Icon size={18} />
                </div>

            </div>

        </div>
    );
}


// =========================================================
// SECTION TITLE
// =========================================================

function SectionTitle({
    title,
    icon: Icon,
}) {

    return (
        <div className="flex items-center gap-3">

            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Icon size={18} />
            </div>

            <h2 className="text-base font-bold text-slate-900">
                {title}
            </h2>

        </div>
    );
}


// =========================================================
// OPERATIONAL CARD
// =========================================================

function OperationalCard({
    title,
    icon: Icon,
    resolved,
    total,
    inverse = false,
}) {

    const percentage =
        total > 0
            ? Math.min(
                100,
                (Number(resolved) / total) * 100
            )
            : 0;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Icon size={18} />
                </div>

                <h2 className="font-bold text-slate-900">
                    {title}
                </h2>

            </div>


            <div className="mt-5 flex items-end justify-between">

                <div>

                    <p className="text-3xl font-bold text-slate-900">
                        {resolved}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {inverse
                            ? "currently unassigned"
                            : "resolved incidents"}
                    </p>

                </div>

                <p className="text-sm font-bold text-slate-600">
                    {percentage.toFixed(0)}%
                </p>

            </div>


            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>

        </div>
    );
}


export default AdminDashboard;