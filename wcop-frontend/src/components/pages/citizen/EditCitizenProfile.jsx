import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeft,
    Save,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    UserRound,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

import {
    getProfile,
    updateProfile,
} from "../../../api/userApi";

import {
    useAuth,
} from "../../hooks/useAuth";

function EditCitizenProfile() {
    const navigate = useNavigate();

    const {
        refreshAuth,
    } = useAuth();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getProfile();

                const profile =
                    response?.user ||
                    response?.data?.user ||
                    response?.data ||
                    response;

                if (!mounted) {
                    return;
                }

                setForm({
                    firstName: profile?.firstName || "",
                    lastName: profile?.lastName || "",
                    email: profile?.email || "",
                    phoneNumber:
                        profile?.phoneNumber ||
                        profile?.phone ||
                        "",
                    address:
                        profile?.address ||
                        profile?.addressLine ||
                        profile?.fullAddress ||
                        "",
                });
            } catch (error) {
                if (!mounted) {
                    return;
                }

                setError(
                    error?.response?.data?.message ||
                    "Unable to load your profile."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            mounted = false;
        };
    }, []);

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

        if (!form.phoneNumber.trim()) {
            setError("Phone number is required.");
            return;
        }

        try {
            setSaving(true);

            await updateProfile({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                phoneNumber: form.phoneNumber.trim(),
                address: form.address.trim(),
            });

            await refreshAuth();

            setSuccess("Profile updated successfully.");

            setTimeout(() => {
                navigate(
                    "/citizen/profile",
                    {
                        replace: true,
                    }
                );
            }, 800);
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to update your profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="text-center">
                    <RefreshCw
                        size={28}
                        className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

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
                    Edit Profile
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Update your personal information and address.
                </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertTriangle
                            size={18}
                            className="mt-0.5 shrink-0"
                        />

                        <p>{error}</p>
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
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <InputField
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            icon={UserRound}
                            required
                        />

                        <InputField
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            icon={UserRound}
                            required
                        />
                    </div>

                    <InputField
                        id="email"
                        name="email"
                        label="Email Address"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        icon={Mail}
                        required
                    />

                    <InputField
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        type="tel"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        icon={Phone}
                        required
                    />

                    <div>
                        <label
                            htmlFor="address"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Address
                        </label>

                        <div className="relative">
                            <MapPin
                                size={17}
                                className="pointer-events-none absolute left-3 top-3 text-slate-400"
                            />

                            <textarea
                                id="address"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Enter your address"
                                className="w-full resize-none rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                        <Link
                            to="/citizen/profile"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <RefreshCw
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function InputField({
    id,
    name,
    label,
    type = "text",
    value,
    onChange,
    icon: Icon,
    required = false,
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
                <Icon
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
            </div>
        </div>
    );
}

export default EditCitizenProfile;