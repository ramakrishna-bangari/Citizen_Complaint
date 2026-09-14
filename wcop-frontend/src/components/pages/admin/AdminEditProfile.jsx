import {
    ArrowLeft,
    Save,
    User,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import { useAuth } from "../../hooks/useAuth";

import { updateProfile } from "../../../api/authApi";


function AdminEditProfile() {

    const {
        user,
        updateUser,
    } = useAuth();

    const navigate = useNavigate();


    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
    });

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    useEffect(() => {

        setForm({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
        });

    }, [user]);


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

        try {

            setSaving(true);

            const payload = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                address: form.address.trim() || null,
            };

            const response = await updateProfile(payload);

            updateUser(response);

            setSuccess(
                "Profile information updated successfully."
            );

        } catch (err) {

            console.error(
                "Admin profile update failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to update profile."
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
                        Edit Profile
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Update your administrator information.
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
                        <User size={22} />
                    </div>

                    <div>

                        <h2 className="font-bold text-slate-900">
                            Personal Information
                        </h2>

                        <p className="text-sm text-slate-500">
                            Keep your account details up to date.
                        </p>

                    </div>

                </div>


                <div className="grid gap-6 sm:grid-cols-2">

                    <Field
                        label="First Name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                    />

                    <Field
                        label="Last Name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                    />

                </div>


                <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />


                <Field
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                />


                <Field
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
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
                            : "Save Changes"}
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/profile")
                        }
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
    type = "text",
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
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

        </div>
    );
}


export default AdminEditProfile;