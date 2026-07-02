import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, IdCard, ListChecks, Award, User, LifeBuoy, LogOut, GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/digital-id", label: "Digital ID", icon: IdCard },
  { to: "/dashboard/tasks", label: "My Tasks", icon: ListChecks },
  { to: "/dashboard/certificates", label: "Certificates", icon: Award },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/support", label: "Support", icon: LifeBuoy },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-base-light dark:bg-base-dark">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-ink-900/10 bg-white/80 backdrop-blur-xl transition-transform dark:border-white/10 dark:bg-base-dark/95 md:static md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col p-5">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 font-display font-bold text-ink-900 dark:text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white"><GraduationCap size={18} /></span>
              SSH Portal
            </div>
            <button className="md:hidden" onClick={() => setMobileOpen(false)}><X size={18} /></button>
          </div>

          <div className="mb-6 flex items-center gap-3 rounded-xl2 bg-ink-900/5 p-3 dark:bg-white/5">
            <div className="h-9 w-9 rounded-full bg-brand-gradient" />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-ink-900 dark:text-white">{user?.full_name}</div>
              <div className="truncate text-xs text-ink-500 dark:text-white/50">{user?.email}</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-brand-gradient text-white shadow-glow" : "text-ink-700 hover:bg-ink-900/5 dark:text-white/70 dark:hover:bg-white/5"
                  }`
                }
              >
                <link.icon size={17} />
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button onClick={handleLogout} className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 md:ml-0">
        <div className="flex items-center gap-3 border-b border-ink-900/10 bg-white/70 px-6 py-4 backdrop-blur dark:border-white/10 dark:bg-base-dark/70 md:hidden">
          <button onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <span className="font-display font-semibold text-ink-900 dark:text-white">Dashboard</span>
        </div>
        <main className="p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
