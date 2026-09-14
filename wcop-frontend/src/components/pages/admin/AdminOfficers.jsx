import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    Search,
    Plus,
    Eye,
    Edit3,
    RefreshCw,
    Users,
    UserCheck,
    UserX,
    Building2,
    MapPin,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    ShieldCheck,
} from "lucide-react";

import {
    getAdminOfficers,
} from "../../../api/adminApi";


// =========================================================
// HELPERS
// =========================================================

const getFullName = (officer) => {
    const firstName = officer?.firstName || "";
    const lastName = officer?.lastName || "";

    const name = `${firstName} ${lastName}`.trim();

    return name || "Unnamed Officer";
};


const getEmployeeId = (officer) => {
    return officer?.staffProfile?.employeeId || "—";
};


const getDepartment = (officer) => {
    return officer?.staffProfile?.department || "Not assigned";
};


const getDistrict = (officer) => {
    return officer?.staffProfile?.district || "Not assigned";
};


const getEmail = (officer) => {
    return officer?.email || "—";
};


const getPhone = (officer) => {
    return officer?.phone || "—";
};


const getActive = (officer) => {
    if (typeof officer?.isActive === "boolean") {
        return officer.isActive;
    }

    if (typeof officer?.staffProfile?.active === "boolean") {
        return officer.staffProfile.active;
    }

    return false;
};


// =========================================================
// COMPONENT
// =========================================================

