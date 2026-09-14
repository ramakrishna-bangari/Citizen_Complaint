import { useCallback, useEffect, useState, } from "react";

import { useNavigate } from "react-router-dom";

import {
    getIncidents,
} from "../../../api/incidentApi";


function AdminIncidents() {

    const navigate = useNavigate();

    const [incidents, setIncidents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [page, setPage] = useState(0);

    const [size] = useState(10);

    const [totalPages, setTotalPages] = useState(0);

    const [totalElements, setTotalElements] = useState(0);

    const [status, setStatus] = useState("");

    const [departmentId, setDepartmentId] = useState("");

    const [districtId, setDistrictId] = useState("");


    // =========================================================
    // LOAD INCIDENTS
    // =========================================================

    const loadIncidents = useCallback(async () => {

        try {

            setLoading(true);

            setError("");


            const response = await getIncidents(
                page,
                size,
                status || undefined,
                departmentId ? Number(departmentId) : undefined,
                districtId ? Number(districtId) : undefined );


            /*
             * Axios response handling.
             *
             * Spring Page response:
             *
             * {
             *   content: [],
             *   totalPages: 1,
             *   totalElements: 10
             * }
             */

            const data = response?.data ?? response;


            setIncidents(
                Array.isArray(data?.content)
                    ? data.content
                    : []
            );


            setTotalPages(
                Number(data?.totalPages ?? 0)
            );


            setTotalElements(
                Number(data?.totalElements ?? 0)
            );

        } catch (err) {

            console.error(
                "Admin incidents loading failed:",
                err
            );

            setIncidents([]);

            setError(
                err?.response?.data?.message ||
                "Failed to load incidents."
            );

        } finally {

            setLoading(false);

        }

    }, [
        page,
        size,
        status,
        departmentId,
        districtId,
    ]);


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadIncidents();

    }, [loadIncidents]);


    // =========================================================
    // FILTER CHANGE
    // =========================================================

    const handleStatusChange = (event) => {

        setStatus(event.target.value);

        setPage(0);

    };


    const handleDepartmentChange = (event) => {

        setDepartmentId(event.target.value);

        setPage(0);

    };


    const handleDistrictChange = (event) => {

        setDistrictId(event.target.value);

        setPage(0);

    };


    // =========================================================
    // VIEW INCIDENT
    //
    // IMPORTANT:
    //
    // NO POPUP
    //
    // Navigate to:
    //
    // /admin/incidents/:incidentId
    //
    // =========================================================

    const handleViewIncident = (incidentId) => {

        if (!incidentId) {
            return;
        }


        navigate(
            `/admin/incidents/${incidentId}`
        );

    };


    // =========================================================
    // STATUS BADGE
    // =========================================================

    const getStatusClass = (incidentStatus) => {

        switch (
        String(incidentStatus || "")
            .toUpperCase()
        ) {

            case "OPEN":
                return "bg-red-100 text-red-700";

            case "ASSIGNED":
                return "bg-blue-100 text-blue-700";

            case "IN_PROGRESS":
                return "bg-yellow-100 text-yellow-700";

            case "RESOLVED":
                return "bg-green-100 text-green-700";

            case "CLOSED":
                return "bg-gray-100 text-gray-700";

            default:
                return "bg-gray-100 text-gray-700";
        }

    };


    // =========================================================
    // FORMAT STATUS
    // =========================================================

    const formatStatus = (value) => {

        if (!value) {
            return "—";
        }


        return String(value)
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, letter =>
                letter.toUpperCase()
            );

    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (value) => {

        if (!value) {
            return "—";
        }


        try {

            return new Date(value).toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );

        } catch {

            return value;

        }

    };


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const clearFilters = () => {

        setStatus("");

        setDepartmentId("");

        setDistrictId("");

        setPage(0);

    };


    // =========================================================
    // PREVIOUS PAGE
    // =========================================================

    const previousPage = () => {

        if (page > 0) {

            setPage(
                previous => previous - 1
            );

        }

    };


    // =========================================================
    // NEXT PAGE
    // =========================================================

    const nextPage = () => {

        if (page + 1 < totalPages) {

            setPage(
                previous => previous + 1
            );

        }

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50 p-6">

                <div className="mx-auto max-w-7xl">

                    <div className="mb-6">

                        <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />

                        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-200" />

                    </div>


                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="space-y-4">

                            {[1, 2, 3, 4, 5].map(
                                item => (

                                    <div
                                        key={item}
                                        className="h-16 animate-pulse rounded-lg bg-slate-100"
                                    />

                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">

                            Incidents

                        </h1>

                        <p className="mt-1 text-sm text-slate-500">

                            View and manage reported civic incidents

                        </p>

                    </div>


                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">

                            Total Incidents

                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-900">

                            {totalElements}

                        </p>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                        {error}

                    </div>

                )}


                {/* =================================================
                    FILTERS
                ================================================= */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">


                        {/* STATUS */}

                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">

                                Status

                            </label>

                            <select
                                value={status}
                                onChange={handleStatusChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            >

                                <option value="">
                                    All Statuses
                                </option>

                                <option value="OPEN">
                                    Open
                                </option>

                                <option value="ASSIGNED">
                                    Assigned
                                </option>

                                <option value="IN_PROGRESS">
                                    In Progress
                                </option>

                                <option value="RESOLVED">
                                    Resolved
                                </option>

                                <option value="CLOSED">
                                    Closed
                                </option>

                            </select>

                        </div>


                        {/* DEPARTMENT */}

                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">

                                Department ID

                            </label>

                            <input
                                type="number"
                                value={departmentId}
                                onChange={handleDepartmentChange}
                                placeholder="Department ID"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            />

                        </div>


                        {/* DISTRICT */}

                        <div>

                            <label className="mb-1.5 block text-sm font-medium text-slate-700">

                                District ID

                            </label>

                            <input
                                type="number"
                                value={districtId}
                                onChange={handleDistrictChange}
                                placeholder="District ID"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            />

                        </div>


                        {/* CLEAR */}

                        <div className="flex items-end">

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >

                                Clear Filters

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    INCIDENT TABLE
                ================================================= */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


                    {/* DESKTOP TABLE */}

                    <div className="hidden overflow-x-auto lg:block">

                        <table className="min-w-full">

                            <thead className="border-b border-slate-200 bg-slate-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Incident
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Department
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        District
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Officer
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Reports
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {incidents.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="px-5 py-14 text-center"
                                        >

                                            <div className="text-4xl">
                                                📋
                                            </div>

                                            <p className="mt-3 font-semibold text-slate-800">
                                                No incidents found
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Try changing your filters.
                                            </p>

                                        </td>

                                    </tr>

                                ) : (

                                    incidents.map(
                                        incident => (

                                            <tr
                                                key={incident.id}
                                                className="transition hover:bg-slate-50"
                                            >

                                                {/* INCIDENT */}

                                                <td className="max-w-xs px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        {incident.imageUrl ? (

                                                            <img
                                                                src={incident.imageUrl}
                                                                alt=""
                                                                className="h-12 w-12 shrink-0 rounded-lg object-cover"
                                                            />

                                                        ) : (

                                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl">
                                                                🚧
                                                            </div>

                                                        )}


                                                        <div className="min-w-0">

                                                            <p className="truncate font-semibold text-slate-900">

                                                                {incident.title || "Untitled Incident"}

                                                            </p>

                                                            <p className="mt-1 truncate text-xs text-slate-500">

                                                                #{incident.id}

                                                                {" • "}

                                                                {formatDate(incident.createdAt)}

                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* DEPARTMENT */}

                                                <td className="px-5 py-4 text-sm text-slate-700">

                                                    {incident.department || "—"}

                                                </td>


                                                {/* DISTRICT */}

                                                <td className="px-5 py-4 text-sm text-slate-700">

                                                    {incident.district || "—"}

                                                </td>


                                                {/* OFFICER */}

                                                <td className="px-5 py-4">

                                                    {incident.assignedOfficerName ? (

                                                        <div>

                                                            <p className="text-sm font-medium text-slate-800">

                                                                {incident.assignedOfficerName}

                                                            </p>

                                                            {incident.assignedOfficerId && (

                                                                <p className="mt-0.5 text-xs text-slate-500">

                                                                    ID: {incident.assignedOfficerId}

                                                                </p>

                                                            )}

                                                        </div>

                                                    ) : (

                                                        <span className="text-sm text-slate-400">

                                                            Unassigned

                                                        </span>

                                                    )}

                                                </td>


                                                {/* REPORT COUNT */}

                                                <td className="px-5 py-4 text-sm font-medium text-slate-700">

                                                    {incident.citizenReportCount ?? 0}

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                                            incident.status
                                                        )}`}
                                                    >

                                                        {formatStatus(
                                                            incident.status
                                                        )}

                                                    </span>

                                                </td>


                                                {/* ACTION */}

                                                <td className="px-5 py-4 text-right">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleViewIncident(
                                                                incident.id
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                                                    >

                                                        View

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* =================================================
                        MOBILE CARDS
                    ================================================= */}

                    <div className="divide-y divide-slate-100 lg:hidden">

                        {incidents.length === 0 ? (

                            <div className="px-5 py-14 text-center">

                                <div className="text-4xl">
                                    📋
                                </div>

                                <p className="mt-3 font-semibold text-slate-800">
                                    No incidents found
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Try changing your filters.
                                </p>

                            </div>

                        ) : (

                            incidents.map(
                                incident => (

                                    <div
                                        key={incident.id}
                                        className="p-4"
                                    >

                                        <div className="flex gap-3">

                                            {incident.imageUrl ? (

                                                <img
                                                    src={incident.imageUrl}
                                                    alt=""
                                                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                                                />

                                            ) : (

                                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                                                    🚧
                                                </div>

                                            )}


                                            <div className="min-w-0 flex-1">

                                                <div className="flex items-start justify-between gap-3">

                                                    <div>

                                                        <h3 className="font-semibold text-slate-900">

                                                            {incident.title || "Untitled Incident"}

                                                        </h3>

                                                        <p className="mt-1 text-xs text-slate-500">

                                                            #{incident.id}

                                                        </p>

                                                    </div>


                                                    <span
                                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                                            incident.status
                                                        )}`}
                                                    >

                                                        {formatStatus(
                                                            incident.status
                                                        )}

                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

                                            <div>

                                                <p className="text-xs text-slate-500">
                                                    Department
                                                </p>

                                                <p className="mt-1 font-medium text-slate-800">
                                                    {incident.department || "—"}
                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-xs text-slate-500">
                                                    District
                                                </p>

                                                <p className="mt-1 font-medium text-slate-800">
                                                    {incident.district || "—"}
                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-xs text-slate-500">
                                                    Officer
                                                </p>

                                                <p className="mt-1 font-medium text-slate-800">

                                                    {incident.assignedOfficerName ||
                                                        "Unassigned"}

                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-xs text-slate-500">
                                                    Reports
                                                </p>

                                                <p className="mt-1 font-medium text-slate-800">

                                                    {incident.citizenReportCount ??
                                                        0}

                                                </p>

                                            </div>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewIncident(
                                                    incident.id
                                                )
                                            }
                                            className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >

                                            View Incident

                                        </button>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>


                {/* =================================================
                    PAGINATION
                ================================================= */}

                {totalPages > 0 && (

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-slate-500">

                            Page{" "}

                            <span className="font-semibold text-slate-700">
                                {page + 1}
                            </span>

                            {" "}of{" "}

                            <span className="font-semibold text-slate-700">
                                {totalPages}
                            </span>

                        </p>


                        <div className="flex gap-2">

                            <button
                                type="button"
                                disabled={page === 0}
                                onClick={previousPage}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >

                                Previous

                            </button>


                            <button
                                type="button"
                                disabled={
                                    page + 1 >= totalPages
                                }
                                onClick={nextPage}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >

                                Next

                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}


export default AdminIncidents;