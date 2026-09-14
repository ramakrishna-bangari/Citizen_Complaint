import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getDepartmentById,
    updateDepartment,
} from "../../../api/departmentApi";


function EditDepartment() {

    const {
        departmentId,
    } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [form, setForm] = useState({
        departmentName: "",
        description: "",
        active: true,
    });

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD DEPARTMENT
    // =====================================================

    useEffect(() => {

        const loadDepartment = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getDepartmentById(
                        departmentId
                    );

                setForm({
                    departmentName:
                        data?.departmentName || "",

                    description:
                        data?.description || "",

                    active:
                        data?.active !== false,
                });

            } catch (err) {

                console.error(
                    "LOAD DEPARTMENT ERROR:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to load department."
                );

            } finally {

                setLoading(false);

            }
        };


        if (departmentId) {
            loadDepartment();
        }

    }, [departmentId]);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;


        setForm((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // -----------------------------------------------
        // VALIDATION
        // -----------------------------------------------

        if (!form.departmentName.trim()) {

            setError(
                "Department name is required."
            );

            return;
        }


        // Active is required by backend.
        if (typeof form.active !== "boolean") {

            setError(
                "Active status is required."
            );

            return;
        }


        try {

            setSaving(true);


            const updated =
                await updateDepartment(
                    departmentId,
                    {
                        departmentName:
                            form.departmentName.trim(),

                        description:
                            form.description.trim(),

                        active:
                            form.active,
                    }
                );


            console.log(
                "UPDATED DEPARTMENT:",
                updated
            );


            setSuccess(
                "Department updated successfully."
            );


            // Go back after successful update.
            setTimeout(() => {

                navigate(
                    "/admin/departments"
                );

            }, 700);


        } catch (err) {

            console.error(
                "UPDATE DEPARTMENT ERROR:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to update department."
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
            <div className="p-6">
                <p className="text-slate-600">
                    Loading department...
                </p>
            </div>
        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50 p-6">

            <div className="mx-auto max-w-3xl">

                {/* HEADER */}

                <div className="mb-6">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/departments"
                            )
                        }
                        className="mb-3 text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        ← Back to Departments
                    </button>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Edit Department
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Update department information and active status.
                    </p>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                    {/* ERROR */}

                    {error && (

                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            {success}
                        </div>

                    )}


                    {/* DEPARTMENT NAME */}

                    <div className="mb-5">

                        <label
                            htmlFor="departmentName"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Department Name
                            <span className="text-red-500">
                                {" "}*
                            </span>
                        </label>

                        <input
                            id="departmentName"
                            name="departmentName"
                            type="text"
                            value={
                                form.departmentName
                            }
                            onChange={
                                handleChange
                            }
                            maxLength={100}
                            required
                            autoComplete="organization"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="Enter department name"
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="mb-5">

                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={
                                form.description
                            }
                            onChange={
                                handleChange
                            }
                            maxLength={500}
                            rows={4}
                            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="Enter department description"
                        />

                        <p className="mt-1 text-xs text-slate-400">
                            Maximum 500 characters.
                        </p>

                    </div>


                    {/* ACTIVE STATUS */}

                    <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">

                        <div className="flex items-center justify-between">

                            <div>

                                <label
                                    htmlFor="active"
                                    className="block text-sm font-semibold text-slate-800"
                                >
                                    Active Status
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <p className="mt-1 text-xs text-slate-500">
                                    Active departments can be selected and used in the system.
                                </p>

                            </div>


                            <label
                                htmlFor="active"
                                className="relative inline-flex cursor-pointer items-center"
                            >

                                <input
                                    id="active"
                                    name="active"
                                    type="checkbox"
                                    checked={
                                        form.active
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="peer sr-only"
                                />

                                <div className="h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-600 peer-checked:after:translate-x-full">
                                </div>

                            </label>

                        </div>


                        <div className="mt-3">

                            {form.active ? (

                                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    Active
                                </span>

                            ) : (

                                <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                    Inactive
                                </span>

                            )}

                        </div>

                    </div>


                    {/* BUTTONS */}

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/departments"
                                )
                            }
                            disabled={saving}
                            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {saving
                                ? "Updating..."
                                : "Update Department"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default EditDepartment;