function AdminOfficers() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [officers, setOfficers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [departmentFilter, setDepartmentFilter] = useState("ALL");

    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 10;


    // =====================================================
    // LOAD OFFICERS
    // =====================================================

    const loadOfficers = useCallback(async (isRefresh = false) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getAdminOfficers();

            console.log(
                "ADMIN OFFICERS RESPONSE:",
                data
            );


            /*
             * Backend currently returns:
             *
             * [
             *   {
             *      id: 7,
             *      firstName: "...",
             *      lastName: "...",
             *      ...
             *      staffProfile: {
             *          employeeId: "...",
             *          department: "...",
             *          district: "...",
             *          active: true
             *      }
             *   }
             * ]
             */


            let result = [];

            if (Array.isArray(data)) {

                result = data;

            } else if (Array.isArray(data?.content)) {

                result = data.content;

            } else if (Array.isArray(data?.data)) {

                result = data.data;

            }


            setOfficers(result);

        } catch (err) {

            console.error(
                "ADMIN OFFICERS LOAD ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load officers. Please try again."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }

    }, []);


    useEffect(() => {

        loadOfficers();

    }, [loadOfficers]);


    // =====================================================
    // DEPARTMENTS
    // =====================================================

    const departments = useMemo(() => {

        const values = officers
            .map((officer) =>
                getDepartment(officer)
            )
            .filter(
                (department) =>
                    department &&
                    department !== "Not assigned"
            );

        return [...new Set(values)].sort();

    }, [officers]);


    // =====================================================
    // FILTER
    // =====================================================

    const filteredOfficers = useMemo(() => {

        const query = search
            .trim()
            .toLowerCase();


        return officers.filter((officer) => {

            const name =
                getFullName(officer).toLowerCase();

            const employeeId =
                getEmployeeId(officer).toLowerCase();

            const email =
                getEmail(officer).toLowerCase();

            const phone =
                getPhone(officer).toLowerCase();

            const department =
                getDepartment(officer).toLowerCase();

            const district =
                getDistrict(officer).toLowerCase();


            const matchesSearch =
                !query ||
                name.includes(query) ||
                employeeId.includes(query) ||
                email.includes(query) ||
                phone.includes(query) ||
                department.includes(query) ||
                district.includes(query);


            const active =
                getActive(officer);


            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" && active) ||
                (statusFilter === "INACTIVE" && !active);


            const matchesDepartment =
                departmentFilter === "ALL" ||
                getDepartment(officer) === departmentFilter;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesDepartment
            );

        });

    }, [
        officers,
        search,
        statusFilter,
        departmentFilter,
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredOfficers.length / pageSize
        )
    );


    const safePage = Math.min(
        currentPage,
        totalPages
    );


    const paginatedOfficers =
        filteredOfficers.slice(
            (safePage - 1) * pageSize,
            safePage * pageSize
        );


    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        statusFilter,
        departmentFilter,
    ]);


    // =====================================================
    // COUNTS
    // =====================================================

    const totalOfficers =
        officers.length;


    const activeOfficers =
        officers.filter(
            (officer) =>
                getActive(officer)
        ).length;


    const inactiveOfficers =
        totalOfficers - activeOfficers;


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50">

                <div className="border-b bg-white">

                    <div className="mx-auto max-w-7xl px-6 py-5">

                        <div className="animate-pulse">

                            <div className="h-7 w-56 rounded bg-slate-200" />

                            <div className="mt-3 h-4 w-80 rounded bg-slate-100" />

                        </div>

                    </div>

                </div>


                <div className="mx-auto max-w-7xl px-6 py-8">

                    <div className="grid gap-4 md:grid-cols-3">

                        {[1, 2, 3].map((item) => (

                            <div
                                key={item}
                                className="h-28 animate-pulse rounded-xl border bg-white"
                            />

                        ))}

                    </div>


                    <div className="mt-6 h-96 animate-pulse rounded-xl border bg-white" />

                </div>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="min-h-screen bg-slate-50">

                <div className="mx-auto max-w-4xl px-6 py-12">

                    <div className="rounded-xl border border-red-200 bg-white p-8">

                        <div className="flex items-start gap-4">

                            <div className="rounded-lg bg-red-50 p-3">

                                <AlertCircle className="h-6 w-6 text-red-600" />

                            </div>


                            <div className="flex-1">

                                <h2 className="font-semibold text-slate-900">

                                    Unable to load officers

                                </h2>

                                <p className="mt-1 text-sm text-slate-600">

                                    {error}

                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        loadOfficers()
                                    }
                                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                                >

                                    <RefreshCw className="h-4 w-4" />

                                    Try Again

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="border-b bg-white">

                <div className="mx-auto max-w-7xl px-6 py-5">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="rounded-lg bg-blue-50 p-2">

                                    <ShieldCheck className="h-6 w-6 text-blue-700" />

                                </div>

                                <div>

                                    <h1 className="text-xl font-bold text-slate-900">

                                        Officer Management

                                    </h1>

                                    <p className="mt-0.5 text-sm text-slate-500">

                                        Manage municipal field officers and their assignments

                                    </p>

                                </div>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/officers/create"
                                )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
                        >

                            <Plus className="h-4 w-4" />

                            Create Officer

                        </button>

                    </div>

                </div>

            </header>


            {/* =================================================
                CONTENT
            ================================================= */}

            <main className="mx-auto max-w-7xl px-6 py-8">


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <div className="grid gap-4 md:grid-cols-3">

                    <SummaryCard
                        icon={Users}
                        title="Total Officers"
                        value={totalOfficers}
                        description="Registered municipal officers"
                    />

                    <SummaryCard
                        icon={UserCheck}
                        title="Active Officers"
                        value={activeOfficers}
                        description="Currently active accounts"
                    />

                    <SummaryCard
                        icon={UserX}
                        title="Inactive Officers"
                        value={inactiveOfficers}
                        description="Inactive accounts"
                    />

                </div>


                {/* =================================================
                    FILTER BAR
                ================================================= */}

                <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">

                    <div className="grid gap-3 lg:grid-cols-[1fr_180px_200px_auto]">

                        {/* SEARCH */}

                        <div className="relative">

                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search by name, employee ID, department..."
                                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* STATUS */}

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >

                            <option value="ALL">
                                All Status
                            </option>

                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="INACTIVE">
                                Inactive
                            </option>

                        </select>


                        {/* DEPARTMENT */}

                        <select
                            value={departmentFilter}
                            onChange={(event) =>
                                setDepartmentFilter(
                                    event.target.value
                                )
                            }
                            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >

                            <option value="ALL">
                                All Departments
                            </option>

                            {departments.map(
                                (department) => (

                                    <option
                                        key={department}
                                        value={department}
                                    >
                                        {department}
                                    </option>

                                )
                            )}

                        </select>


                        {/* REFRESH */}

                        <button
                            type="button"
                            disabled={refreshing}
                            onClick={() =>
                                loadOfficers(true)
                            }
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >

                            <RefreshCw
                                className={`h-4 w-4 ${refreshing
                                        ? "animate-spin"
                                        : ""
                                    }`}
                            />

                            Refresh

                        </button>

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="mt-5 overflow-hidden rounded-xl border bg-white shadow-sm">

                    {/* TABLE HEADER */}

                    <div className="flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <h2 className="font-semibold text-slate-900">

                                Municipal Officers

                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">

                                {filteredOfficers.length} officer
                                {filteredOfficers.length === 1
                                    ? ""
                                    : "s"} found

                            </p>

                        </div>

                    </div>


                    {paginatedOfficers.length === 0 ? (

                        <div className="px-6 py-16 text-center">

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">

                                <Users className="h-6 w-6 text-slate-400" />

                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-900">

                                No officers found

                            </h3>

                            <p className="mt-1 text-sm text-slate-500">

                                Try changing your search or filter criteria.

                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead className="border-b bg-slate-50">

                                    <tr>

                                        <Th>
                                            Officer
                                        </Th>

                                        <Th>
                                            Employee ID
                                        </Th>

                                        <Th>
                                            Department
                                        </Th>

                                        <Th>
                                            District
                                        </Th>

                                        <Th>
                                            Contact
                                        </Th>

                                        <Th>
                                            Status
                                        </Th>

                                        <Th align="right">
                                            Actions
                                        </Th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y">

                                    {paginatedOfficers.map(
                                        (officer) => {

                                            /*
                                             * IMPORTANT:
                                             *
                                             * officer.id = database/user ID
                                             *
                                             * staffProfile.employeeId =
                                             * government employee ID
                                             */

                                            const officerId =
                                                officer?.id;

                                            const active =
                                                getActive(
                                                    officer
                                                );

                                            const name =
                                                getFullName(
                                                    officer
                                                );

                                            return (

                                                <tr
                                                    key={officerId}
                                                    className="transition hover:bg-slate-50"
                                                >

                                                    {/* OFFICER */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">

                                                                {name
                                                                    .charAt(0)
                                                                    .toUpperCase()}

                                                            </div>

                                                            <div className="min-w-0">

                                                                <p className="truncate text-sm font-semibold text-slate-900">

                                                                    {name}

                                                                </p>

                                                                <p className="mt-0.5 text-xs text-slate-500">

                                                                    {officer?.role ||
                                                                        "OFFICER"}

                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* EMPLOYEE ID */}

                                                    <td className="px-5 py-4">

                                                        <span className="font-mono text-sm font-medium text-slate-700">

                                                            {getEmployeeId(
                                                                officer
                                                            )}

                                                        </span>

                                                    </td>


                                                    {/* DEPARTMENT */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-2">

                                                            <Building2 className="h-4 w-4 text-slate-400" />

                                                            <span className="text-sm text-slate-700">

                                                                {getDepartment(
                                                                    officer
                                                                )}

                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* DISTRICT */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-2">

                                                            <MapPin className="h-4 w-4 text-slate-400" />

                                                            <span className="text-sm text-slate-700">

                                                                {getDistrict(
                                                                    officer
                                                                )}

                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* CONTACT */}

                                                    <td className="px-5 py-4">

                                                        <div className="space-y-1">

                                                            <div className="flex items-center gap-2">

                                                                <Mail className="h-3.5 w-3.5 text-slate-400" />

                                                                <span className="max-w-[190px] truncate text-xs text-slate-600">

                                                                    {getEmail(
                                                                        officer
                                                                    )}

                                                                </span>

                                                            </div>

                                                            <div className="flex items-center gap-2">

                                                                <Phone className="h-3.5 w-3.5 text-slate-400" />

                                                                <span className="text-xs text-slate-600">

                                                                    {getPhone(
                                                                        officer
                                                                    )}

                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td className="px-5 py-4">

                                                        {active ? (

                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">

                                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                                                Active

                                                            </span>

                                                        ) : (

                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">

                                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />

                                                                Inactive

                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center justify-end gap-2">

                                                            <Link
                                                                to={
                                                                    officerId
                                                                        ? `/admin/officers/${officerId}`
                                                                        : "#"
                                                                }
                                                                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${officerId
                                                                        ? "border-slate-200 text-slate-700 hover:bg-slate-50"
                                                                        : "pointer-events-none opacity-40"
                                                                    }`}
                                                            >

                                                                <Eye className="h-3.5 w-3.5" />

                                                                View

                                                            </Link>


                                                            <Link
                                                                to={
                                                                    officerId
                                                                        ? `/admin/officers/${officerId}/edit`
                                                                        : "#"
                                                                }
                                                                className={`inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 ${officerId
                                                                        ? "hover:bg-blue-100"
                                                                        : "pointer-events-none opacity-40"
                                                                    }`}
                                                            >

                                                                <Edit3 className="h-3.5 w-3.5" />

                                                                Edit

                                                            </Link>

                                                        </div>

                                                    </td>

                                                </tr>

                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}


                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    {filteredOfficers.length > 0 && (

                        <div className="flex items-center justify-between border-t px-5 py-4">

                            <p className="text-xs text-slate-500">

                                Showing{" "}

                                <span className="font-semibold text-slate-700">

                                    {(safePage - 1) *
                                        pageSize +
                                        1}

                                </span>

                                {" "}–{" "}

                                <span className="font-semibold text-slate-700">

                                    {Math.min(
                                        safePage *
                                        pageSize,
                                        filteredOfficers.length
                                    )}

                                </span>

                                {" "}of{" "}

                                <span className="font-semibold text-slate-700">

                                    {filteredOfficers.length}

                                </span>

                            </p>


                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    disabled={
                                        safePage <= 1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                Math.max(
                                                    1,
                                                    page - 1
                                                )
                                        )
                                    }
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    <ChevronLeft className="h-4 w-4" />

                                </button>


                                <span className="px-2 text-xs font-medium text-slate-600">

                                    Page {safePage} of {totalPages}

                                </span>


                                <button
                                    type="button"
                                    disabled={
                                        safePage >=
                                        totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                Math.min(
                                                    totalPages,
                                                    page + 1
                                                )
                                        )
                                    }
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    <ChevronRight className="h-4 w-4" />

                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
    icon: Icon,
    title,
    value,
    description,
}) {

    return (

        <div className="rounded-xl border bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">

                        {title}

                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">

                        {value}

                    </p>

                    <p className="mt-1 text-xs text-slate-500">

                        {description}

                    </p>

                </div>


                <div className="rounded-lg bg-blue-50 p-2.5">

                    <Icon className="h-5 w-5 text-blue-700" />

                </div>

            </div>

        </div>
    );
}


// =========================================================
// TABLE HEADER
// =========================================================

function Th({
    children,
    align = "left",
}) {

    return (

        <th
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${align === "right"
                    ? "text-right"
                    : "text-left"
                }`}
        >

            {children}

        </th>
    );
}


export default AdminOfficers;