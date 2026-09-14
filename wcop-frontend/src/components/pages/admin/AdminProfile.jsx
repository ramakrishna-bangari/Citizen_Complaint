import {
    Edit3,
    KeyRound,
    Mail,
    Phone,
    ShieldCheck,
    User,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";


function AdminProfile() {

    const {
        user,
    } = useAuth();


    const name =
        [user?.firstName, user?.lastName]
            .filter(Boolean)
            .join(" ") || "Administrator";

    const email =
        user?.email ||
        "Not available";

    const phone =
        user?.phone ||
        "Not available";

    const role =
        user?.role ||
        "ADMIN";


    return (
        <div className="mx-auto max-w-5xl space-y-6">

            <div>
                <p className="text-sm font-semibold text-blue-600">
                    Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                    My Profile
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    View and manage your administrator account.
                </p>
            </div>


            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 bg-slate-50 p-6">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-700">

                            <User size={38} />

                        </div>


                        <div>

                            <h2 className="text-xl font-bold text-slate-900">
                                {name}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Administrator
                            </p>

                        </div>

                    </div>

                </div>


                <div className="grid gap-6 p-6 md:grid-cols-2">

                    <ProfileItem
                        icon={<User size={18} />}
                        label="Full Name"
                        value={name}
                    />

                    <ProfileItem
                        icon={<ShieldCheck size={18} />}
                        label="Role"
                        value={role}
                    />

                    <ProfileItem
                        icon={<Mail size={18} />}
                        label="Email"
                        value={email}
                    />

                    <ProfileItem
                        icon={<Phone size={18} />}
                        label="Phone"
                        value={phone}
                    />

                </div>


                <div className="flex flex-col gap-3 border-t border-slate-200 p-6 sm:flex-row">

                    <Link
                        to="/admin/profile/edit"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <Edit3 size={17} />
                        Edit Profile
                    </Link>


                    <Link
                        to="/admin/profile/change-password"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <KeyRound size={17} />
                        Change Password
                    </Link>

                </div>

            </section>

        </div>
    );
}


function ProfileItem({
    icon,
    label,
    value,
}) {

    return (
        <div>

            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800">

                <span className="text-slate-400">
                    {icon}
                </span>

                <span>
                    {value}
                </span>

            </div>

        </div>
    );
}


export default AdminProfile;