import { Link } from "react-router-dom";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-blue-600 text-base sm:text-xl font-extrabold text-white shadow-xs">
              C
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <span className="block text-sm sm:text-base lg:text-xl font-extrabold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
                Citizen Complaint
              </span>
              <span className="block text-[10px] sm:text-xs font-semibold tracking-wide text-slate-500 leading-tight whitespace-nowrap">
                Management System
              </span>
            </div>
          </div>

          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
