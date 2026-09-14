import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-lg text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-blue-600">
                    404
                </div>

                <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-blue-600">
                    Page not found
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                    We couldn't find that page
                </h1>

                <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-500">
                    The page you are looking for may have been moved, removed, or
                    the address may be incorrect.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        to="/"
                        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Back to homepage
                    </Link>

                    <Link
                        to="/login"
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;