import { useEffect, useMemo, useState } from "react";
import {
    CheckCircle2,
    Eye,
    Loader2,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    X,
} from "lucide-react";

import {
    createAdminDepartment,
    getAdminDepartmentById,
    getAdminDepartments,
    updateAdminDepartment,
} from "../../../api/adminApi";

const EMPTY_FORM = {
    departmentName: "",
    description: "",
};

const getList = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.content)) return response.content;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.content)) {
        return response.data.content;
    }
    if (Array.isArray(response?.departments)) {
        return response.departments;
    }

    return [];
};

const getId = (department) =>
    department?.id ??
    department?.departmentId ??
    null;

const getName = (department) =>
    department?.departmentName ??
    department?.name ??
    "Unnamed Department";

const getDescription = (department) =>
    department?.description ??
    "No description provided.";

const getBackendMessage = (error, fallback) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.detail ||
    fallback;


export default function AdminDepartments() {

    const [departments, setDepartments] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [selected, setSelected] = useState(null);
    const [detailsLoading, setDetailsLoading] =
        useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const [form, setForm] = useState({
        ...EMPTY_FORM,
    });

    const [formError, setFormError] = useState("");


    // =========================================================
    // LOAD DEPARTMENTS
    // =========================================================

    const loadDepartments = async (full = true) => {

        try {

            if (full) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response =
                await getAdminDepartments();

            setDepartments(
                getList(response)
            );

        } catch (err) {

            console.error(
                "ADMIN DEPARTMENTS LOAD ERROR:",
                err
            );

            setError(
                getBackendMessage(
                    err,
                    "Unable to load departments."
                )
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    useEffect(() => {
        loadDepartments();
    }, []);


    // =========================================================
    // SEARCH
    // =========================================================

    const filteredDepartments = useMemo(() => {

        const query =
            search.trim().toLowerCase();

        if (!query) {
            return departments;
        }

        return departments.filter(
            (department) => {

                const name =
                    getName(department);

                const description =
                    getDescription(department);

                return `${name} ${description}`
                    .toLowerCase()
                    .includes(query);
            }
        );

    }, [departments, search]);


    // =========================================================
    // CREATE
    // =========================================================

    const openCreate = () => {

        setEditing(null);

        setForm({
            ...EMPTY_FORM,
        });

        setFormError("");
        setError("");

        setShowForm(true);
    };


    // =========================================================
    // EDIT
    // =========================================================

    const openEdit = (department) => {

        setEditing(department);

        setForm({
            departmentName:
                getName(department) ===
                    "Unnamed Department"
                    ? ""
                    : getName(department),

            description:
                department?.description || "",
        });

        setFormError("");
        setError("");

        setShowForm(true);
    };


    // =========================================================
    // VIEW DETAILS
    // =========================================================

    const openDetails = async (department) => {

        setSelected(department);

        const id =
            getId(department);

        if (!id) {
            return;
        }

        try {

            setDetailsLoading(true);

            const response =
                await getAdminDepartmentById(id);

            setSelected(response);

        } catch (err) {

            console.error(
                "DEPARTMENT DETAILS ERROR:",
                err
            );

            setError(
                getBackendMessage(
                    err,
                    "Unable to load department details."
                )
            );

        } finally {

            setDetailsLoading(false);

        }
    };


    // =========================================================
    // FORM CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormError("");
        setError("");
    };


    // =========================================================
    // CLOSE FORM
    // =========================================================

    const closeForm = () => {

        if (saving) {
            return;
        }

        setShowForm(false);
        setEditing(null);

        setForm({
            ...EMPTY_FORM,
        });

        setFormError("");
    };


    // =========================================================
    // CREATE / UPDATE
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        const departmentName =
            form.departmentName.trim();

        const description =
            form.description.trim();


        if (!departmentName) {

            setFormError(
                "Department name is required."
            );

            return;
        }


        if (departmentName.length < 3) {

            setFormError(
                "Department name must contain at least 3 characters."
            );

            return;
        }


        if (departmentName.length > 100) {

            setFormError(
                "Department name cannot exceed 100 characters."
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

            setFormError("");
            setError("");
            setSuccess("");


            const payload = {
                departmentName,
                description:
                    description || null,
            };


            if (editing) {

                await updateAdminDepartment(
                    getId(editing),
                    payload
                );

                setSuccess(
                    "Department updated successfully."
                );

            } else {

                await createAdminDepartment(
                    payload
                );

                setSuccess(
                    "Department created successfully."
                );
            }


            setShowForm(false);
            setEditing(null);

            setForm({
                ...EMPTY_FORM,
            });


            await loadDepartments(false);


            setTimeout(() => {
                setSuccess("");
            }, 2500);


        } catch (err) {

            console.error(
                "DEPARTMENT SAVE ERROR:",
                err
            );

            setFormError(
                getBackendMessage(
                    err,
                    "Unable to save department. Please try again."
                )
            );

        } finally {

            setSaving(false);

        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="flex min-h-[500px] items-center justify-center bg-slate-50">

                <div className="text-center">

                    <Loader2
                        size={28}
                        className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-600">
                        Loading departments...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">


                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="flex items-center gap-2">

                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                Departments
                            </h1>

                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                                Administration
                            </span>

                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage municipal service departments.
                        </p>

                    </div>


                    <div className="flex gap-2">

                        <button
                            type="button"
                            onClick={() =>
                                loadDepartments(false)
                            }
                            disabled={refreshing}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                        >

                            <RefreshCw
                                size={16}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            <span className="hidden sm:inline">
                                Refresh
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                        >

                            <Plus size={17} />

                            Add Department

                        </button>

                    </div>

                </div>


                {/* =====================================================
                    ALERTS
                ====================================================== */}

                {error && (

                    <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                        >
                            <X size={16} />
                        </button>

                    </div>
                )}


                {success && (

                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">

                        <CheckCircle2 size={17} />

                        {success}

                    </div>
                )}


                {/* =====================================================
                    SUMMARY + SEARCH
                ====================================================== */}

                <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


                        <div>

                            <p className="text-lg font-bold text-slate-900">
                                {departments.length}
                            </p>

                            <p className="text-xs text-slate-500">
                                Municipal departments
                            </p>

                        </div>


                        <div className="relative w-full sm:max-w-md">

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
                                placeholder="Search department..."
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                            />

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    DESKTOP TABLE
                ====================================================== */}

                <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">

                    <table className="w-full text-left">

                        <thead className="border-b border-slate-200 bg-slate-50">

                            <tr>

                                <th className="w-16 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    #
                                </th>

                                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    Department
                                </th>

                                <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    Description
                                </th>

                                <th className="w-28 px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                            {filteredDepartments.map(
                                (department, index) => (

                                    <tr
                                        key={
                                            getId(
                                                department
                                            ) ?? index
                                        }
                                        className="transition hover:bg-slate-50"
                                    >

                                        <td className="px-5 py-4 text-sm font-semibold text-slate-400">

                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}

                                        </td>


                                        <td className="px-5 py-4">

                                            <p className="font-semibold text-slate-900">
                                                {getName(
                                                    department
                                                )}
                                            </p>

                                        </td>


                                        <td className="max-w-2xl px-5 py-4">

                                            <p className="line-clamp-2 text-sm leading-5 text-slate-600">
                                                {getDescription(
                                                    department
                                                )}
                                            </p>

                                        </td>


                                        <td className="px-5 py-4">

                                            <div className="flex justify-end gap-1">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openDetails(
                                                            department
                                                        )
                                                    }
                                                    className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                                    title="View department"
                                                >

                                                    <Eye size={17} />

                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEdit(
                                                            department
                                                        )
                                                    }
                                                    className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                                                    title="Edit department"
                                                >

                                                    <Pencil size={17} />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>


                    {filteredDepartments.length === 0 && (
                        <EmptyState
                            search={search}
                        />
                    )}

                </div>


                {/* =====================================================
                    MOBILE
                ====================================================== */}

                <div className="space-y-3 md:hidden">

                    {filteredDepartments.map(
                        (department, index) => (

                            <div
                                key={
                                    getId(
                                        department
                                    ) ?? index
                                }
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                            >

                                <div className="flex items-start justify-between gap-3">

                                    <div className="min-w-0">

                                        <p className="font-semibold text-slate-900">
                                            {getName(
                                                department
                                            )}
                                        </p>

                                        <p className="mt-0.5 text-[11px] text-slate-400">
                                            Department{" "}
                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}
                                        </p>

                                    </div>


                                    <div className="flex shrink-0 gap-1">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDetails(
                                                    department
                                                )
                                            }
                                            className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                            title="View"
                                        >
                                            <Eye size={17} />
                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEdit(
                                                    department
                                                )
                                            }
                                            className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                                            title="Edit"
                                        >
                                            <Pencil size={17} />
                                        </button>

                                    </div>

                                </div>


                                <p className="mt-3 text-sm leading-5 text-slate-600">
                                    {getDescription(
                                        department
                                    )}
                                </p>

                            </div>

                        )
                    )}


                    {filteredDepartments.length === 0 && (
                        <EmptyState
                            search={search}
                        />
                    )}

                </div>

            </div>


            {/* =========================================================
                DETAILS MODAL
            ========================================================== */}

            {selected && (

                <Modal
                    onClose={() =>
                        setSelected(null)
                    }
                >

                    {detailsLoading ? (

                        <div className="flex min-h-[220px] items-center justify-center">

                            <Loader2
                                size={28}
                                className="animate-spin text-blue-600"
                            />

                        </div>

                    ) : (

                        <>

                            <ModalHeader
                                title="Department Details"
                                subtitle="Municipal service department"
                                onClose={() =>
                                    setSelected(null)
                                }
                            />


                            <div className="p-5">

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        Department
                                    </p>

                                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                                        {getName(
                                            selected
                                        )}
                                    </h2>

                                </div>


                                <div className="mt-4 rounded-xl border border-slate-200 p-4">

                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        Description
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-slate-700">
                                        {getDescription(
                                            selected
                                        )}
                                    </p>

                                </div>


                                <div className="mt-5 flex justify-end gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelected(
                                                null
                                            )
                                        }
                                        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Close
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => {

                                            const department =
                                                selected;

                                            setSelected(
                                                null
                                            );

                                            openEdit(
                                                department
                                            );

                                        }}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                                    >

                                        <Pencil size={16} />

                                        Edit

                                    </button>

                                </div>

                            </div>

                        </>

                    )}

                </Modal>

            )}


            {/* =========================================================
                CREATE / EDIT MODAL
            ========================================================== */}

            {showForm && (

                <Modal
                    onClose={closeForm}
                >

                    <ModalHeader
                        title={
                            editing
                                ? "Edit Department"
                                : "Create Department"
                        }
                        subtitle={
                            editing
                                ? "Update department information"
                                : "Add a municipal service department"
                        }
                        onClose={closeForm}
                    />


                    <form
                        onSubmit={handleSubmit}
                        className="p-5"
                    >

                        {formError && (

                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                                {formError}
                            </div>

                        )}


                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                            Department Name
                        </label>


                        <input
                            type="text"
                            name="departmentName"
                            value={
                                form.departmentName
                            }
                            onChange={handleChange}
                            maxLength={100}
                            disabled={saving}
                            autoFocus
                            placeholder="Enter department name"
                            className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                        />


                        <div className="mt-1 text-right text-[10px] text-slate-400">
                            {
                                form.departmentName
                                    .length
                            }
                            /100
                        </div>


                        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-500">
                            Description
                        </label>


                        <textarea
                            name="description"
                            value={
                                form.description
                            }
                            onChange={handleChange}
                            rows={4}
                            maxLength={500}
                            disabled={saving}
                            placeholder="Enter department description"
                            className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm leading-5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                        />


                        <div className="mt-1 text-right text-[10px] text-slate-400">
                            {
                                form.description
                                    .length
                            }
                            /500
                        </div>


                        <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">

                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={saving}
                                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                            >

                                {saving && (

                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />

                                )}

                                {editing
                                    ? "Save Changes"
                                    : "Create Department"}

                            </button>

                        </div>

                    </form>

                </Modal>

            )}

        </div>
    );
}


/* =============================================================
   EMPTY STATE
============================================================= */

function EmptyState({ search }) {

    return (

        <div className="px-5 py-14 text-center">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">

                <Search size={20} />

            </div>


            <p className="mt-3 text-sm font-bold text-slate-700">
                No departments found
            </p>


            <p className="mt-1 text-xs text-slate-400">

                {search
                    ? "Try a different search."
                    : "Add your first department."}

            </p>

        </div>

    );
}


/* =============================================================
   MODAL
============================================================= */

function Modal({
    children,
    onClose,
}) {

    return (

        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

                {children}

            </div>

        </div>

    );
}


/* =============================================================
   MODAL HEADER
============================================================= */

function ModalHeader({
    title,
    subtitle,
    onClose,
}) {

    return (

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    Department Management
                </p>


                <h2 className="mt-0.5 text-base font-bold text-slate-900">
                    {title}
                </h2>


                <p className="mt-0.5 text-xs text-slate-500">
                    {subtitle}
                </p>

            </div>


            <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
                <X size={18} />
            </button>

        </div>

    );
}