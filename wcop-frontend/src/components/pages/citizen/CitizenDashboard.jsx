import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
} from "recharts";
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock3,
    FileText,
    Loader2,
    RefreshCw,
    UserCheck,
} from "lucide-react";
import { getCitizenDashboard } from "../../../api/dashboardApi";

const STATUS_COLORS = [
    "#f59e0b",
    "#6366f1",
    "#3b82f6",
    "#16a34a",
];

function CitizenDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchDashboard = useCallback(
        async (isRefresh = false) => {
            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }
                setError("");
                const data = await getCitizenDashboard();
                setDashboard(data);
            } catch (err) {
                const status = err?.response?.status;
                if (status === 401) {
                    setError(
                        "Your session has expired. Please sign in again."
                    );
                } else if (status === 403) {
                    setError(
                        "You do not have permission to access this dashboard."
                    );
                } else {
                    setError(
                        err?.response?.data?.message ||
                        "Unable to load dashboard."
                    );
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const total = Number(dashboard?.totalComplaints ?? 0);
    const pending = Number(dashboard?.pendingComplaints ?? 0);
    const assigned = Number(dashboard?.assignedComplaints ?? 0);
    const inProgress = Number(dashboard?.inProgressComplaints ?? 0);
    const resolved = Number(dashboard?.resolvedComplaints ?? 0);
    const high = Number(dashboard?.highPriorityComplaints ?? 0);
    const medium = Number(dashboard?.mediumPriorityComplaints ?? 0);
    const low = Number(dashboard?.lowPriorityComplaints ?? 0);
    const active = assigned + inProgress;

    const statusData = useMemo(
        () => [
            {
                name: "Pending",
                value: pending,
            },
            {
                name: "Assigned",
                value: assigned,
            },
            {
                name: "In Progress",
                value: inProgress,
            },
            {
                name: "Resolved",
                value: resolved,
            },
        ].filter(item => item.value > 0),
        [
            pending,
            assigned,
            inProgress,
            resolved,
        ]
    );

    const priorityData = useMemo(
        () => [
            {
                name: "High",
                complaints: high,
            },
            {
                name: "Medium",
                complaints: medium,
            },
            {
                name: "Low",
                complaints: low,
            },
        ],
        [
            high,
            medium,
            low,
        ]
    );

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="flex flex-col items-center">
                        <Loader2
                            className="animate-spin text-blue-700"
                            size={34}
                        />
                        <p className="mt-3 text-sm text-slate-500">
                            Loading dashboard
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-6">
                <div className="mx-auto max-w-lg">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                <AlertCircle size={21} />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-semibold text-slate-900">
                                    Dashboard unavailable
                                </h2>
                                <p className="mt-1 text-sm leading-5 text-slate-500">
                                    {error}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => fetchDashboard(true)}
                                    disabled={refreshing}
                                    className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
                                >
                                    <RefreshCw
                                        size={16}
                                        className={
                                            refreshing
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
            <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
                <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm">
                            <FileText size={21} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                                Citizen Dashboard
                            </h1>
                            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                                Overview of your complaints
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => fetchDashboard(true)}
                        disabled={refreshing}
                        aria-label="Refresh dashboard"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 sm:w-auto sm:gap-2 sm:px-3"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />
                        <span className="hidden text-sm font-medium sm:block">
                            Refresh
                        </span>
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatCard
                        title="Total Complaints"
                        value={total}
                        icon={<FileText size={19} />}
                        iconStyle="bg-blue-50 text-blue-700"
                    />
                    <StatCard
                        title="Pending"
                        value={pending}
                        icon={<Clock3 size={19} />}
                        iconStyle="bg-amber-50 text-amber-600"
                    />
                    <StatCard
                        title="Active"
                        value={active}
                        icon={<Activity size={19} />}
                        iconStyle="bg-indigo-50 text-indigo-600"
                    />
                    <StatCard
                        title="Resolved"
                        value={resolved}
                        icon={<CheckCircle2 size={19} />}
                        iconStyle="bg-green-50 text-green-600"
                    />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <AnalyticsCard
                        title="Complaint Status"
                        subtitle="Current status of your complaints"
                        icon={<Activity size={18} />}
                    >
                        {statusData.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="h-[310px] sm:h-[350px]">
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="43%"
                                            innerRadius="54%"
                                            outerRadius="72%"
                                            paddingAngle={3}
                                            stroke="#ffffff"
                                            strokeWidth={3}
                                        >
                                            {statusData.map(
                                                (item, index) => (
                                                    <Cell
                                                        key={item.name}
                                                        fill={
                                                            STATUS_COLORS[
                                                            index %
                                                            STATUS_COLORS.length
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [
                                                value,
                                                "Complaints",
                                            ]}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={45}
                                            iconType="circle"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </AnalyticsCard>
                    <AnalyticsCard
                        title="Complaint Priority"
                        subtitle="Number of complaints by priority"
                        icon={<AlertCircle size={18} />}
                    >
                        <div className="h-[310px] sm:h-[350px]">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={priorityData}
                                    margin={{
                                        top: 20,
                                        right: 12,
                                        left: 0,
                                        bottom: 10,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 12,
                                        }}
                                    />
                                    <YAxis
                                        type="number"
                                        domain={[0, "auto"]}
                                        allowDecimals={false}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 11,
                                        }}
                                        width={35}
                                    />
                                    <Tooltip
                                        cursor={{
                                            fill: "rgba(15, 23, 42, 0.04)",
                                        }}
                                        formatter={(value) => [
                                            value,
                                            "Complaints",
                                        ]}
                                    />
                                    <Bar
                                        dataKey="complaints"
                                        name="Complaints"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={55}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </AnalyticsCard>
                </div>
                <div className="mt-4">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                                Priority Overview
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Your complaints grouped by priority
                            </p>
                        </div>
                        <div className="grid grid-cols-3 divide-x divide-slate-100">
                            <PriorityItem
                                label="High"
                                value={high}
                                icon={<AlertCircle size={17} />}
                                style="text-red-600"
                            />
                            <PriorityItem
                                label="Medium"
                                value={medium}
                                icon={<Activity size={17} />}
                                style="text-amber-600"
                            />
                            <PriorityItem
                                label="Low"
                                value={low}
                                icon={<CheckCircle2 size={17} />}
                                style="text-green-600"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <SmallStatus
                        label="Pending"
                        value={pending}
                        icon={<Clock3 size={16} />}
                    />
                    <SmallStatus
                        label="Assigned"
                        value={assigned}
                        icon={<UserCheck size={16} />}
                    />
                    <SmallStatus
                        label="In Progress"
                        value={inProgress}
                        icon={<Activity size={16} />}
                    />
                    <SmallStatus
                        label="Resolved"
                        value={resolved}
                        icon={<CheckCircle2 size={16} />}
                    />
                </div>
            </div>
        </main>
    );
}

function StatCard({
    title,
    value,
    icon,
    iconStyle,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
            <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconStyle}`}
            >
                {icon}
            </div>
            <p className="mt-3 text-xs font-medium text-slate-500 sm:text-sm">
                {title}
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {value}
            </p>
        </div>
    );
}

function AnalyticsCard({
    title,
    subtitle,
    icon,
    children,
}) {
    return (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                        {title}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        {subtitle}
                    </p>
                </div>
                <div className="ml-3 shrink-0 text-slate-400">
                    {icon}
                </div>
            </div>
            {children}
        </section>
    );
}

function PriorityItem({
    label,
    value,
    icon,
    style,
}) {
    return (
        <div className="px-3 py-4 sm:px-5 sm:py-5">
            <div className={`flex items-center gap-1.5 ${style}`}>
                {icon}
                <span className="text-xs font-semibold sm:text-sm">
                    {label}
                </span>
            </div>
            <p className="mt-1.5 text-xl font-bold text-slate-900 sm:text-2xl">
                {value}
            </p>
        </div>
    );
}

function SmallStatus({
    label,
    value,
    icon,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex items-center gap-1.5 text-slate-400">
                {icon}
                <span className="truncate text-[11px] font-medium sm:text-xs">
                    {label}
                </span>
            </div>
            <p className="mt-1.5 text-xl font-bold text-slate-900 sm:text-2xl">
                {value}
            </p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex h-[310px] items-center justify-center sm:h-[350px]">
            <div className="text-center">
                <FileText
                    size={32}
                    className="mx-auto text-slate-300"
                />
                <p className="mt-2 text-sm text-slate-500">
                    No complaint data available
                </p>
            </div>
        </div>
    );
}

export default CitizenDashboard;