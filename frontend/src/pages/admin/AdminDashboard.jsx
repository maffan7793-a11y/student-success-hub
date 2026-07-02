import { useEffect, useState } from "react";
import { Users, FileText, Rocket, Award, Clock, IndianRupee } from "lucide-react";
import { getAdminDashboard } from "../../api/admin";
import LoadingSkeleton, { CardSkeleton } from "../../components/common/LoadingSkeleton";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminDashboard().then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  const cards = [
    { icon: Users, label: "Total Students", value: stats.total_students },
    { icon: FileText, label: "Total Applications", value: stats.total_applications },
    { icon: Rocket, label: "Active Internships", value: stats.active_internships },
    { icon: Award, label: "Certificates Issued", value: stats.certificates_issued },
    { icon: Clock, label: "Pending Reviews", value: stats.pending_reviews },
    { icon: IndianRupee, label: "Revenue", value: `₹${stats.revenue_rupees.toLocaleString("en-IN")}` },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">Platform-wide stats at a glance.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl2 border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient">
              <c.icon size={18} />
            </div>
            <div className="font-display text-2xl font-bold">{c.value}</div>
            <div className="text-sm text-white/50">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
