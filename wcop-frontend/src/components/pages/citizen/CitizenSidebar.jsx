import { FileText, LayoutDashboard, PlusCircle, UserCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

function CitizenSidebar({ mobileOpen = false, onClose = () => {} }) {
  const links = [
    { label: "Dashboard", path: "/citizen/dashboard", icon: LayoutDashboard, end: true },
    { label: "My Complaints", path: "/citizen/complaints", icon: FileText, end: true },
    { label: "Submit Complaint", path: "/citizen/complaints/new", icon: PlusCircle, end: true },
    { label: "Profile", path: "/citizen/profile", icon: UserCircle, end: true },
  ];

  const handleNavigation = () => {
    if (onClose) onClose();
  };

  const navigation = (
    <nav aria-label="Citizen navigation" className="space-y-1.5">
      {links.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={handleNavigation}
            className={({ isActive }) =>
              `group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                    isActive ? "bg-blue-700 text-white" : "bg-transparent text-slate-600 group-hover:bg-white group-hover:text-blue-700"
                  }`}
                >
                  <Icon size={19} strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="fixed left-0 top-16 sm:top-20 z-30 hidden h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
          <div className="mb-7 px-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Citizen Portal</p>
            <h2 className="mt-1 text-lg font-bold leading-7 text-slate-900">My Services</h2>
          </div>
          {navigation}
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close citizen navigation"
          onClick={onClose}
          className="fixed inset-x-0 bottom-0 top-16 sm:top-20 z-40 cursor-default bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        aria-label="Citizen mobile navigation"
        className={`fixed left-0 top-16 sm:top-20 bottom-0 z-50 flex h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-[min(86vw,300px)] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-6 px-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Citizen Portal</p>
            <h2 className="mt-1 text-base font-bold text-slate-900">My Services</h2>
          </div>
          {navigation}
        </div>
      </aside>
    </>
  );
}

export default CitizenSidebar;
