import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Clock3,
    Edit3,
    XCircle,
} from "lucide-react";

import {
    getAdminDepartmentById,
} from "../../../api/adminApi";


// =========================================================
// DEPARTMENT DETAILS
// =========================================================

function DepartmentDetails() {

    const {
        departmentId,
    } = useParams();


    const [
        department,
        setDepartment,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // =====================================================
    // LOAD DEPARTMENT
    // =====================================================

    useEffect(() => {

        let mounted = true;


        const loadDepartment = async () => {

            try {

                setLoading(true);
                setError("");


                const data =
                    await getAdminDepartmentById(
                        departmentId
                    );


                if (mounted) {

                    setDepartment(data);

                }

            } catch (err) {

                if (mounted) {

                    setError(
                        err?.response?.data?.message ||
                        "Unable to load department details."
                    );

                }

            } finally {

                if (mounted) {

                    setLoading(false);

                }

            }

        };


        loadDepartment();


        return () => {

            mounted = false;

        };

    }, [
        departmentId,
    ]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div
                className="
                    mx-auto
                    max-w-5xl
                "
            >

                <div
                    className="
                        animate-pulse
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                    "
                >

                    <div
                        className="
                            h-6
                            w-56
                            rounded
                            bg-slate-200
                        "
                    />

                    <div
                        className="
                            mt-4
                            h-4
                            w-96
                            max-w-full
                            rounded
                            bg-slate-100
                        "
                    />

                    <div
                        className="
                            mt-8
                            grid
                            gap-4
                            sm:grid-cols-2
                        "
                    >

                        <div
                            className="
                                h-24
                                rounded-xl
                                bg-slate-100
                            "
                        />

                        <div
                            className="
                                h-24
                                rounded-xl
                                bg-slate-100
                            "
                        />

                    </div>

                </div>

            </div>

        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div
                className="
                    mx-auto
                    max-w-5xl
                "
            >

                <Link
                    to="/admin/departments"
                    className="
                        mb-5
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-slate-600
                        hover:text-blue-600
                    "
                >

                    <ArrowLeft
                        size={17}
                    />

                    Back to Departments

                </Link>


                <div
                    className="
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        p-6
                        text-red-700
                    "
                >

                    {error}

                </div>

            </div>

        );
    }


    if (!department) {

        return null;

    }


    const isActive =
        department.active === true;


    return (

        <div
            className="
                mx-auto
                max-w-5xl
            "
        >

            {/* =================================================
                BACK
            ================================================= */}

            <Link
                to="/admin/departments"
                className="
                    mb-5
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-slate-600
                    transition
                    hover:text-blue-600
                "
            >

                <ArrowLeft
                    size={17}
                />

                Departments

            </Link>


            {/* =================================================
                HEADER
            ================================================= */}

            <section
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-5
                        border-b
                        border-slate-100
                        p-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:p-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >

                        <div
                            className="
                                flex
                                h-14
                                w-14
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-50
                                text-blue-700
                            "
                        >

                            <Building2
                                size={27}
                            />

                        </div>


                        <div>

                            <h1
                                className="
                                    text-xl
                                    font-bold
                                    text-slate-900
                                    sm:text-2xl
                                "
                            >
                                {department.departmentName}
                            </h1>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Department information and
                                administrative status
                            </p>

                        </div>

                    </div>


                    <Link
                        to={`/admin/departments/${department.id}/edit`}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-blue-600
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-blue-700
                        "
                    >

                        <Edit3
                            size={16}
                        />

                        Edit Department

                    </Link>

                </div>


                {/* =================================================
                    INFORMATION
                ================================================= */}

                <div
                    className="
                        grid
                        gap-4
                        p-5
                        sm:grid-cols-2
                        sm:p-6
                    "
                >

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            p-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    rounded-lg
                                    bg-slate-100
                                    p-2
                                    text-slate-600
                                "
                            >

                                <Building2
                                    size={18}
                                />

                            </div>


                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    "
                                >
                                    Department
                                </p>

                                <p
                                    className="
                                        mt-1
                                        font-semibold
                                        text-slate-900
                                    "
                                >
                                    {department.departmentName}
                                </p>

                            </div>

                        </div>

                    </div>


                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            p-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className={`
                                    rounded-lg
                                    p-2
                                    ${isActive
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-red-50 text-red-600"
                                    }
                                `}
                            >

                                {isActive ? (

                                    <CheckCircle2
                                        size={18}
                                    />

                                ) : (

                                    <XCircle
                                        size={18}
                                    />

                                )}

                            </div>


                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    "
                                >
                                    Status
                                </p>

                                <p
                                    className={`
                                        mt-1
                                        font-semibold
                                        ${isActive
                                            ? "text-emerald-700"
                                            : "text-red-700"
                                        }
                                    `}
                                >
                                    {isActive
                                        ? "Active"
                                        : "Inactive"}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div
                    className="
                        border-t
                        border-slate-100
                        p-5
                        sm:p-6
                    "
                >

                    <h2
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        Description
                    </h2>


                    <p
                        className="
                            mt-3
                            text-sm
                            leading-6
                            text-slate-600
                        "
                    >
                        {department.description ||
                            "No description has been provided for this department."}
                    </p>

                </div>


                {/* =================================================
                    TIMESTAMPS
                ================================================= */}

                <div
                    className="
                        grid
                        gap-4
                        border-t
                        border-slate-100
                        p-5
                        sm:grid-cols-2
                        sm:p-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <Clock3
                            size={18}
                            className="
                                text-slate-400
                            "
                        />

                        <div>

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Created
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-medium
                                    text-slate-800
                                "
                            >
                                {department.createdAt
                                    ? new Date(
                                        department.createdAt
                                    ).toLocaleString()
                                    : "—"}
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <Clock3
                            size={18}
                            className="
                                text-slate-400
                            "
                        />

                        <div>

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Last Updated
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-medium
                                    text-slate-800
                                "
                            >
                                {department.updatedAt
                                    ? new Date(
                                        department.updatedAt
                                    ).toLocaleString()
                                    : "—"}
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}


export default DepartmentDetails;