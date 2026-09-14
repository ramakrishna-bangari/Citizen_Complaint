import {
    useState,
} from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";
import {
    ArrowLeft,
    LockKeyhole,
    Save,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import api from "../../../api/axios";

function UpdatePassword() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!form.currentPassword) {
            setError("Current password is required.");
            return;
        }

        if (!form.newPassword) {
            setError("New password is required.");
            return;
        }

        if (form.newPassword.length < 8) {
            setError(
                "New password must contain at least 8 characters."
            );
            return;
        }

        if (
            form.newPassword ===
            form.currentPassword
        ) {
            setError(
                "New password must be different from your current password."
            );
            return;
        }

        if (
            form.newPassword !==
            form.confirmPassword
        ) {
            setError("New passwords do not match.");
            return;
        }

        try {
            setSaving(true);

            await api.put(
                "/users/password",
                {
                    currentPassword:
                        form.currentPassword,
                    newPassword:
                        form.newPassword,
                }
            );

            setSuccess(
                "Password updated successfully."
            );

            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setTimeout(() => {
                navigate(
                    "/citizen/profile",
                    {
                        replace: true,
                    }
                );
            }, 1000);
        } catch (error) {
            console.error(
                "Failed to update password:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to update password. Please check your current password and try again."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <Link
                to="/citizen/profile"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
                <ArrowLeft size={16} />
                Back to Profile
            </Link>

            <div className="mt-5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Update Password
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Change your account password securely.
                </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertTriangle
                            size={18}
                            className="mt-0.5 shrink-0"
                        />

                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        <CheckCircle2 size={18} />
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <PasswordField
                        id="currentPassword"
                        name="currentPassword"
                        label="Current Password"
                        value={form.currentPassword}
                        onChange={handleChange}
                    />

                    <PasswordField
                        id="newPassword"
                        name="newPassword"
                        label="New Password"
                        value={form.newPassword}
                        onChange={handleChange}
                    />

                    <PasswordField
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm New Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                        <Link
                            to="/citizen/profile"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <RefreshCw
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Update Password
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function PasswordField({
    id,
    name,
    label,
    value,
    onChange,
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-semibold text-slate-700"
            >
                {label}
            </label>

            <div className="relative">
                <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    id={id}
                    name={name}
                    type="password"
                    value={value}
                    onChange={onChange}
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
            </div>
        </div>
    );
}

export default UpdatePassword;