import { useEffect, useMemo, useState } from "react";

import {
    CheckCircle2,
    Eye,
    Loader2,
    MapPin,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    X,
} from "lucide-react";

import {
    createAdminDistrict,
    getAdminDistrictById,
    getAdminDistricts,
    updateAdminDistrict,
} from "../../../api/adminApi";


// =========================================================
// HELPERS
// =========================================================

const getList = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.content)) {
        return response.content;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.data?.content)) {
        return response.data.content;
    }

    if (Array.isArray(response?.districts)) {
        return response.districts;
    }

    return [];
};


const getDistrictId = (district) => {
    return (
        district?.id ??
        district?.districtId ??
        null
    );
};


const getDistrictName = (district) => {
    return (
        district?.districtName ??
        district?.name ??
        "Unnamed District"
    );
};


const getDescription = (district) => {
    return (
        district?.description ??
        "No description provided."
    );
};


const getActive = (district) => {

    if (
        typeof district?.active === "boolean"
    ) {
        return district.active;
    }

    if (
        typeof district?.isActive === "boolean"
    ) {
        return district.isActive;
    }

    return true;
};


const getBackendMessage = (error, fallback) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        fallback
    );
};


// =========================================================
// INITIAL FORM
// =========================================================

const INITIAL_FORM = {
    districtName: "",
    description: "",
    active: true,
};


// =========================================================
// COMPONENT
// =========================================================

