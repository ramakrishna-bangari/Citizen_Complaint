import {
    useEffect,
    useState,
} from "react";

import { Link } from "react-router-dom";

import {
    getCitizenProfile,
    updateCitizenProfile,
} from "../../../api/userApi";

function CitizenProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
    });

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCitizenProfile();

            setProfile(data);

            setForm({
                firstName: data?.firstName || "",
                lastName: data?.lastName || "",
                email: data?.email || "",
                phone: data?.phone || "",
                address: data?.address || "",
            });
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                "Unable to load your profile."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const updated = await updateCitizenProfile({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
            });

            setProfile(updated);

            setForm({
                firstName: updated?.firstName || "",
                lastName: updated?.lastName || "",
                email: updated?.email || "",
                phone: updated?.phone || "",
                address: updated?.address || "",
            });

            setEditing(false);
            setSuccess("Profile updated successfully.");
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                "Unable to update your profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-10">
                <div className="mx-auto max-w-5xl">
                    <div className="animate-pulse">
                        <div className="mb-8 h-8 w-56 rounded bg-slate-200" />

                        <div className="rounded-2xl bg-white p-8 shadow-sm">
                            <div className="mb-6 h-6 w-40 rounded bg-slate-200" />

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="h-12 rounded bg-slate-100" />
                                <div className="h-12 rounded bg-slate-100" />
                                <div className="h-12 rounded bg-slate-100" />
                                <div className="h-12 rounded bg-slate-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-10">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                        <h2 className="text-lg font-semibold text-red-800">
                            Unable to load profile
                        </h2>

                        <p className="mt-2 text-sm text-red-700">
                            {error ||
                                "Something went wrong while loading your profile."}
                        </p>

                        <button
                            type="button"
                            onClick={loadProfile}
                            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                            My Profile
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your personal information
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {!editing && (
                            <>
                                <Link
                                    to="/citizen/profile/change-password"
                                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Change Password
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSuccess("");
                                        setError("");
                                        setEditing(true);
                                    }}
                                    className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Edit Profile
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {success && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">
                                {(
                                    profile.firstName?.charAt(0) || "U"
                                ).toUpperCase()}

                                {(
                                    profile.lastName?.charAt(0) || ""
                                ).toUpperCase()}
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {profile.firstName}{" "}
                                    {profile.lastName}
                                </h2>

                                <p className="text-sm text-slate-500">
                                    {profile.email}
                                </p>

                                <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
                                    Citizen
                                </span>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="px-6 py-8 sm:px-8"
                    >
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Personal Information
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Keep your contact information up to date.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    First Name
                                </label>

                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 disabled:bg-slate-50 disabled:text-slate-600"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="lastName"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Last Name
                                </label>

                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 disabled:bg-slate-50 disabled:text-slate-600"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 disabled:bg-slate-50 disabled:text-slate-600"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Phone Number
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 disabled:bg-slate-50 disabled:text-slate-600"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label
                                    htmlFor="address"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Address
                                </label>

                                <textarea
                                    id="address"
                                    name="address"
                                    rows="3"
                                    value={form.address}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 disabled:bg-slate-50 disabled:text-slate-600"
                                />
                            </div>
                        </div>

                        {editing && (
                            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(false);
                                        setError("");
                                        setSuccess("");

                                        setForm({
                                            firstName:
                                                profile.firstName || "",
                                            lastName:
                                                profile.lastName || "",
                                            email: profile.email || "",
                                            phone: profile.phone || "",
                                            address: profile.address || "",
                                        });
                                    }}
                                    disabled={saving}
                                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CitizenProfile;