import { useEffect, useState } from "react";
import { listAdminPayments } from "../../api/admin";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

const STATUS_COLORS = {
  created: "bg-amber-500/15 text-amber-400",
  paid: "bg-emerald-500/15 text-emerald-400",
  failed: "bg-red-500/15 text-red-400",
};

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAdminPayments().then((d) => setPayments(d.payments)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={5} />;

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount_paise, 0) / 100;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Payments</h1>
        <div className="text-right">
          <div className="font-display text-xl font-bold">₹{totalRevenue.toLocaleString("en-IN")}</div>
          <div className="text-xs text-white/50">Total Revenue</div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl2 border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Application</th>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Payment ID</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="px-4 py-3">{p.student_name}</td>
                <td className="px-4 py-3 font-mono text-xs text-white/60">{p.application_id}</td>
                <td className="px-4 py-3 font-mono text-xs text-white/60">{p.razorpay_order_id}</td>
                <td className="px-4 py-3 font-mono text-xs text-white/60">{p.razorpay_payment_id || "—"}</td>
                <td className="px-4 py-3">₹{(p.amount_paise / 100).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[p.status] || "bg-white/10 text-white/60"}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-white/40">No payments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
