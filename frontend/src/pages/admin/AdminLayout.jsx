import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FileText, ListChecks, Award, CreditCard, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/applications", label: "Applications", icon: FileText },
  { to: "/admin/tasks", label: "Task Review", icon: ListChecks },
  { to: "/admin/certificates", label: "Certificates", icon: Award },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-base-dark text-white">
      <aside className="w-64 shrink-0 border-r border-white/10 bg-[#161331] p-5">
        <div className="mb-8 flex items-center gap-2 font-display font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient"><ShieldCheck size={18} /></span>
          Admin Panel
        </div>

        <div className="mb-6 rounded-xl2 bg-white/5 p-3 text-sm">
          <div className="font-medium">{user?.full_name}</div>
          <div className="text-xs text-white/50">{user?.email}</div>
        </div>

        <nav className="space-y-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-gradient shadow-glow" : "text-white/70 hover:bg-white/5"
                }`
              }
            >
              <link.icon size={17} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button onClick={handleLogout} className="mt-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10">
          <LogOut size={17} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
