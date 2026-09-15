import { Link } from "react-router-dom";


function IntroductionSection() {

    const stats = [
        { value: "1,240+", label: "Complaints resolved" },
        { value: "6", label: "Departments" },
        { value: "12", label: "Districts covered" },
    ];

    return (
        <section className="overflow-hidden bg-slate-50">

            {/* Local fade-in animation, scoped to this section only */}

            <style>
                {`
                    @keyframes ccmsFadeInUp {
                        from { opacity: 0; transform: translateY(16px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .ccms-fade-in {
                        animation: ccmsFadeInUp 0.6s ease-out both;
                    }
                    .ccms-fade-in-delay-1 {
                        animation: ccmsFadeInUp 0.6s ease-out 0.1s both;
                    }
                    .ccms-fade-in-delay-2 {
                        animation: ccmsFadeInUp 0.6s ease-out 0.2s both;
                    }
                `}
            </style>

            <div className="mx-auto grid w-full max-w-[1600px] items-start gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-14 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-6 lg:py-20 xl:px-8">

                {/* Left Content */}

                <div className="max-w-2xl ccms-fade-in">

                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Citizen Services
                    </p>

                    <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
                        Report a problem
                        <span className="block text-blue-600">in your area.</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                        Report problems with roads, street lights,
                        waste collection, water services, and other
                        public facilities. Submit your complaint online
                        and follow its progress from your account.
                    </p>

                    {/* Actions */}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                        >
                            Report a Complaint
                        </Link>

                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Track My Complaint
                        </Link>
                    </div>

                    {/* Quick Information */}

                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                        <span>Submit online</span>
                        <span>Track progress</span>
                        <span>View complaint history</span>
                    </div>

                    {/* Stats */}

                    <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-slate-200 pt-8">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>


                {/* Right Complaint Preview */}

                <div className="w-full ccms-fade-in-delay-1">

                    <div className="ml-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">

                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Complaint Details
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    Street light not working
                                </h2>
                            </div>

                            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                                In Progress
                            </span>
                        </div>

                        {/* Complaint Information */}

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs text-slate-500">Complaint Number</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">CC-1024</p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs text-slate-500">Submitted On</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">12 Aug 2026</p>
                            </div>
                        </div>

                        {/* Progress */}

                        <div className="mt-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-700">Complaint progress</p>
                                <p className="text-sm font-semibold text-blue-600">65%</p>
                            </div>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full w-[65%] rounded-full bg-blue-600" />
                            </div>
                        </div>

                        {/* Recent Updates */}

                        <div className="mt-6 border-t border-slate-100 pt-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-900">Recent Updates</h3>
                                <span className="text-xs text-slate-400">Today</span>
                            </div>

                            <div className="mt-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Complaint submitted</p>
                                        <p className="mt-1 text-xs text-slate-500">Your complaint was received.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Assigned to an officer</p>
                                        <p className="mt-1 text-xs text-slate-500">The complaint is being handled.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Resolution</p>
                                        <p className="mt-1 text-xs text-slate-400">Waiting for completion.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}


export default IntroductionSection;