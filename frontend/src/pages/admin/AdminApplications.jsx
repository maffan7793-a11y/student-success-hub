import { useEffect, useState } from "react";
import { listAdminApplications } from "../../api/admin";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

const STATUS_COLORS = {
  pending_payment: "bg-amber-500/15 text-amber-400",
  active: "bg-emerald-500/15 text-emerald-400",
  completed: "bg-brand-violet/20 text-brand-violet",
  expired: "bg-red-500/15 text-red-400",
  rejected: "bg-red-500/15 text-red-400",
};

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (statusFilter) => {
    setLoading(true);
    const data = await listAdminApplications(statusFilter ? { status: statusFilter } : {});
    setApplications(data.applications);
    setLoading(false);
  };

  useEffect(() => { load(status); }, [status]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Applications</h1>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input !w-auto !bg-white/5 !border-white/10 !text-white">
          <option value="">All statuses</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-6"><LoadingSkeleton rows={5} /></div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl2 border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-4 py-3 font-medium">Application ID</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Domain</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Days Left</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.application_id} className="border-t border-white/10">
                  <td className="px-4 py-3 font-mono text-xs">{a.application_id}</td>
                  <td className="px-4 py-3">{a.student.full_name}</td>
                  <td className="px-4 py-3 capitalize text-white/60">{a.domain.replace("_", " ")}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[a.status] || "bg-white/10 text-white/60"}`}>
                      {a.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/60">{a.days_left ?? "—"}</td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
