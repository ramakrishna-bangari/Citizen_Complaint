import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

import {
    BarChart3,
    RefreshCw,
    Building2,
    MapPin,
    ShieldAlert,
    FileText,
    Activity,
} from "lucide-react";

import {
    getAdminAnalytics,
} from "../../../api/dashboardApi";


// =========================================================
// COLORS
// =========================================================

const CHART_COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#0891b2",
    "#db2777",
    "#65a30d",
];


// =========================================================
// DEFAULT DATA
// =========================================================

const EMPTY_ANALYTICS = {
    complaintsByDepartment: {},
    incidentsByDepartment: {},
    complaintsByDistrict: {},
    incidentsByDistrict: {},
    complaintsByPriority: {},
};


// =========================================================
// ADMIN ANALYTICS
// =========================================================

function AdminAnalytics() {

    const [analytics, setAnalytics] =
        useState(EMPTY_ANALYTICS);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [dataset, setDataset] =
        useState("complaintsByDepartment");

    const [chartType, setChartType] =
        useState("bar");


    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadAnalytics = useCallback(
        async (isRefresh = false) => {

            try {

                setError("");

                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const response =
                    await getAdminAnalytics();

                setAnalytics({
                    complaintsByDepartment:
                        response?.complaintsByDepartment || {},

                    incidentsByDepartment:
                        response?.incidentsByDepartment || {},

                    complaintsByDistrict:
                        response?.complaintsByDistrict || {},

                    incidentsByDistrict:
                        response?.incidentsByDistrict || {},

                    complaintsByPriority:
                        response?.complaintsByPriority || {},
                });

            } catch (err) {

                console.error(
                    "Admin analytics loading failed:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to load analytics."
                );

            } finally {

                setLoading(false);
                setRefreshing(false);

            }

        },
        []
    );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadAnalytics();

    }, [loadAnalytics]);


    // =====================================================
    // DATASET OPTIONS
    // =====================================================

    const datasetOptions = [

        {
            value: "complaintsByDepartment",
            label: "Complaints by Department",
            icon: Building2,
        },

        {
            value: "incidentsByDepartment",
            label: "Incidents by Department",
            icon: Building2,
        },

        {
            value: "complaintsByDistrict",
            label: "Complaints by District",
            icon: MapPin,
        },

        {
            value: "incidentsByDistrict",
            label: "Incidents by District",
            icon: MapPin,
        },

        {
            value: "complaintsByPriority",
            label: "Complaints by Priority",
            icon: ShieldAlert,
        },

    ];


    // =====================================================
    // PREPARE CHART DATA
    // =====================================================

    const chartData = useMemo(() => {

        const selectedData =
            analytics[dataset] || {};

        return Object.entries(selectedData)
            .map(([name, value]) => ({
                name,
                value: Number(value) || 0,
            }))
            .sort(
                (a, b) =>
                    b.value - a.value
            );

    }, [analytics, dataset]);


    // =====================================================
    // TOTAL
    // =====================================================

    const total = useMemo(() => {

        return chartData.reduce(
            (sum, item) =>
                sum + item.value,
            0
        );

    }, [chartData]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="flex min-h-[500px] items-center justify-center">

                <div className="text-center">

                    <RefreshCw
                        size={32}
                        className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                        Loading analytics...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="mx-auto max-w-7xl space-y-6">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">

                        <BarChart3 size={24} />

                    </div>

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Analytics
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Analyze complaints, incidents,
                            departments, districts and priorities.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        loadAnalytics(true)
                    }
                    disabled={refreshing}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-slate-700
                        shadow-sm
                        hover:bg-slate-50
                        disabled:opacity-50
                    "
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


            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {error && (

                <div className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-red-700
                ">

                    {error}

                </div>

            )}


            {/* ================================================= */}
            {/* SUMMARY CARDS */}
            {/* ================================================= */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <SummaryCard
                    title="Total Records"
                    value={total}
                    icon={FileText}
                />

                <SummaryCard
                    title="Categories"
                    value={chartData.length}
                    icon={Activity}
                />

                <SummaryCard
                    title="Departments"
                    value={
                        Object.keys(
                            analytics.complaintsByDepartment
                        ).length
                    }
                    icon={Building2}
                />

                <SummaryCard
                    title="Districts"
                    value={
                        Object.keys(
                            analytics.complaintsByDistrict
                        ).length
                    }
                    icon={MapPin}
                />

            </div>


            {/* ================================================= */}
            {/* CONTROLS */}
            {/* ================================================= */}

            <section className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
            ">

                <div className="
                    grid
                    gap-5
                    lg:grid-cols-2
                ">

                    {/* DATASET */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-slate-700
                        ">
                            Analyze
                        </label>

                        <select
                            value={dataset}
                            onChange={(e) =>
                                setDataset(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        >

                            {datasetOptions.map(
                                (item) => (

                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* CHART TYPE */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-slate-700
                        ">
                            Chart Type
                        </label>

                        <select
                            value={chartType}
                            onChange={(e) =>
                                setChartType(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        >

                            <option value="bar">
                                Bar Chart
                            </option>

                            <option value="line">
                                Line Chart
                            </option>

                            <option value="area">
                                Area Chart
                            </option>

                            <option value="pie">
                                Pie Chart
                            </option>

                        </select>

                    </div>

                </div>

            </section>


            {/* ================================================= */}
            {/* MAIN CHART */}
            {/* ================================================= */}

            <section className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
            ">

                <div className="
                    mb-6
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div>

                        <h2 className="
                            text-lg
                            font-bold
                            text-slate-900
                        ">
                            {datasetOptions.find(
                                (item) =>
                                    item.value === dataset
                            )?.label}
                        </h2>

                        <p className="
                            mt-1
                            text-sm
                            text-slate-500
                        ">
                            Visual representation of
                            current operational data.
                        </p>

                    </div>

                    <span className="
                        inline-flex
                        w-fit
                        rounded-full
                        bg-blue-50
                        px-3
                        py-1
                        text-xs
                        font-bold
                        text-blue-700
                    ">
                        {total} total
                    </span>

                </div>


                {chartData.length === 0 ? (

                    <div className="
                        flex
                        min-h-[400px]
                        items-center
                        justify-center
                        text-sm
                        text-slate-400
                    ">

                        No analytics data available.

                    </div>

                ) : (

                    <ChartRenderer
                        type={chartType}
                        data={chartData}
                    />

                )}

            </section>


            {/* ================================================= */}
            {/* DATA TABLE */}
            {/* ================================================= */}

            <section className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            ">

                <div className="border-b border-slate-200 p-5">

                    <h2 className="
                        text-base
                        font-bold
                        text-slate-900
                    ">
                        Detailed Breakdown
                    </h2>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="
                                    px-5
                                    py-3
                                    text-left
                                    font-semibold
                                    text-slate-600
                                ">
                                    Category
                                </th>

                                <th className="
                                    px-5
                                    py-3
                                    text-right
                                    font-semibold
                                    text-slate-600
                                ">
                                    Count
                                </th>

                                <th className="
                                    px-5
                                    py-3
                                    text-right
                                    font-semibold
                                    text-slate-600
                                ">
                                    Percentage
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                            {chartData.map(
                                (item) => {

                                    const percentage =
                                        total > 0
                                            ? (
                                                item.value /
                                                total
                                            ) * 100
                                            : 0;

                                    return (

                                        <tr
                                            key={item.name}
                                            className="hover:bg-slate-50"
                                        >

                                            <td className="
                                                px-5
                                                py-3
                                                font-medium
                                                text-slate-700
                                            ">
                                                {item.name}
                                            </td>

                                            <td className="
                                                px-5
                                                py-3
                                                text-right
                                                font-bold
                                                text-slate-900
                                            ">
                                                {item.value}
                                            </td>

                                            <td className="
                                                px-5
                                                py-3
                                                text-right
                                                text-slate-600
                                            ">
                                                {percentage.toFixed(1)}%
                                            </td>

                                        </tr>

                                    );

                                }
                            )}

                        </tbody>

                    </table>

                </div>

            </section>

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
}) {

    return (

        <div className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
        ">

            <div className="
                flex
                items-center
                justify-between
            ">

                <div>

                    <p className="
                        text-sm
                        font-medium
                        text-slate-500
                    ">
                        {title}
                    </p>

                    <p className="
                        mt-2
                        text-2xl
                        font-bold
                        text-slate-900
                    ">
                        {value}
                    </p>

                </div>

                <div className="
                    rounded-xl
                    bg-slate-100
                    p-3
                    text-slate-600
                ">

                    <Icon size={21} />

                </div>

            </div>

        </div>

    );

}


// =========================================================
// CHART RENDERER
// =========================================================

function ChartRenderer({
    type,
    data,
}) {

    if (type === "pie") {

        return (

            <div className="h-[450px] w-full">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            label
                        >

                            {data.map(
                                (_, index) => (

                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            CHART_COLORS[
                                            index %
                                            CHART_COLORS.length
                                            ]
                                        }
                                    />

                                )
                            )}

                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        );

    }


    if (type === "line") {

        return (

            <div className="h-[450px] w-full">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 10,
                            bottom: 60,
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="name"
                            angle={-30}
                            textAnchor="end"
                            interval={0}
                            height={80}
                        />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="value"
                            name="Count"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{
                                r: 5,
                            }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        );

    }


    if (type === "area") {

        return (

            <div className="h-[450px] w-full">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <AreaChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 10,
                            bottom: 60,
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="name"
                            angle={-30}
                            textAnchor="end"
                            interval={0}
                            height={80}
                        />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Area
                            type="monotone"
                            dataKey="value"
                            name="Count"
                            stroke="#2563eb"
                            fill="#93c5fd"
                            strokeWidth={2}
                        />

                    </AreaChart>

                </ResponsiveContainer>

            </div>

        );

    }


    // DEFAULT BAR CHART

    return (

        <div className="h-[450px] w-full">

            <ResponsiveContainer
                width="100%"
                height="100%"
            >

                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 10,
                        bottom: 70,
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="name"
                        angle={-30}
                        textAnchor="end"
                        interval={0}
                        height={90}
                    />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                        dataKey="value"
                        name="Count"
                        fill="#2563eb"
                        radius={[
                            6,
                            6,
                            0,
                            0,
                        ]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}


export default AdminAnalytics;