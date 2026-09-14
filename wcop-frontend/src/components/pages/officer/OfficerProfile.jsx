import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    KeyRound,
    Mail,
    Phone,
    RefreshCw,
    Save,
    UserCircle,
} from "lucide-react";

import {
    getOfficerProfile,
    updateOfficerProfile,
} from "../../../api/userApi";

function OfficerProfile() {
    const [profile, setProfile] = useState(null);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const data = await getOfficerProfile();

            setProfile(data);

            setForm({
                firstName: data?.firstName || "",
                lastName: data?.lastName || "",
                email: data?.email || "",
                phone: data?.phone || "",
                address: data?.address || "",
            });
        } catch (error) {
            console.error("Officer profile loading failed:", error);

            setError(
                error?.response?.data?.message ||
                "Unable to load profile."
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

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const updated = await updateOfficerProfile(form);

            setProfile(updated);

            setForm({
                firstName: updated?.firstName || "",
                lastName: updated?.lastName || "",
                email: updated?.email || "",
                phone: updated?.phone || "",
                address: updated?.address || "",
            });

            setSuccess("Profile updated successfully.");
        } catch (error) {
            console.error("Officer profile update failed:", error);

            setError(
                error?.response?.data?.message ||
                "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
                <div className="h-96 animate-pulse rounded-xl bg-white" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Officer Profile
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your personal account information.
                    </p>
                </div>

                <Link
                    to="/officer/profile/change-password"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    <KeyRound size={16} />
                    Change Password
                </Link>

            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    {success}
                </div>
            )}

            {/* PROFILE SUMMARY */}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                        <UserCircle
                            size={30}
                            className="text-slate-600"
                        />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-900">
                            {profile?.firstName || ""}
                            {" "}
                            {profile?.lastName || ""}
                        </h2>

                        <p className="text-sm text-slate-500">
                            {profile?.role || "OFFICER"}
                        </p>
                    </div>

                </div>

                {profile?.staffProfile && (
                    <div className="mt-6 grid gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-3">

                        <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">
                                Employee ID
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                                {profile.staffProfile.employeeId || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">
                                Department
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                                {profile.staffProfile.department || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">
                                District
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                                {profile.staffProfile.district || "—"}
                            </p>
                        </div>

                    </div>
                )}

            </div>

            {/* PROFILE FORM */}

            <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >

                <div className="mb-6">
                    <h2 className="font-semibold text-slate-900">
                        Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Update the information associated with your account.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            First Name
                        </label>

                        <input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Last Name
                        </label>

                        <input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Email
                        </label>

                        <div className="relative">

                            <Mail
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-400"
                            />

                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Phone
                        </label>

                        <div className="relative">

                            <Phone
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                maxLength={10}
                                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-400"
                            />

                        </div>
                    </div>

                    <div className="sm:col-span-2">

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            rows={4}
                            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                        />

                    </div>

                </div>

                <div className="mt-6 flex flex-wrap gap-3">

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                    >
                        <Save size={16} />

                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        type="button"
                        onClick={loadProfile}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-50"
                    >
                        <RefreshCw size={16} />

                        Reload
                    </button>

                </div>

            </form>

        </div>
    );
}

export default OfficerProfile;