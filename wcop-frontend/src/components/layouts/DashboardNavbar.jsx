import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ChevronDown,
    LogOut,
    UserRound,
    X,
    ShieldCheck,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useAuth,
} from "../hooks/useAuth";


function DashboardNavbar() {

    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();


    const [menuOpen, setMenuOpen] = useState(false);

    const [logoutOpen, setLogoutOpen] = useState(false);

    const menuRef = useRef(null);


    // =========================================================
    // USER INFORMATION
    // =========================================================

    const firstName =
        user?.firstName || "";

    const lastName =
        user?.lastName || "";

    const fullName =
        `${firstName} ${lastName}`.trim() ||
        user?.email ||
        "User";

    const role =
        String(user?.role || "USER").toUpperCase();


    // =========================================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // =========================================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // =========================================================
    // PROFILE ROUTE BASED ON ROLE
    // =========================================================

    const getProfilePath = () => {

        if (role === "ADMIN") {
            return "/admin/profile";
        }

        if (role === "OFFICER") {
            return "/officer/profile";
        }

        return "/citizen/profile";
    };


    // =========================================================
    // PROFILE
    // =========================================================

    const handleProfile = () => {

        setMenuOpen(false);

        navigate(getProfilePath());
    };


    // =========================================================
    // LOGOUT REQUEST
    // =========================================================

    const handleLogoutClick = () => {

        setMenuOpen(false);

        setLogoutOpen(true);
    };


    // =========================================================
    // CONFIRM LOGOUT
    // =========================================================

    const handleConfirmLogout = async () => {

        try {

            await logout();

            setLogoutOpen(false);

            navigate(
                "/login",
                {
                    replace: true,
                }
            );

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

        }

    };


    return (
        <>
            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <header
                className="
                    sticky
                    top-0
                    z-40
                    h-16
                    border-b
                    border-slate-200
                    bg-white
                "
            >

                <div
                    className="
                        flex
                        h-full
                        items-center
                        justify-between
                        px-4
                        sm:px-6
                        lg:px-8
                    "
                >

                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="
                            min-w-0
                            text-left
                        "
                    >

                        <h1
                            className="
                                truncate
                                text-base
                                font-bold
                                tracking-tight
                                text-blue-700
                                sm:text-lg
                            "
                        >
                            Citizen Complaint Management System
                        </h1>

                    </button>


                    {/* =================================================
                        USER MENU
                    ================================================= */}

                    <div
                        ref={menuRef}
                        className="relative"
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setMenuOpen(
                                    (previous) =>
                                        !previous
                                )
                            }
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                px-2
                                py-1.5
                                transition
                                hover:bg-slate-50
                            "
                        >

                            {/* USER NAME */}

                            <div
                                className="
                                    hidden
                                    text-right
                                    sm:block
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-800
                                    "
                                >
                                    {fullName}
                                </p>

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-wide
                                        text-slate-400
                                    "
                                >
                                    {role}
                                </p>

                            </div>


                            {/* USER ICON */}

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-50
                                    text-blue-700
                                "
                            >

                                <UserRound size={18} />

                            </div>


                            <ChevronDown
                                size={16}
                                className={`
                                    text-slate-400
                                    transition-transform
                                    ${menuOpen
                                        ? "rotate-180"
                                        : ""
                                    }
                                `}
                            />

                        </button>


                        {/* =================================================
                            DROPDOWN
                        ================================================= */}

                        {menuOpen && (

                            <div
                                className="
                                    absolute
                                    right-0
                                    top-full
                                    z-50
                                    mt-2
                                    w-64
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    shadow-lg
                                "
                            >

                                {/* USER INFORMATION */}

                                <div
                                    className="
                                        border-b
                                        border-slate-100
                                        px-4
                                        py-3
                                    "
                                >

                                    <p
                                        className="
                                            truncate
                                            text-sm
                                            font-semibold
                                            text-slate-800
                                        "
                                    >
                                        {fullName}
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            truncate
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        {user?.email || ""}
                                    </p>


                                    <div
                                        className="
                                            mt-2
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            rounded-full
                                            bg-blue-50
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-semibold
                                            text-blue-700
                                        "
                                    >

                                        <ShieldCheck size={13} />

                                        {role}

                                    </div>

                                </div>


                                {/* PROFILE */}

                                <button
                                    type="button"
                                    onClick={handleProfile}
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        px-4
                                        py-3
                                        text-left
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        hover:bg-slate-50
                                    "
                                >

                                    <UserRound
                                        size={17}
                                        className="text-slate-400"
                                    />

                                    Profile

                                </button>


                                {/* LOGOUT */}

                                <button
                                    type="button"
                                    onClick={handleLogoutClick}
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        border-t
                                        border-slate-100
                                        px-4
                                        py-3
                                        text-left
                                        text-sm
                                        font-semibold
                                        text-red-600
                                        hover:bg-red-50
                                    "
                                >

                                    <LogOut size={17} />

                                    Sign out

                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </header>


            {/* =========================================================
                LOGOUT CONFIRMATION
            ========================================================= */}

            {logoutOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-slate-900/40
                        px-4
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-sm
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-xl
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    Sign out?
                                </h2>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >
                                    Are you sure you want
                                    to sign out of your
                                    account?
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setLogoutOpen(false)
                                }
                                className="
                                    rounded-lg
                                    p-1.5
                                    text-slate-400
                                    hover:bg-slate-100
                                    hover:text-slate-600
                                "
                            >

                                <X size={18} />

                            </button>

                        </div>


                        <div
                            className="
                                mt-6
                                flex
                                gap-3
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setLogoutOpen(false)
                                }
                                className="
                                    flex-1
                                    rounded-lg
                                    border
                                    border-slate-300
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    hover:bg-slate-50
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={handleConfirmLogout}
                                className="
                                    flex-1
                                    rounded-lg
                                    bg-red-600
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    hover:bg-red-700
                                "
                            >
                                Sign out
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}


export default DashboardNavbar;