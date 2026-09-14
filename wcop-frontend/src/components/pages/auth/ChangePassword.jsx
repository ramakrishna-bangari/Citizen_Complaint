import {
    ArrowLeft,
    KeyRound,
    Save,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import { useState } from "react";


// =========================================================
// SHARED CHANGE PASSWORD PAGE
// =========================================================
//
// Accepts an "onChangePassword" function so each role can
// pass its own endpoint (citizen, officer, admin) while
// reusing the same form and validation logic.
//
// =========================================================

function ChangePassword({ backTo = "/", onChangePassword }) {

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

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {

        setError("All fields are required.");
        return;
    }

    if (form.newPassword.length < 8) {

        setError("New password must be at least 8 characters long.");
        return;
    }

    if (form.newPassword !== form.confirmPassword) {

        setError("New password and confirm password do not match.");
        return;
    }

    if (form.currentPassword === form.newPassword) {

        setError("New password must be different from current password.");
        return;
    }

    try {

        setSaving(true);

        await onChangePassword({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
        });

        setSuccess("Password changed successfully.");

        setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

    } catch (err) {

        console.error(
            "Change password failed:",
            err
        );

        setError(
            err?.response?.data?.message ||
            "Failed to change password. Please check your current password and try again."
        );

    } finally {

        setSaving(false);

    }

};
    return (
        <div className="mx-auto max-w-xl space-y-6">

            <div className="flex items-center gap-3">

                <Link
                    to={backTo}
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
                >
                    <ArrowLeft size={18} />
                </Link>

                <div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Change Password
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Update your account password.
                    </p>

                </div>

            </div>


            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}


            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {success}
                </div>
            )}


            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >

                <div className="flex items-center gap-3 border-b border-slate-200 pb-5">

                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <KeyRound size={22} />
                    </div>

                    <div>

                        <h2 className="font-bold text-slate-900">
                            Security
                        </h2>

                        <p className="text-sm text-slate-500">
                            Choose a strong password you don't use elsewhere.
                        </p>

                    </div>

                </div>


                <Field
                    label="Current Password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    required
                />


                <Field
                    label="New Password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                />


                <Field
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />


                <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save size={17} />

                        {saving
                            ? "Saving..."
                            : "Change Password"}
                    </button>


                    <button
                        type="button"
                        onClick={() => navigate(backTo)}
                        className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
}


function Field({
    label,
    name,
    value,
    onChange,
    required = false,
}) {

    return (
        <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <input
                type="password"
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                autoComplete={
                    name === "currentPassword"
                        ? "current-password"
                        : "new-password"
                }
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

        </div>
    );
}


export default ChangePassword;