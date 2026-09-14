import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";
import { resetPassword } from "../../../api/authApi";

function ResetPassword() {
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const savedIdentifier = sessionStorage.getItem(
            "passwordResetIdentifier"
        );

        if (!savedIdentifier) {
            navigate("/forgot-password", {
                replace: true,
            });
            return;
        }

        setIdentifier(savedIdentifier);
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!/^\d{6}$/.test(otp.trim())) {
            setError(
                "Please enter the 6-digit verification code."
            );
            return;
        }

        if (newPassword.length < 8) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "New password and confirm password do not match."
            );
            return;
        }

        try {
            setLoading(true);

            await resetPassword({
                identifier: identifier,
                otp: otp.trim(),
                newPassword: newPassword,
            });

            sessionStorage.removeItem(
                "passwordResetIdentifier"
            );

            setSuccess(
                "Password reset successfully. Redirecting to sign in..."
            );

            setTimeout(() => {
                navigate("/login", {
                    replace: true,
                });
            }, 1200);
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                "Unable to reset your password. Please check the verification code and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex min-h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                    <Link
                        to="/"
                        className="text-sm font-semibold text-slate-900 sm:text-base"
                    >
                        Citizen Services
                    </Link>
                </div>
            </header>

            <main className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-8 sm:items-center sm:py-12">
                <div className="w-full max-w-md">
                    <Link
                        to="/forgot-password"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>

                    <div className="mb-7">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Reset Password
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Enter the verification code and create a new password.
                        </p>
                    </div>

                    {identifier && (
                        <div className="mb-5 rounded-lg border border-slate-200 bg-white px-4 py-3">
                            <p className="text-xs font-medium text-slate-500">
                                Account
                            </p>

                            <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                                {identifier}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700">
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
                    >
                        <div>
                            <label
                                htmlFor="otp"
                                className="block text-sm font-semibold text-slate-700"
                            >
                                Verification Code
                            </label>

                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(event) => {
                                    const value =
                                        event.target.value.replace(
                                            /\D/g,
                                            ""
                                        );

                                    setOtp(value);
                                }}
                                placeholder="Enter 6-digit code"
                                autoComplete="one-time-code"
                                className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-4 text-center text-lg font-semibold tracking-[0.3em] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-semibold text-slate-700"
                            >
                                New Password
                            </label>

                            <div className="relative mt-2">
                                <input
                                    id="newPassword"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                    className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) => !value
                                        )
                                    }
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-700"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                Minimum 8 characters.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-semibold text-slate-700"
                            >
                                Confirm New Password
                            </label>

                            <div className="relative mt-2">
                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                    className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (value) => !value
                                        )
                                    }
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-700"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && (
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                            )}

                            {loading
                                ? "Resetting Password..."
                                : "Reset Password"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-sm text-slate-500">
                            Remember your password?
                        </span>{" "}

                        <Link
                            to="/login"
                            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ResetPassword;