export default function AdminDistricts() {

    // =====================================================
    // DATA
    // =====================================================

    const [districts, setDistricts] =
        useState([]);


    // =====================================================
    // UI
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // SEARCH
    // =====================================================

    const [search, setSearch] =
        useState("");


    // =====================================================
    // DETAILS
    // =====================================================

    const [selectedDistrict, setSelectedDistrict] =
        useState(null);

    const [loadingDetails, setLoadingDetails] =
        useState(false);


    // =====================================================
    // FORM
    // =====================================================

    const [showForm, setShowForm] =
        useState(false);

    const [editingDistrict, setEditingDistrict] =
        useState(null);

    const [form, setForm] =
        useState({
            ...INITIAL_FORM,
        });

    const [saving, setSaving] =
        useState(false);

    const [formError, setFormError] =
        useState("");


    // =====================================================
    // LOAD DISTRICTS
    // =====================================================

    const loadDistricts = async (
        showFullLoader = true
    ) => {

        try {

            if (showFullLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response =
                await getAdminDistricts();

            setDistricts(
                getList(response)
            );

        } catch (err) {

            console.error(
                "ADMIN DISTRICTS LOAD ERROR:",
                err
            );

            setError(
                getBackendMessage(
                    err,
                    "Unable to load districts."
                )
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    useEffect(() => {
        loadDistricts(true);
    }, []);


    // =====================================================
    // FILTER
    // =====================================================

    const filteredDistricts =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return districts;
            }

            return districts.filter(
                (district) => {

                    const name =
                        getDistrictName(
                            district
                        ).toLowerCase();

                    const description =
                        getDescription(
                            district
                        ).toLowerCase();

                    return (
                        name.includes(query) ||
                        description.includes(query)
                    );
                }
            );

        }, [
            districts,
            search,
        ]);


    // =====================================================
    // CREATE
    // =====================================================

    const openCreate = () => {

        setEditingDistrict(null);

        setForm({
            ...INITIAL_FORM,
        });

        setFormError("");
        setError("");

        setShowForm(true);
    };


    // =====================================================
    // EDIT
    // =====================================================

    const openEdit = (district) => {

        setEditingDistrict(
            district
        );

        setForm({
            districtName:
                getDistrictName(
                    district
                ) === "Unnamed District"
                    ? ""
                    : getDistrictName(
                        district
                    ),

            description:
                district?.description || "",

            active:
                getActive(
                    district
                ),
        });

        setFormError("");
        setError("");

        setShowForm(true);
    };


    // =====================================================
    // DETAILS
    // =====================================================

    const openDetails = async (
        district
    ) => {

        const id =
            getDistrictId(
                district
            );

        if (!id) {

            setSelectedDistrict(
                district
            );

            return;
        }

        try {

            setSelectedDistrict(
                district
            );

            setLoadingDetails(true);

            const response =
                await getAdminDistrictById(
                    id
                );

            setSelectedDistrict(
                response
            );

        } catch (err) {

            console.error(
                "DISTRICT DETAILS ERROR:",
                err
            );

            setError(
                getBackendMessage(
                    err,
                    "Unable to load district details."
                )
            );

        } finally {

            setLoadingDetails(false);

        }
    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm(
            (previous) => ({
                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value,
            })
        );

        setFormError("");
        setError("");
    };


    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {

        if (saving) {
            return;
        }

        setShowForm(false);
        setEditingDistrict(null);

        setForm({
            ...INITIAL_FORM,
        });

        setFormError("");
    };


    // =====================================================
    // SAVE DISTRICT
    // =====================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setFormError("");

        const districtName =
            form.districtName.trim();

        const description =
            form.description.trim();


        if (!districtName) {

            setFormError(
                "District name is required."
            );

            return;
        }


        if (districtName.length < 2) {

            setFormError(
                "District name must contain at least 2 characters."
            );

            return;
        }


        if (districtName.length > 100) {

            setFormError(
                "District name cannot exceed 100 characters."
            );

            return;
        }


        if (description.length > 500) {

            setFormError(
                "Description cannot exceed 500 characters."
            );

            return;
        }


        try {

            setSaving(true);

            setError("");
            setSuccess("");


            // IMPORTANT:
            // Active is intentionally included because
            // DISTRICTS support Active / Inactive status.

            const payload = {
                districtName,
                description:
                    description || null,
                active:
                    Boolean(form.active),
            };


            if (editingDistrict) {

                await updateAdminDistrict(
                    getDistrictId(
                        editingDistrict
                    ),
                    payload
                );

                setSuccess(
                    "District updated successfully."
                );

            } else {

                await createAdminDistrict(
                    payload
                );

                setSuccess(
                    "District created successfully."
                );
            }


            closeForm();

            await loadDistricts(false);


            setTimeout(() => {
                setSuccess("");
            }, 2500);

        } catch (err) {

            console.error(
                "DISTRICT SAVE ERROR:",
                err
            );

            setFormError(
                getBackendMessage(
                    err,
                    "Unable to save district."
                )
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="flex min-h-[500px] items-center justify-center bg-slate-50">

                <div className="text-center">

                    <Loader2
                        size={34}
                        className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                        Loading districts...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">


                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                            Districts
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage municipal districts and their availability.
                        </p>

                    </div>


                    <div className="flex gap-2">

                        <button
                            type="button"
                            onClick={() =>
                                loadDistricts(false)
                            }
                            disabled={refreshing}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
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


                        <button
                            type="button"
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                        >

                            <Plus size={17} />

                            Add District

                        </button>

                    </div>

                </div>


                {/* =================================================
                    ALERTS
                ================================================== */}

                {error && (

                    <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                        >
                            <X size={17} />
                        </button>

                    </div>
                )}


                {success && (

                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

                        <CheckCircle2
                            size={17}
                        />

                        {success}

                    </div>
                )}


                {/* =================================================
                    SEARCH
                ================================================== */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="relative max-w-xl">

                        <Search
                            size={17}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search districts..."
                            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                    </div>


                    <p className="mt-3 text-sm text-slate-500">

                        {filteredDistricts.length} district
                        {filteredDistricts.length === 1
                            ? ""
                            : "s"}

                    </p>

                </div>


                {/* =================================================
                    DESKTOP TABLE
                ================================================== */}

                <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">

                    <table className="w-full text-left">

                        <thead className="border-b border-slate-200 bg-slate-50">

                            <tr>

                                <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                                    District
                                </th>

                                <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                                    Description
                                </th>

                                <th className="px-5 py-4 text-xs font-bold uppercase text-slate-500">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                            {filteredDistricts.map(
                                (district) => {

                                    const active =
                                        getActive(
                                            district
                                        );

                                    return (

                                        <tr
                                            key={
                                                getDistrictId(
                                                    district
                                                )
                                            }
                                            className="hover:bg-slate-50"
                                        >

                                            {/* DISTRICT */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                                        <MapPin
                                                            size={18}
                                                        />

                                                    </div>


                                                    <span className="font-semibold text-slate-900">

                                                        {getDistrictName(
                                                            district
                                                        )}

                                                    </span>

                                                </div>

                                            </td>


                                            {/* DESCRIPTION */}

                                            <td className="max-w-md px-5 py-4 text-sm text-slate-600">

                                                <p className="line-clamp-2">

                                                    {getDescription(
                                                        district
                                                    )}

                                                </p>

                                            </td>


                                            {/* STATUS */}

                                            <td className="px-5 py-4">

                                                <span
                                                    className={
                                                        active
                                                            ? "inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700"
                                                            : "inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"
                                                    }
                                                >

                                                    {active
                                                        ? "Active"
                                                        : "Inactive"}

                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-1">

                                                    {/* VIEW */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDetails(
                                                                district
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                                        title="View district"
                                                    >

                                                        <Eye
                                                            size={17}
                                                        />

                                                    </button>


                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEdit(
                                                                district
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                                                        title="Edit district"
                                                    >

                                                        <Pencil
                                                            size={17}
                                                        />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                }
                            )}


                            {filteredDistricts.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={4}
                                        className="px-5 py-16 text-center"
                                    >

                                        <MapPin
                                            size={32}
                                            className="mx-auto text-slate-300"
                                        />

                                        <p className="mt-3 font-semibold text-slate-700">
                                            No districts found
                                        </p>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Try a different search.
                                        </p>

                                    </td>

                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    MOBILE
                ================================================== */}

                <div className="space-y-3 md:hidden">

                    {filteredDistricts.map(
                        (district) => {

                            const active =
                                getActive(
                                    district
                                );

                            return (

                                <div
                                    key={
                                        getDistrictId(
                                            district
                                        )
                                    }
                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                >

                                    {/* TOP */}

                                    <div className="flex items-start justify-between gap-3">

                                        <div className="flex min-w-0 items-center gap-3">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                                <MapPin
                                                    size={18}
                                                />

                                            </div>


                                            <div className="min-w-0">

                                                <p className="font-bold text-slate-900">

                                                    {getDistrictName(
                                                        district
                                                    )}

                                                </p>


                                                <span
                                                    className={
                                                        active
                                                            ? "mt-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700"
                                                            : "mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600"
                                                    }
                                                >

                                                    {active
                                                        ? "Active"
                                                        : "Inactive"}

                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* DESCRIPTION */}

                                    <p className="mt-4 text-sm leading-6 text-slate-600">

                                        {getDescription(
                                            district
                                        )}

                                    </p>


                                    {/* ACTIONS */}

                                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDetails(
                                                    district
                                                )
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700"
                                        >

                                            <Eye
                                                size={16}
                                            />

                                            View

                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEdit(
                                                    district
                                                )
                                            }
                                            className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-600"
                                            title="Edit district"
                                        >

                                            <Pencil
                                                size={16}
                                            />

                                        </button>

                                    </div>

                                </div>
                            );
                        }
                    )}


                    {filteredDistricts.length === 0 && (

                        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center">

                            <MapPin
                                size={32}
                                className="mx-auto text-slate-300"
                            />

                            <p className="mt-3 font-semibold text-slate-700">
                                No districts found
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                Try a different search.
                            </p>

                        </div>
                    )}

                </div>

            </div>


            {/* =====================================================
                DETAILS MODAL
            ====================================================== */}

            {selectedDistrict && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedDistrict(
                                null
                            );
                        }

                    }}
                >

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">


                        {/* HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                            <div>

                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                                    District Management
                                </p>

                                <h2 className="mt-1 font-bold text-slate-900">
                                    District Details
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedDistrict(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                            >

                                <X size={18} />

                            </button>

                        </div>


                        {/* LOADING */}

                        {loadingDetails ? (

                            <div className="flex min-h-[250px] items-center justify-center">

                                <Loader2
                                    size={30}
                                    className="animate-spin text-blue-600"
                                />

                            </div>

                        ) : (

                            <div className="p-5">


                                {/* NAME + STATUS */}

                                <div className="rounded-2xl bg-slate-50 p-5">

                                    <div className="flex items-center justify-between gap-4">

                                        <div className="min-w-0">

                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                District
                                            </p>

                                            <h3 className="mt-1 text-lg font-bold text-slate-900">

                                                {getDistrictName(
                                                    selectedDistrict
                                                )}

                                            </h3>

                                        </div>


                                        <span
                                            className={
                                                getActive(
                                                    selectedDistrict
                                                )
                                                    ? "shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700"
                                                    : "shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"
                                            }
                                        >

                                            {getActive(
                                                selectedDistrict
                                            )
                                                ? "Active"
                                                : "Inactive"}

                                        </span>

                                    </div>

                                </div>


                                {/* DESCRIPTION */}

                                <div className="mt-5 rounded-xl border border-slate-200 p-4">

                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Description
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-slate-700">

                                        {getDescription(
                                            selectedDistrict
                                        )}

                                    </p>

                                </div>


                                {/* ACTIONS */}

                                <div className="mt-5 flex gap-2">

                                    <button
                                        type="button"
                                        onClick={() => {

                                            const district =
                                                selectedDistrict;

                                            setSelectedDistrict(
                                                null
                                            );

                                            openEdit(
                                                district
                                            );

                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
                                    >

                                        <Pencil
                                            size={16}
                                        />

                                        Edit

                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedDistrict(
                                                null
                                            )
                                        }
                                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                                    >

                                        Close

                                    </button>

                                </div>

                            </div>

                        )}

                    </div>

                </div>
            )}


            {/* =====================================================
                CREATE / EDIT MODAL
            ====================================================== */}

            {showForm && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeForm();
                        }

                    }}
                >

                    <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">


                        {/* HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                            <div>

                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                                    District Management
                                </p>

                                <h2 className="mt-1 font-bold text-slate-900">

                                    {editingDistrict
                                        ? "Edit District"
                                        : "Create District"}

                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Manage district information and availability.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={saving}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                            >

                                <X size={18} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-5"
                        >

                            {formError && (

                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                                    {formError}

                                </div>
                            )}


                            {/* DISTRICT NAME */}

                            <div>

                                <label className="text-sm font-semibold text-slate-700">
                                    District Name
                                </label>

                                <input
                                    type="text"
                                    name="districtName"
                                    value={
                                        form.districtName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={100}
                                    disabled={saving}
                                    autoFocus
                                    placeholder="Enter district name"
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div>

                                <label className="text-sm font-semibold text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows={4}
                                    maxLength={500}
                                    disabled={saving}
                                    placeholder="Describe the district"
                                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />

                            </div>


                            {/* ACTIVE STATUS — kept as requested */}

                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">

                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={
                                        Boolean(
                                            form.active
                                        )
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                    className="h-4 w-4 accent-blue-600"
                                />


                                <span>

                                    <span className="block text-sm font-semibold text-slate-800">
                                        Active district
                                    </span>

                                    <span className="block text-xs text-slate-500">
                                        Active districts can be used for complaint and incident assignments.
                                    </span>

                                </span>

                            </label>


                            {/* BUTTONS */}

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                                >

                                    {saving && (

                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                    )}

                                    {editingDistrict
                                        ? "Update District"
                                        : "Create District"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}