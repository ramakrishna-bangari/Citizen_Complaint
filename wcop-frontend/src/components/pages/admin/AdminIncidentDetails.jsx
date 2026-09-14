import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    User,
    ShieldCheck,
    Building2,
    Image as ImageIcon,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import axios from "../../../api/axios";


// =========================================================
// HELPERS
// =========================================================

const formatDate = (value) => {

    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};


const getStatusClass = (status) => {

    const value =
        String(status || "").toUpperCase();


    if (
        value === "RESOLVED" ||
        value === "COMPLETED"
    ) {

        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }


    if (
        value === "IN_PROGRESS" ||
        value === "PROCESSING"
    ) {

        return "bg-blue-50 text-blue-700 border-blue-200";
    }


    if (value === "CLOSED") {

        return "bg-slate-100 text-slate-700 border-slate-200";
    }


    return "bg-amber-50 text-amber-700 border-amber-200";
};


// =========================================================
// INFO CARD
// =========================================================

function InfoCard({
    icon: Icon,
    label,
    value,
}) {

    return (

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center gap-2">

                {Icon && (

                    <Icon
                        size={17}
                        className="text-blue-500"
                    />

                )}

                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                </span>

            </div>


            <p className="break-words text-sm font-semibold text-slate-800">
                {value || "—"}
            </p>

        </div>
    );
}


// =========================================================
// PAGE
// =========================================================

