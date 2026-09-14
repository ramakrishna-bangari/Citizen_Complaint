import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    UserPlus,
    User,
    Building2,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";

import {
    createAdminOfficer,
    getAdminDepartments,
    getAdminDistricts,
} from "../../../api/adminApi";

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    employeeId: "",
    departmentId: "",
    districtId: "",
    active: true,
};

function CreateOfficer() {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);

    const [departments, setDepartments] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadReferenceData();
    }, []);

    const loadReferenceData = async () => {
        try {
            setLoading(true);
            setError("");

            const [departmentData, districtData] = await Promise.all([
                getAdminDepartments(),
                getAdminDistricts(),
            ]);

            setDepartments(
                Array.isArray(departmentData)
                    ? departmentData
                    : departmentData?.content || []
            );

            setDistricts(
                Array.isArray(districtData)
                    ? districtData
                    : districtData?.content || []
            );
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Unable to load departments and districts."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const validateForm = () => {
        if (!form.firstName.trim()) {
            return "First name is required.";
        }

        if (!form.lastName.trim()) {
            return "Last name is required.";
        }

        if (!form.email.trim()) {
            return "Email is required.";
        }

        if (!form.phone.trim()) {
            return "Phone number is required.";
        }

        if (!form.employeeId.trim()) {
            return "Employee ID is required.";
        }

        if (!form.password) {
            return "Password is required.";
        }

        if (form.password.length < 6) {
            return "Password must contain at least 6 characters.";
        }

        if (!form.departmentId) {
            return "Please select a department.";
        }

        if (!form.districtId) {
            return "Please select a district.";
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            const payload = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
                password: form.password,
                employeeId: form.employeeId.trim(),
                departmentId: Number(form.departmentId),
                districtId: Number(form.districtId),
                active: form.active,
            };

            await createAdminOfficer(payload);

            setSuccess("Officer account created successfully.");

            setTimeout(() => {
                navigate("/admin/officers");
            }, 1000);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to create officer."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-700" />
                    <p className="mt-3 text-sm text-slate-500">
                        Loading officer setup...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <button
                                type="button"
                                onClick={() => navigate("/admin/officers")}
                                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Officers
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white">
                                    <UserPlus className="h-5 w-5" />
                                </div>

                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">
                                        Create Officer
                                    </h1>
                                    <p className="text-sm text-slate-500">
                                        Register a municipal field officer
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-8">
                {/* Alerts */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                        <div>
                            <p className="font-semibold text-red-800">
                                Unable to create officer
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />

                        <p className="text-sm font-medium text-emerald-800">
                            {success}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Section
                                icon={User}
                                title="Personal Information"
                                description="Basic identity and contact information."
                            >
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Input
                                        label="First Name"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        required
                                    />

                                    <Input
                                        label="Last Name"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        required
                                    />

                                    <Input
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="name@tsmaud.org"
                                        required
                                    />

                                    <Input
                                        label="Phone Number"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Enter 10-digit phone number"
                                        required
                                    />

                                    <div className="sm:col-span-2">
                                        <Input
                                            label="Address"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="Enter officer's address"
                                        />
                                    </div>
                                </div>
                            </Section>

                            {/* Account */}
                            <Section
                                icon={Lock}
                                title="Account Credentials"
                                description="Login credentials for the officer portal."
                            >
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Password
                                        </label>

                                        <div className="relative">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder="Minimum 8 characters"
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-11 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                                required
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (previous) =>
                                                            !previous
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </div>

                        {/* Assignment */}
                        <div className="space-y-6">
                            <Section
                                icon={Building2}
                                title="Official Assignment"
                                description="Define where the officer will operate."
                            >
                                <div className="space-y-5">
                                    <Input
                                        label="Employee ID"
                                        name="employeeId"
                                        value={form.employeeId}
                                        onChange={handleChange}
                                        placeholder="Enter employee ID"
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
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/officers")}
                            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4" />
                                    Create Officer
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
   Reusable Components
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
    placeholder,
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
                placeholder={placeholder}
                required={required}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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

export default CreateOfficer;