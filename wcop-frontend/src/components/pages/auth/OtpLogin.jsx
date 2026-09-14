import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../hooks/useAuth";
import { sendOtp } from "../../../api/authApi";

function OtpLogin() {
    const navigate = useNavigate();

    const { loginWithOtp } = useAuth();

    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSendOtp = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        const value = identifier.trim();

        if (!value) {
            setError(
                "Enter your registered email address or mobile number."
            );
            return;
        }

        try {
            setLoading(true);

            await sendOtp(value);

            setOtpSent(true);

            setMessage(
                "Verification code sent. Enter the 6-digit code to continue."
            );
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                "Unable to send the verification code. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        const code = otp.trim();

        if (!/^\d{6}$/.test(code)) {
            setError("Enter the 6-digit verification code.");
            return;
        }

        try {
            setLoading(true);

            const user = await loginWithOtp({
                identifier: identifier.trim(),
                otp: code,
            });

            if (user?.role === "CITIZEN") {
                navigate("/citizen/dashboard", {
                    replace: true,
                });
                return;
            }

            if (user?.role === "OFFICER") {
                navigate("/officer/dashboard", {
                    replace: true,
                });
                return;
            }

            if (user?.role === "ADMIN") {
                navigate("/admin/dashboard", {
                    replace: true,
                });
                return;
            }

            navigate("/", {
                replace: true,
            });
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                "The verification code is invalid or expired."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChangeIdentifier = () => {
        setOtpSent(false);
        setOtp("");
        setError("");
        setMessage("");
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                <div className="mb-7">
                    <Link
                        to="/login"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Back to sign in
                    </Link>

                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <CheckCircle2 size={22} />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Sign in with OTP
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Use your registered email address or mobile number to
                        receive a verification code.
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700">
                        {message}
                    </div>
                )}

                <form
                    onSubmit={
                        otpSent ? handleVerifyOtp : handleSendOtp
                    }
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="identifier"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Email or mobile number
                        </label>

                        <input
                            id="identifier"
                            type="text"
                            value={identifier}
                            disabled={otpSent}
                            onChange={(event) =>
                                setIdentifier(event.target.value)
                            }
                            placeholder="Email or mobile number"
                            autoComplete="username"
                            className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50"
                        />
                    </div>

                    {otpSent && (
                        <div>
                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Verification code
                            </label>

                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(event) =>
                                    setOtp(
                                        event.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                                placeholder="000000"
                                autoComplete="one-time-code"
                                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-xl font-semibold tracking-[0.45em] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading && (
                            <Loader2
                                size={17}
                                className="animate-spin"
                            />
                        )}

                        {loading
                            ? "Please wait..."
                            : otpSent
                                ? "Verify & Sign In"
                                : "Send Verification Code"}
                    </button>
                </form>

                {otpSent && (
                    <button
                        type="button"
                        onClick={handleChangeIdentifier}
                        className="mt-4 w-full py-2 text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Use a different email or mobile number
                    </button>
                )}

                <div className="mt-7 border-t border-slate-200 pt-6 text-center">
                    <p className="text-sm text-slate-500">
                        Prefer password authentication?
                    </p>

                    <Link
                        to="/login"
                        className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Sign in with password
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}

export default OtpLogin;