export default function AdminIncidentDetails() {

    const { incidentId } =
        useParams();

    const navigate =
        useNavigate();


    const [incident, setIncident] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [imageOpen, setImageOpen] =
        useState(false);


    // =========================================================
    // LOAD
    // =========================================================

    const loadIncident = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await axios.get(
                        `/admin/incidents/${incidentId}`
                    );


                setIncident(
                    response?.data
                );

            } catch (err) {

                console.error(
                    "Incident details loading failed:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to load incident details."
                );

            } finally {

                setLoading(false);
            }

        },
        [incidentId]
    );


    useEffect(() => {

        loadIncident();

    }, [loadIncident]);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="text-center">

                    <RefreshCw
                        size={30}
                        className="mx-auto mb-3 animate-spin text-blue-600"
                    />

                    <p className="text-slate-600">
                        Loading incident...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error || !incident) {

        return (

            <div className="min-h-[70vh] bg-slate-50 p-6">

                <button
                    onClick={() =>
                        navigate(
                            "/admin/incidents"
                        )
                    }
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600"
                >

                    <ArrowLeft size={17} />

                    Back to incidents

                </button>


                <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-8 text-center">

                    <AlertCircle
                        size={35}
                        className="mx-auto mb-3 text-red-500"
                    />

                    <h2 className="font-semibold text-red-800">
                        Unable to load incident
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {error ||
                            "Incident not found."}
                    </p>


                    <button
                        onClick={
                            loadIncident
                        }
                        className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                    >
                        Try again
                    </button>

                </div>

            </div>
        );
    }


    return (

        <div className="min-h-screen bg-slate-50">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="border-b border-slate-200 bg-white">

                <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">

                    <button
                        onClick={() =>
                            navigate(
                                "/admin/incidents"
                            )
                        }
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
                    >

                        <ArrowLeft size={17} />

                        Back to Incidents

                    </button>


                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                Incident #{incident.id}
                            </p>

                            <h1 className="mt-1 break-words text-2xl font-bold text-slate-900 md:text-3xl">
                                {
                                    incident.title ||
                                    "Untitled incident"
                                }
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Created{" "}
                                {formatDate(
                                    incident.createdAt
                                )}
                            </p>

                        </div>


                        <span
                            className={`self-start rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                                incident.status
                            )}`}
                        >
                            {
                                incident.status ||
                                "OPEN"
                            }
                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================================
                BODY
            ====================================================== */}

            <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* MAIN */}

                    <div className="space-y-6 lg:col-span-2">

                        {/* DESCRIPTION */}

                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="mb-4 flex items-center gap-2">

                                <AlertCircle
                                    size={19}
                                    className="text-blue-600"
                                />

                                <h2 className="font-semibold text-slate-900">
                                    Incident Description
                                </h2>

                            </div>


                            <p className="whitespace-pre-wrap leading-7 text-slate-600">
                                {
                                    incident.description ||
                                    "No description available."
                                }
                            </p>

                        </section>


                        {/* IMAGE */}

                        {incident.imageUrl && (

                            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                                <div className="mb-4 flex items-center gap-2">

                                    <ImageIcon
                                        size={19}
                                        className="text-blue-600"
                                    />

                                    <h2 className="font-semibold text-slate-900">
                                        Incident Image
                                    </h2>

                                </div>


                                <button
                                    onClick={() =>
                                        setImageOpen(
                                            true
                                        )
                                    }
                                    className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3"
                                >

                                    <img
                                        src={
                                            incident.imageUrl
                                        }
                                        alt="Incident"
                                        className="max-h-[550px] max-w-full rounded-lg object-contain"
                                    />

                                </button>

                                <p className="mt-3 text-center text-xs text-slate-400">
                                    Click image to view full size
                                </p>

                            </section>

                        )}


                        {/* LOCATION */}

                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="mb-5 flex items-center gap-2">

                                <MapPin
                                    size={19}
                                    className="text-blue-600"
                                />

                                <h2 className="font-semibold text-slate-900">
                                    Location
                                </h2>

                            </div>


                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                                <InfoCard
                                    icon={Building2}
                                    label="Department"
                                    value={
                                        incident.department
                                    }
                                />

                                <InfoCard
                                    icon={MapPin}
                                    label="District"
                                    value={
                                        incident.district
                                    }
                                />

                                <InfoCard
                                    icon={MapPin}
                                    label="Coordinates"
                                    value={
                                        incident.latitude != null &&
                                            incident.longitude != null
                                            ? `${incident.latitude}, ${incident.longitude}`
                                            : "—"
                                    }
                                />

                            </div>

                        </section>


                        {/* RELATED COMPLAINTS */}

                        <section className="rounded-xl border border-blue-200 bg-blue-50 p-6">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                        Citizen Reports
                                    </p>

                                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                                        {
                                            incident.citizenReportCount ??
                                            0
                                        }{" "}
                                        complaint
                                        {
                                            (incident.citizenReportCount ?? 0) === 1 ? "" : "s"}{" "}
                                        linked to this incident
                                    </h2>

                                </div>


                                <Link
                                    to={`/admin/complaints?incidentId=${incident.id}`}
                                    className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    View Related Complaints
                                </Link>

                            </div>

                        </section>

                    </div>


                    {/* SIDEBAR */}

                    <div className="space-y-6">

                        {/* OFFICER */}

                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="mb-5 flex items-center gap-2">

                                <ShieldCheck
                                    size={19}
                                    className="text-blue-600"
                                />

                                <h2 className="font-semibold text-slate-900">
                                    Assigned Officer
                                </h2>

                            </div>


                            <div className="space-y-4">

                                <InfoCard
                                    icon={User}
                                    label="Officer"
                                    value={
                                        incident.assignedOfficerName ||
                                        "Unassigned"
                                    }
                                />


                                <InfoCard
                                    icon={ShieldCheck}
                                    label="Officer EMP_ID"
                                    value={
                                        incident.assignedOfficerEmployeeId
                                    }
                                />

                            </div>

                        </section>


                        {/* CLASSIFICATION */}

                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="mb-5 flex items-center gap-2">

                                <Building2
                                    size={19}
                                    className="text-blue-600"
                                />

                                <h2 className="font-semibold text-slate-900">
                                    Classification
                                </h2>

                            </div>


                            <div className="space-y-4">

                                <InfoCard
                                    icon={Building2}
                                    label="Department"
                                    value={
                                        incident.department
                                    }
                                />

                                <InfoCard
                                    icon={MapPin}
                                    label="District"
                                    value={
                                        incident.district
                                    }
                                />

                            </div>

                        </section>


                        {/* REPORT COUNT */}

                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Citizen Reports
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {
                                    incident.citizenReportCount ??
                                    0
                                }
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Complaints connected to this incident
                            </p>

                        </section>


                        {/* TIMELINE */}

                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="mb-5 flex items-center gap-2">

                                <CalendarDays
                                    size={19}
                                    className="text-blue-600"
                                />

                                <h2 className="font-semibold text-slate-900">
                                    Timeline
                                </h2>

                            </div>


                            <div className="space-y-4">

                                <InfoCard
                                    icon={CalendarDays}
                                    label="Created"
                                    value={
                                        formatDate(
                                            incident.createdAt
                                        )
                                    }
                                />

                                <InfoCard
                                    icon={CalendarDays}
                                    label="Last Updated"
                                    value={
                                        formatDate(
                                            incident.updatedAt
                                        )
                                    }
                                />

                            </div>

                        </section>

                    </div>

                </div>

            </main>


            {/* =====================================================
                IMAGE LIGHTBOX
            ====================================================== */}

            {imageOpen &&
                incident.imageUrl && (

                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
                        onClick={() =>
                            setImageOpen(false)
                        }
                    >

                        <div
                            className="relative flex max-h-[95vh] max-w-[95vw] items-center justify-center"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <img
                                src={
                                    incident.imageUrl
                                }
                                alt="Incident full size"
                                className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                            />


                            <button
                                onClick={() =>
                                    setImageOpen(
                                        false
                                    )
                                }
                                className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-2 text-white"
                            >
                                ✕
                            </button>

                        </div>

                    </div>

                )}

        </div>
    );
}