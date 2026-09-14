import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Save,
    User,
    Building2,
    BadgeCheck,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";

import {
    getAdminOfficerById,
    updateAdminOfficer,
    getAdminDepartments,
    getAdminDistricts,
} from "../../../api/adminApi";

function EditOfficer() {
    const { officerId } = useParams();
    const navigate = useNavigate();

    const [officer, setOfficer] = useState(null);

    const [departments, setDepartments] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        employeeId: "",
        departmentId: "",
        districtId: "",
        active: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* ---------------------------------------------------------
       Load officer + departments + districts
    --------------------------------------------------------- */

    const loadData = useCallback(async () => {
        if (!officerId) {
            setError("Officer ID is missing from the URL.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const [officerData, departmentData, districtData] =
                await Promise.all([
                    getAdminOfficerById(officerId),
                    getAdminDepartments(),
                    getAdminDistricts(),
                ]);

            setOfficer(officerData);

            const departmentList = Array.isArray(departmentData)
                ? departmentData
                : departmentData?.content || [];

            const districtList = Array.isArray(districtData)
                ? districtData
                : districtData?.content || [];

            setDepartments(departmentList);
            setDistricts(districtList);

            const staff = officerData?.staffProfile;

            /*
             * Backend StaffProfileResponse returns only the
             * department/district NAME, so we match those
             * names against the department/district lists to
             * find the correct id for the <select> elements.
             */

            const departmentName = staff?.department || "";
            const districtName = staff?.district || "";

            const matchedDepartment = departmentList.find(
                (department) =>
                    (
                        department.departmentName ||
                        department.name ||
                        ""
                    ).toLowerCase() === departmentName.toLowerCase()
            );

            const matchedDistrict = districtList.find(
                (district) =>
                    (
                        district.districtName ||
                        district.name ||
                        ""
                    ).toLowerCase() === districtName.toLowerCase()
            );

            setForm({
                firstName: officerData?.firstName || "",
                lastName: officerData?.lastName || "",
                email: officerData?.email || "",
                phone: officerData?.phone || "",
                address: officerData?.address || "",
                employeeId: staff?.employeeId || "",
                departmentId: matchedDepartment?.id
                    ? String(matchedDepartment.id)
                    : "",
                districtId: matchedDistrict?.id
                    ? String(matchedDistrict.id)
                    : "",
                active:
                    typeof staff?.active === "boolean"
                        ? staff.active
                        : officerData?.isActive ?? true,
            });
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to load officer details."
            );
        } finally {
            setLoading(false);
        }
    }, [officerId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    /* ---------------------------------------------------------
       Input
    --------------------------------------------------------- */

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    /* ---------------------------------------------------------
       Save
       NOTE: "active" is sent as part of this same payload,
       matching what AdminServiceImpl.updateOfficer() expects
       on the backend (department, district, and active are
       all read from the request body together). The separate
       activate/deactivate endpoints in adminApi.js exist for
       a quick toggle elsewhere (e.g. a status switch directly
       in the officers list) but are not needed here since this
       form already saves "active" together with everything else.
    --------------------------------------------------------- */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!officerId) {
            setError("Officer ID is missing.");
            return;
        }

        if (!form.firstName.trim()) {
            setError("First name is required.");
            return;
        }

        if (!form.lastName.trim()) {
            setError("Last name is required.");
            return;
        }

        if (!form.email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!form.employeeId.trim()) {
            setError("Employee ID is required.");
            return;
        }

        if (!form.departmentId) {
            setError("Please select a department.");
            return;
        }

        if (!form.districtId) {
            setError("Please select a district.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
                employeeId: form.employeeId.trim(),
                departmentId: Number(form.departmentId),
                districtId: Number(form.districtId),
                active: form.active,
            };

            await updateAdminOfficer(Number(officerId), payload);

            setSuccess("Officer details updated successfully.");

            setTimeout(() => {
                navigate(`/admin/officers/${officerId}`);
            }, 800);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to update officer."
            );
        } finally {
            setSaving(false);
        }
    };

    /* ---------------------------------------------------------
       Loading
    --------------------------------------------------------- */

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-700" />

                    <p className="mt-3 text-sm text-slate-500">
                        Loading officer details...
                    </p>
                </div>
            </div>
        );
    }

    /* ---------------------------------------------------------
       Error
    --------------------------------------------------------- */

    if (!officer) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-10">
                <div className="mx-auto max-w-3xl">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/officers")}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Officers
                    </button>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                        <div className="flex gap-3">
                            <AlertCircle className="h-6 w-6 text-red-600" />

                            <div>
                                <h2 className="font-semibold text-red-800">
                                    Unable to load officer
                                </h2>

                                <p className="mt-1 text-sm text-red-700">
                                    {error || "Officer not found."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}

            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-5">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/admin/officers/${officerId}`)
                        }
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Officer Details
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white">
                            <User className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                Edit Officer
                            </h1>

                            <p className="text-sm text-slate-500">
                                Update municipal officer information and assignment
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-8">
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />

                        <div>
                            <p className="font-semibold text-red-800">
                                Update failed
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                        <p className="text-sm font-semibold text-emerald-800">
                            {success}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Personal */}

                        <div className="lg:col-span-2">
                            <Section
                                icon={User}
                                title="Personal Information"
                                description="Update the officer's registered information."
                            >
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Input
                                        label="First Name"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                    />

                                    <Input
                                        label="Last Name"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        required
                                    />

                                    <Input
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />

                                    <Input
                                        label="Phone Number"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                    />

                                    <div className="sm:col-span-2">
                                        <Input
                                            label="Address"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </Section>
                        </div>

                        {/* Assignment */}

                        <div>
                            <Section
                                icon={Building2}
                                title="Official Assignment"
                                description="Manage employee and operational assignment."
                            >
                                <div className="space-y-5">
                                    <Input
                                        label="Employee ID"
                                        name="employeeId"
                                        value={form.employeeId}
                                        onChange={handleChange}
                                        required
                                    />

                                    <Select
                                        label="Department"
                                        name="departmentId"
                                        value={form.departmentId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select department
                                        </option>

                                        {departments.map((department) => (
                                            <option
                                                key={department.id}
                                                value={department.id}
                                            >
                                                {department.departmentName ||
                                                    department.name}
                                            </option>
                                        ))}
                                    </Select>

                                    <Select
                                        label="District"
                                        name="districtId"
                                        value={form.districtId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select district
                                        </option>

                                        {districts.map((district) => (
                                            <option
                                                key={district.id}
                                                value={district.id}
                                            >
                                                {district.districtName ||
                                                    district.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </Section>

                            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
                                <div className="flex gap-3">
                                    <BadgeCheck className="h-5 w-5 text-blue-700" />

                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Officer Status
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Inactive officers cannot receive
                                            new assignments.
                                        </p>

                                        <label className="mt-4 flex cursor-pointer items-center gap-3">
                                            <input
                                                type="checkbox"
                                                name="active"
                                                checked={form.active}
                                                onChange={handleChange}
                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />

                                            <span className="text-sm font-medium text-slate-700">
                                                Officer is active
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}

                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/admin/officers/${officerId}`)
                            }
                            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

/* ---------------------------------------------------------
   Components
--------------------------------------------------------- */

function Section({ icon: Icon, title, description, children }) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                        <Icon className="h-4 w-4 text-blue-700" />
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            {title}
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6">{children}</div>
        </section>
    );
}

function Input({
    label,
    name,
    value,
    onChange,
    type = "text",
    required = false,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
        </div>
    );
}

function Select({
    label,
    name,
    value,
    onChange,
    required = false,
    children,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
                {children}
            </select>
        </div>
    );
}

export default EditOfficer;