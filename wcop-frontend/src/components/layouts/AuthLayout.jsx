import { Link } from "react-router-dom";

function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-slate-50">

            {/* =====================================================
                AUTHENTICATION HEADER
            ===================================================== */}

            <header className="border-b border-slate-200 bg-white">

                <div
                    className="
                        mx-auto
                        flex
                        h-16
                        w-full
                        max-w-[1600px]
                        items-center
                        justify-between
                        px-3
                        sm:px-4
                        lg:px-6
                        xl:px-8
                    "
                >

                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <Link
                        to="/"
                        className="flex items-center gap-3"
                    >

                        {/* Logo */}

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-600
                                text-lg
                                font-bold
                                text-white
                                shadow-sm
                            "
                        >
                            C
                        </div>

                        {/* Brand Name */}

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-bold
                                    text-slate-900
                                    sm:text-base
                                "
                            >
                                Citizen Complaint
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                    sm:text-sm
                                "
                            >
                                Management System
                            </p>

                        </div>

                    </Link>


                    {/* =================================================
                        BACK TO HOME
                    ================================================= */}

                    <Link
                        to="/"
                        className="
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-slate-600
                            transition
                            hover:bg-slate-100
                            hover:text-slate-900
                        "
                    >
                        Back to Home
                    </Link>

                </div>

            </header>


            {/* =====================================================
                AUTHENTICATION CONTENT
            ===================================================== */}

            <main
                className="
                    flex
                    min-h-[calc(100vh-4rem)]
                    items-center
                    justify-center
                    px-4
                    py-10
                    sm:px-6
                    sm:py-14
                "
            >

                <div className="w-full max-w-md">

                    {/* =================================================
                        PAGE HEADING
                    ================================================= */}

                    <div className="mb-8 text-center">

                        <h1
                            className="
                                text-3xl
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            {title}
                        </h1>


                        <p
                            className="
                                mx-auto
                                mt-3
                                max-w-sm
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            {subtitle}
                        </p>

                    </div>


                    {/* =================================================
                        PAGE CONTENT
                    ================================================= */}

                    {children}

                </div>

            </main>

        </div>
    );
}

export default AuthLayout;