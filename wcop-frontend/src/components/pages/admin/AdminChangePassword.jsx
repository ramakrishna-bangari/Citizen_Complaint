import {
    ArrowLeft,
    Eye,
    EyeOff,
    KeyRound,
    Save,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    useState,
} from "react";


function AdminChangePassword() {

    const [
        showCurrent,
        setShowCurrent,
    ] = useState(false);

    const [
        showNew,
        setShowNew,
    ] = useState(false);

    const [
        showConfirm,
        setShowConfirm,
    ] = useState(false);


    const [
        form,
        setForm,
    ] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });


    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");

    const [
        saving,
        setSaving,
    ] = useState(false);


    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (
            form.newPassword !==
            form.confirmPassword
        ) {

            setError(
                "New password and confirmation password do not match."
            );

            return;

        }


        if (form.newPassword.length < 8) {

            setError(
                "Password must contain at least 8 characters."
            );

            return;

        }


        try {

            setSaving(true);

            /*
             * Connect your backend change-password API here.
             *
             * Example:
             *
             * await changePassword({
             *     currentPassword:
             *         form.currentPassword,
             *     newPassword:
             *         form.newPassword,
             * });
             */

            setSuccess(
                "Password updated successfully."
            );

            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (err) {

            console.error(
                "Password update failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to change password."
            );

        } finally {

            setSaving(false);

        }

    };


    return (
        <div className="mx-auto max-w-3xl space-y-6">

            <div className="flex items-center gap-3">

                <Link
                    to="/admin/profile"
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
                >
                    <ArrowLeft size={18} />
                </Link>

                <div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Change Password
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Update your administrator account password.
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
                className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >

                <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-5">

                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <KeyRound size={22} />
                    </div>

                    <div>

                        <h2 className="font-bold text-slate-900">
                            Password Security
                        </h2>

                        <p className="text-sm text-slate-500">
                            Use a strong password that you do not reuse elsewhere.
                        </p>

                    </div>

                </div>


                <PasswordField
                    label="Current Password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    visible={showCurrent}
                    onToggle={() =>
                        setShowCurrent(
                            (value) => !value
                        )
                    }
                />


                <PasswordField
                    label="New Password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    visible={showNew}
                    onToggle={() =>
                        setShowNew(
                            (value) => !value
                        )
                    }
                />


                <PasswordField
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    visible={showConfirm}
                    onToggle={() =>
                        setShowConfirm(
                            (value) => !value
                        )
                    }
                />


                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >

                    <Save size={17} />

                    {saving
                        ? "Updating..."
                        : "Update Password"}

                </button>

            </form>

        </div>
    );
}


function PasswordField({
    label,
    name,
    value,
    onChange,
    visible,
    onToggle,
}) {

    return (
        <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <div className="relative">

                <input
                    type={
                        visible
                            ? "text"
                            : "password"
                    }
                    name={name}
                    value={value}
                    onChange={onChange}
                    required
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                    {visible
                        ? <EyeOff size={18} />
                        : <Eye size={18} />
                    }
                </button>

            </div>

        </div>
    );
}


export default AdminChangePassword;