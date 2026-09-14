import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Edit3,
    Mail,
    Phone,
    MapPin,
    Building2,
    User,
    ShieldCheck,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    XCircle,
    IdCard,
} from "lucide-react";

import { getAdminOfficerById } from "../../../api/adminApi";


// =========================================================
// HELPERS
// =========================================================

const getFullName = (officer) => {
    const firstName = officer?.firstName || "";
    const lastName = officer?.lastName || "";

    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || "Unnamed Officer";
};


const getInitials = (officer) => {
    const first = officer?.firstName?.charAt(0) || "";
    const last = officer?.lastName?.charAt(0) || "";

    const initials = `${first}${last}`.toUpperCase();

    return initials || "OF";
};


const getEmployeeId = (officer) => {
    return officer?.staffProfile?.employeeId || "Not assigned";
};


const getDepartment = (officer) => {
    return officer?.staffProfile?.department || "Not assigned";
};


const getDistrict = (officer) => {
    return officer?.staffProfile?.district || "Not assigned";
};


const getActiveStatus = (officer) => {
    return officer?.isActive === true;
};


// =========================================================
// COMPONENT
// =========================================================

function AdminOfficerDetails() {

    const { officerId } = useParams();
    const navigate = useNavigate();

    const [officer, setOfficer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD OFFICER
    // =====================================================

    const loadOfficer = useCallback(
        async (isRefresh = false) => {

            if (!officerId) {
                setError("Officer ID is missing from the URL.");
                setLoading(false);
                return;
            }

            try {

                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const data = await getAdminOfficerById(officerId);

                console.log("OFFICER DETAILS:", data);

                setOfficer(data);

            } catch (err) {

                console.error("OFFICER DETAILS ERROR:", err);

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Unable to load officer details."
                );

            } finally {

                setLoading(false);
                setRefreshing(false);
            }

        },
        [officerId]
    );


    useEffect(() => {
        loadOfficer();
    }, [loadOfficer]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-50">

                <div className="flex min-h-[70vh] items-center justify-center">

                    <div className="text-center">

                        <RefreshCw
                            className="mx-auto h-8 w-8 animate-spin text-blue-600"
                        />

                        <p className="mt-4 text-sm font-medium text-slate-600">
                            Loading officer details...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !officer) {

        return (
            <div className="min-h-screen bg-slate-50 px-6 py-10">

                <div className="mx-auto max-w-4xl">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/officers")}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Officers
                    </button>


                    <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">

                        <div className="flex items-start gap-4">

                            <div className="rounded-lg bg-red-50 p-2">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>

                            <div>

                                <h2 className="text-base font-semibold text-slate-900">
                                    Unable to load officer
                                </h2>

                                <p className="mt-1 text-sm text-slate-600">
                                    {error || "Officer record could not be found."}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    const fullName = getFullName(officer);
    const initials = getInitials(officer);
    const active = getActiveStatus(officer);

    const employeeId = getEmployeeId(officer);
    const department = getDepartment(officer);
    const district = getDistrict(officer);


    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="border-b border-slate-200 bg-white">

                <div className="mx-auto max-w-6xl px-6 py-5">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/officers")}
                                className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Officers
                            </button>

                            <h1 className="text-xl font-semibold text-slate-900">
                                Officer Details
                            </h1>

                        </div>


                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={refreshing}
                                onClick={() => loadOfficer(true)}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                <RefreshCw
                                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""
                                        }`}
                                />

                                Refresh

                            </button>


                            <Link
                                to={`/admin/officers/${officerId}/edit`}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >

                                <Edit3 className="h-4 w-4" />

                                Edit Officer

                            </Link>

                        </div>

                    </div>

                </div>

            </header>


            {/* =================================================
                CONTENT
            ================================================= */}

            <main className="mx-auto max-w-6xl px-6 py-8">


                {/* =================================================
                    OFFICER SUMMARY
                ================================================= */}

                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="p-6">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                            {/* Avatar */}

                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-700 ring-1 ring-blue-100">

                                {initials}

                            </div>


                            {/* Name */}

                            <div className="min-w-0 flex-1">

                                <div className="flex flex-wrap items-center gap-3">

                                    <h2 className="text-2xl font-semibold text-slate-900">
                                        {fullName}
                                    </h2>


                                    {active ? (

                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">

                                            <CheckCircle2 className="h-3.5 w-3.5" />

                                            Active

                                        </span>

                                    ) : (

                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">

                                            <XCircle className="h-3.5 w-3.5" />

                                            Inactive

                                        </span>

                                    )}

                                </div>


                                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">

                                    <span className="inline-flex items-center gap-2">

                                        <IdCard className="h-4 w-4" />

                                        {employeeId}

                                    </span>


                                    <span className="inline-flex items-center gap-2">

                                        <ShieldCheck className="h-4 w-4" />

                                        {officer.role || "Officer"}

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    INFORMATION
                ================================================= */}

                <div className="mt-6 grid gap-6 lg:grid-cols-3">


                    {/* =================================================
                        CONTACT
                    ================================================= */}

                    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 px-6 py-4">

                            <div className="flex items-center gap-3">

                                <div className="rounded-lg bg-blue-50 p-2">

                                    <User className="h-5 w-5 text-blue-600" />

                                </div>

                                <div>

                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Contact Information
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        Registered contact details
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="divide-y divide-slate-100">

                            <InfoRow
                                icon={Mail}
                                label="Email"
                                value={officer.email || "Not provided"}
                            />

                            <InfoRow
                                icon={Phone}
                                label="Phone"
                                value={officer.phone || "Not provided"}
                            />

                            <InfoRow
                                icon={MapPin}
                                label="Address"
                                value={officer.address || "Not provided"}
                            />

                        </div>

                    </section>


                    {/* =================================================
                        ASSIGNMENT
                    ================================================= */}

                    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 px-6 py-4">

                            <div className="flex items-center gap-3">

                                <div className="rounded-lg bg-indigo-50 p-2">

                                    <Building2 className="h-5 w-5 text-indigo-600" />

                                </div>

                                <div>

                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Assignment
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        Current department and district
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="divide-y divide-slate-100">

                            <InfoRow
                                icon={IdCard}
                                label="Employee ID"
                                value={employeeId}
                            />

                            <InfoRow
                                icon={Building2}
                                label="Department"
                                value={department}
                            />

                            <InfoRow
                                icon={MapPin}
                                label="District"
                                value={district}
                            />

                        </div>

                    </section>


                    {/* =================================================
                        ACCOUNT
                    ================================================= */}

                    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 px-6 py-4">

                            <div className="flex items-center gap-3">

                                <div className="rounded-lg bg-slate-100 p-2">

                                    <ShieldCheck className="h-5 w-5 text-slate-700" />

                                </div>

                                <div>

                                    <h3 className="text-sm font-semibold text-slate-900">
                                        Account
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        Account access information
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="divide-y divide-slate-100">

                            <InfoRow
                                icon={ShieldCheck}
                                label="Role"
                                value={officer.role || "Officer"}
                            />

                            <InfoRow
                                icon={CheckCircle2}
                                label="Account Status"
                                value={active ? "Active" : "Inactive"}
                            />

                            <InfoRow
                                icon={IdCard}
                                label="User ID"
                                value={officer.id ?? "—"}
                            />

                        </div>

                    </section>

                </div>


                {/* =================================================
                    ASSIGNMENT SUMMARY
                ================================================= */}

                <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="px-6 py-5">

                        <h3 className="text-sm font-semibold text-slate-900">
                            Current Assignment
                        </h3>

                        <div className="mt-4 grid gap-4 sm:grid-cols-3">

                            <SummaryItem
                                label="Employee ID"
                                value={employeeId}
                            />

                            <SummaryItem
                                label="Department"
                                value={department}
                            />

                            <SummaryItem
                                label="District"
                                value={district}
                            />

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}


// =========================================================
// INFO ROW
// =========================================================

function InfoRow({
    icon: Icon,
    label,
    value,
}) {

    return (
        <div className="flex gap-3 px-6 py-4">

            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

            <div className="min-w-0">

                <p className="text-xs font-medium text-slate-500">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {value}
                </p>

            </div>

        </div>
    );
}


// =========================================================
// SUMMARY ITEM
// =========================================================

function SummaryItem({
    label,
    value,
}) {

    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">

            <p className="text-xs font-medium text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
                {value}
            </p>

        </div>
    );
}


export default AdminOfficerDetails;