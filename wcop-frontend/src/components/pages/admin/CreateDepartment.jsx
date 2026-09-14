import {
    ArrowLeft,
    Building2,
    Loader2,
    Save,
} from "lucide-react";

import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    createDepartment,
} from "../../../api/departmentApi";


function CreateDepartment() {

    const navigate = useNavigate();


    // =========================================================
    // FORM
    // =========================================================

    const [formData, setFormData] = useState({
        departmentName: "",
        description: "",
    });


    // =========================================================
    // STATE
    // =========================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setError("");
    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        const departmentName =
            formData.departmentName.trim();

        const description =
            formData.description.trim();


        // -----------------------------------------------------
        // CLIENT VALIDATION
        // -----------------------------------------------------

        if (!departmentName) {

            setError(
                "Department name is required."
            );

            return;
        }


        if (departmentName.length > 100) {

            setError(
                "Department name cannot exceed 100 characters."
            );

            return;
        }


        if (description.length > 500) {

            setError(
                "Description cannot exceed 500 characters."
            );

            return;
        }


        try {

            setLoading(true);


            await createDepartment({
                departmentName,
                description:
                    description || null,
            });


            setSuccess(
                "Department created successfully."
            );


            setFormData({
                departmentName: "",
                description: "",
            });


            setTimeout(() => {

                navigate(
                    "/admin/departments"
                );

            }, 700);

        } catch (err) {

            console.error(
                "Create department failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Failed to create department."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="mx-auto max-w-3xl space-y-6">


            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/departments"
                            )
                        }
                        className="
                            mb-3
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-slate-500
                            hover:text-slate-800
                        "
                    >

                        <ArrowLeft size={16} />

                        Back to Departments

                    </button>


                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                            "
                        >
                            <Building2
                                size={22}
                            />
                        </div>


                        <div>

                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Create Department
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Add a new operational department.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
                onSubmit={handleSubmit}
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >

                <div className="space-y-6 p-6 sm:p-8">


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div
                            className="
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-red-700
                            "
                        >
                            {error}
                        </div>

                    )}


                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {success && (

                        <div
                            className="
                                rounded-lg
                                border
                                border-emerald-200
                                bg-emerald-50
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-emerald-700
                            "
                        >
                            {success}
                        </div>

                    )}


                    {/* =================================================
                        DEPARTMENT NAME
                    ================================================= */}

                    <div>

                        <label
                            htmlFor="departmentName"
                            className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                            "
                        >
                            Department Name
                        </label>

                        <input
                            id="departmentName"
                            name="departmentName"
                            type="text"
                            value={
                                formData.departmentName
                            }
                            onChange={
                                handleChange
                            }
                            maxLength={100}
                            placeholder="Enter department name"
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-3
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                                disabled:bg-slate-50
                            "
                        />

                        <p
                            className="
                                mt-1.5
                                text-xs
                                text-slate-400
                            "
                        >
                            Maximum 100 characters.
                        </p>

                    </div>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <div>

                        <label
                            htmlFor="description"
                            className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                            "
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            maxLength={500}
                            rows={5}
                            placeholder="Enter department description"
                            disabled={loading}
                            className="
                                w-full
                                resize-none
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-3
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                                disabled:bg-slate-50
                            "
                        />

                        <div
                            className="
                                mt-1.5
                                flex
                                justify-between
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Maximum 500 characters.
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                {
                                    formData.description.length
                                }
                                /500
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        INFO
                    ================================================= */}

                    <div
                        className="
                            rounded-lg
                            border
                            border-blue-100
                            bg-blue-50
                            px-4
                            py-3
                            text-sm
                            text-blue-700
                        "
                    >
                        New departments are created as{" "}
                        <strong>Active</strong> by the backend.
                    </div>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div
                    className="
                        flex
                        flex-col-reverse
                        gap-3
                        border-t
                        border-slate-100
                        p-6
                        sm:flex-row
                        sm:justify-end
                        sm:p-8
                    "
                >

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/departments"
                            )
                        }
                        disabled={loading}
                        className="
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-slate-700
                            hover:bg-slate-50
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-blue-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        {loading ? (

                            <Loader2
                                size={17}
                                className="animate-spin"
                            />

                        ) : (

                            <Save size={17} />

                        )}

                        {loading
                            ? "Creating..."
                            : "Create Department"}

                    </button>

                </div>

            </form>

        </div>
    );
}


export default CreateDepartment;