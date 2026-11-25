import { Link } from "react-router-dom";
import {
    ArrowRight,
    Construction,
    Droplet,
    Landmark,
    Lightbulb,
    Trash2,
    Waves
} from "lucide-react";
import HomeNavbar from "./components/home/HomeNavbar";
import { useAuth } from "./components/hooks/useAuth";

function Home() {
    const { isAuthenticated, user } = useAuth();

    const getDashboardPath = () => {
        if (user?.role === "OFFICER") return "/officer/dashboard";
        if (user?.role === "ADMIN") return "/admin/dashboard";
        return "/citizen/dashboard";
    };

    const getTargetRoute = () => {
        if (!isAuthenticated) return "/register";
        if (user?.role === "ADMIN") return "/admin/complaints";
        if (user?.role === "OFFICER") return "/officer/complaints";
        return "/citizen/complaints/new";
    };

    const services = [
        {
            title: "Roads & Streets",
            icon: Construction,
            description: "Potholes, broken roads, and open manholes.",
        },
        {
            title: "Street Lighting",
            icon: Lightbulb,
            description: "Broken streetlights, faulty poles, and dark spots.",
        },
        {
            title: "Waste & Sanitation",
            icon: Trash2,
            description: "Garbage piles, overflowing bins, and dirty streets.",
        },
        {
            title: "Water Supply",
            icon: Droplet,
            description: "Leaking pipes, water shortage, and broken taps.",
        },
        {
            title: "Drainage & Sewage",
            icon: Waves,
            description: "Blocked drains, sewage overflow, and standing water.",
        },
        {
            title: "Public Facilities",
            icon: Landmark,
            description: "Damaged park benches, broken bus shelters, and dirty public toilets.",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <HomeNavbar />

            <main className="flex min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] items-center pt-16 sm:pt-20">
                <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
                        <div className="lg:col-span-5">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
                                <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                {user?.role === "ADMIN" ? "Admin Portal" : user?.role === "OFFICER" ? "Officer Portal" : "Citizen Portal"}
                            </div>

                            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-5xl xl:text-6xl leading-[1.08]">
                                Report a problem
                                <span className="block text-blue-600">in your area.</span>
                            </h1>

                            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
                                Submit complaints about roads, streetlights, waste collection, water supply, and drainage directly to your municipal department. Track updates from submission to resolution.
                            </p>

                            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                                {!isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/register"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-bold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99]"
                                        >
                                            Report a Complaint
                                            <ArrowRight size={18} />
                                        </Link>

                                        <Link
                                            to="/login"
                                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to={getDashboardPath()}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-bold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99]"
                                        >
                                            Go to Dashboard
                                            <ArrowRight size={18} />
                                        </Link>

                                        <Link
                                            to={getTargetRoute()}
                                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
                                        >
                                            {user?.role === "ADMIN" ? "Manage Complaints" : user?.role === "OFFICER" ? "View Complaints" : "Submit New Complaint"}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="mb-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                    Services
                                </p>
                                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                    What you can report
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                {services.map((service) => {
                                    const Icon = service.icon;

                                    return (
                                        <Link
                                            key={service.title}
                                            to={getTargetRoute()}
                                            className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs transition hover:border-blue-300 hover:shadow-xs"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <Icon size={20} />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                                                    {service.title}
                                                </h3>
                                                <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                                                    {service.description}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;
