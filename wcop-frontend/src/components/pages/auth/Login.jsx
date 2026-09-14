import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../../api/axios";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const justRegistered = Boolean(location.state?.registered);

    const [loginType, setLoginType] = useState("password");


    const [identifier, setIdentifier] = useState( location.state?.identifier || "" );
    const [password, setPassword] = useState("");

    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");


    const [otpSent, setOtpSent] = useState(false);
    const [resendSeconds, setResendSeconds] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(
        justRegistered
            ? "Account created successfully. Please sign in to continue."
            : ""
    );

    useEffect(() => {
        if (justRegistered) {
            navigate(location.pathname, {
                replace: true,
                state: {},
            });
        }
    }, []);

    useEffect(() => {
        if (resendSeconds <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setResendSeconds((seconds) => {
                if (seconds <= 1) {
                    return 0;
                }

                return seconds - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [resendSeconds]);

   
    const clearMessages = () => {
        setError("");
        setSuccess("");
    };


    const cleanMobile = mobile.replace(/\D/g, "");
    const isValidMobile = /^[6-9]\d{9}$/.test(cleanMobile);

    const getErrorMessage = (error, fallback) => {
        const responseData = error?.response?.data;

        if (typeof responseData === "string") {
            return responseData;
        }

        return (
            responseData?.message ||
            responseData?.error ||
            fallback
        );
    };

    // GET USER FROM RESPONSE
    // =========================================================

    const getUserFromResponse = (data) => {
        return (
            data?.user ||
            data?.data?.user ||
            data?.result?.user ||
            null
        );
    };


    const redirectByRole = (user) => {
        const role = String(
            user?.role ||
            user?.roleName ||
            user?.roles?.[0] ||
            ""
        )
            .replace(/^ROLE_/i, "")
            .toUpperCase();

        switch (role) {
            case "CITIZEN":
                navigate("/citizen/dashboard", {
                    replace: true,
                });
                return true;

            case "OFFICER":
                navigate("/officer/dashboard", {
                    replace: true,
                });
                return true;

            case "ADMIN":
                navigate("/admin/dashboard", {
                    replace: true,
                });
                return true;

            default:
                return false;
        }
    };

    const handlePasswordLogin = async (event) => {
        event.preventDefault();

        clearMessages();

        const value = identifier.trim();

        if (!value) {
            setError( "Please enter your email or mobile number." );
            return;
        }

        if (!password.trim()) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);
            const result = await login({
                identifier: value,
                password: password,
            });

            const user =
                result?.user ||
                result?.data?.user ||
                result;

            const redirected =
                redirectByRole(user);

            if (!redirected) {
                setError(
                    "Login successful, but the account role could not be determined."
                );
            }
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    "Invalid email/mobile number or password."
                )
            );
        } finally {
            setLoading(false);
        }
    };


    const handleSendOtp = async (event) => {
        event.preventDefault();

        clearMessages();

        if (!isValidMobile) {
            setError(
                "Please enter a valid 10-digit mobile number."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/otp/send",
                {
                    phone: cleanMobile,
                }
            );

            setOtpSent(true);
            setOtp("");
            setResendSeconds(60);

            setSuccess(
                response?.data?.message ||
                "OTP sent successfully to your registered mobile number."
            );
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    "Unable to send OTP. Please try again."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (event) => {
        event.preventDefault();

        clearMessages();

        if (!isValidMobile) {
            setError(
                "Please enter a valid 10-digit mobile number."
            );
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setError(
                "Please enter the 6-digit OTP."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/otp/verify",
                {
                    phone: cleanMobile,
                    otp: otp.trim(),
                }
            );

            const data = response?.data;

            if (data?.accessToken) {
                localStorage.setItem(
                    "accessToken",
                    data.accessToken
                );
            }

          
            if (data?.refreshToken) {
                localStorage.setItem(
                    "refreshToken",
                    data.refreshToken
                );
            }

            const user =
                getUserFromResponse(data);

            // =================================================
            // REDIRECT
            // =================================================

            const redirected =
                redirectByRole(user);

            if (!redirected) {
                setError(
                    "Login successful, but the account role could not be determined."
                );
                return;
            }
        } catch (error) {
            setError(
                getErrorMessage(
                    error,
                    "Invalid or expired OTP."
                )
            );
        } finally {
            setLoading(false);
        }
    };



    const changeLoginType = (type) => {
        setLoginType(type);

        setIdentifier("");
        setPassword("");

        setMobile("");
        setOtp("");

        setOtpSent(false);
        setResendSeconds(0);

        clearMessages();
    };

    const changeMobile = () => {
        setOtpSent(false);
        setOtp("");
        setResendSeconds(0);

        clearMessages();
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-3 sm:px-4 lg:px-6 xl:px-8">
                  

                    <Link
                        to="/"
                        className="flex min-w-0 items-center gap-3"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
                            C
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900 sm:text-base">
                                Citizen Complaint
                            </p>

                            <p className="truncate text-xs text-slate-500 sm:text-sm">
                                Management System
                            </p>
                        </div>
                    </Link>

            
                    <Link
                        to="/register"
                        className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md sm:px-5"
                    >
                        Register
                    </Link>
                </div>
            </header>

            <main className="flex min-h-[calc(100vh-4rem)] w-full items-start justify-center px-4 py-8 sm:items-center sm:px-6 sm:py-10 lg:px-8">
                <section className="w-full max-w-[440px]">
                
                    <div className="mb-6 text-center sm:mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Sign in
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Access your account securely.
                        </p>
                    </div>

            
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                        {/* LOGIN METHOD*/}

                        <div className="mb-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
                            {/* PASSWORD */}

                            <button
                                type="button"
                                onClick={() =>
                                    changeLoginType("password")
                                }
                                className={`min-h-11 rounded-md px-3 text-sm font-semibold transition ${loginType === "password"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                Password
                            </button>

                            {/* OTP */}

                            <button
                                type="button"
                                onClick={() =>
                                    changeLoginType("otp")
                                }
                                className={`min-h-11 rounded-md px-3 text-sm font-semibold transition ${loginType === "otp"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                OTP
                            </button>
                        </div>


                        {error && (
                            <div
                                role="alert"
                                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        {success && (
                            <div
                                role="status"
                                className="mb-5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700"
                            >
                                <span>{success}</span>
                            </div>
                        )}

                        {/* =================================================
                            PASSWORD LOGIN
                        ================================================= */}

                        {loginType === "password" && (
                            <form
                                onSubmit={handlePasswordLogin}
                                className="space-y-5"
                            >
                                {/* EMAIL OR MOBILE */}

                                <div>
                                    <label
                                        htmlFor="loginIdentifier"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Email or mobile number
                                    </label>

                                    <input
                                        id="loginIdentifier"
                                        type="text"
                                        autoComplete="username"
                                        value={identifier}
                                        onChange={(event) => {
                                            setIdentifier(
                                                event.target.value
                                            );
                                            clearMessages();
                                        }}
                                        placeholder="Enter email or mobile number"
                                        disabled={loading}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 disabled:bg-slate-100"
                                    />
                                </div>

                                {/* PASSWORD */}

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Password
                                        </label>

                                        <Link
                                            to="/forgot-password"
                                            className="flex min-h-10 items-center px-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(
                                                event.target.value
                                            );
                                            clearMessages();
                                        }}
                                        placeholder="Enter your password"
                                        disabled={loading}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 disabled:bg-slate-100"
                                    />
                                </div>

                                {/* SIGN IN */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="min-h-12 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Signing in..."
                                        : "Sign In"}
                                </button>
                            </form>
                        )}

                        {/* =================================================
                            OTP LOGIN
                        ================================================= */}

                        {loginType === "otp" && (
                            <form
                                onSubmit={
                                    otpSent
                                        ? handleVerifyOtp
                                        : handleSendOtp
                                }
                                className="space-y-5"
                            >
                                {/* MOBILE NUMBER */}

                                <div>
                                    <label
                                        htmlFor="otpMobile"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Mobile number
                                    </label>

                                    <div className="flex">
                                        {/* COUNTRY CODE */}

                                        <div className="flex min-w-[58px] items-center justify-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm font-medium text-slate-600">
                                            +91
                                        </div>

                                        {/* MOBILE */}

                                        <input
                                            id="otpMobile"
                                            type="tel"
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            maxLength={10}
                                            value={mobile}
                                            onChange={(event) => {
                                                const value =
                                                    event.target.value
                                                        .replace(
                                                            /\D/g,
                                                            ""
                                                        )
                                                        .slice(0, 10);

                                                setMobile(value);

                                                if (otpSent) {
                                                    setOtpSent(false);
                                                    setOtp("");
                                                    setResendSeconds(0);
                                                }

                                                clearMessages();
                                            }}
                                            placeholder="10-digit mobile number"
                                            disabled={loading}
                                            className="min-w-0 flex-1 rounded-r-lg border border-slate-300 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 disabled:bg-slate-100"
                                        />
                                    </div>
                                </div>

                                {/* OTP */}

                                {otpSent && (
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label
                                                htmlFor="otp"
                                                className="text-sm font-semibold text-slate-700"
                                            >
                                                Enter OTP
                                            </label>

                                            <button
                                                type="button"
                                                onClick={changeMobile}
                                                className="flex min-h-10 items-center px-2 text-xs font-semibold text-slate-600 hover:text-blue-600"
                                            >
                                                Change number
                                            </button>
                                        </div>

                                        <input
                                            id="otp"
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(event) => {
                                                setOtp(
                                                    event.target.value
                                                        .replace(
                                                            /\D/g,
                                                            ""
                                                        )
                                                        .slice(0, 6)
                                                );
                                                clearMessages();
                                            }}
                                            placeholder="Enter 6-digit OTP"
                                            disabled={loading}
                                            autoFocus
                                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-xl font-semibold tracking-[0.35em] text-slate-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 disabled:bg-slate-100"
                                        />

                                        {/* RESEND */}

                                        <div className="flex min-h-10 items-center justify-center">
                                            {resendSeconds > 0 ? (
                                                <p className="text-xs text-slate-500">
                                                    Resend available in{" "}
                                                    <span className="font-semibold text-slate-700">
                                                        {resendSeconds}s
                                                    </span>
                                                </p>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleSendOtp}
                                                    disabled={loading}
                                                    className="min-h-10 px-3 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
                                                >
                                                    Resend OTP
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* OTP BUTTON */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="min-h-12 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Please wait..."
                                        : otpSent
                                            ? "Verify & Sign In"
                                            : "Send OTP"}
                                </button>
                            </form>
                        )}

                        {/* =================================================
                            REGISTER
                        ================================================= */}

                        <div className="mt-6 border-t border-slate-200 pt-5 text-center">
                            <p className="text-sm text-slate-500">
                                Don't have an account?{" "}

                                <Link
                                    to="/register"
                                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Register
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Login;