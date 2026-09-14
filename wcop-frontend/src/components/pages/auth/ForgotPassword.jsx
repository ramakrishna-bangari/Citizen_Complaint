import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { forgotPassword } from "../../../api/authApi";

function ForgotPassword() {
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const value = identifier.trim();

        if (!value) {
            setError(
                "Please enter your registered email address or mobile number."
            );
            return;
        }

        try {
            setLoading(true);

            await forgotPassword(value);

            sessionStorage.setItem(
                "passwordResetIdentifier",
                value
            );

            setSuccess("Verification code sent successfully.");

            setTimeout(() => {
                navigate("/reset-password");
            }, 700);
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                "Unable to send the verification code. Please check your details and try again."
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
                        to="/login"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
                    >
                        <ArrowLeft size={16} />
                        Back to Sign In
                    </Link>

                    <div className="mb-7">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Forgot Password
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Enter your registered email address or mobile
                            number to receive a verification code.
                        </p>
                    </div>

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
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
                    >
                        <div>
                            <label
                                htmlFor="identifier"
                                className="block text-sm font-semibold text-slate-700"
                            >
                                Email or Mobile Number
                            </label>

                            <input
                                id="identifier"
                                type="text"
                                value={identifier}
                                onChange={(event) =>
                                    setIdentifier(event.target.value)
                                }
                                placeholder="Enter email or mobile number"
                                autoComplete="username"
                                className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && (
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                            )}

                            {loading
                                ? "Sending Code..."
                                : "Send Verification Code"}
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

export default ForgotPassword;