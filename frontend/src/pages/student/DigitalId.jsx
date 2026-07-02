import { useEffect, useState } from "react";
import { Download, ShieldCheck } from "lucide-react";
import { listMyApplications, getDigitalId } from "../../api/applications";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

export default function DigitalId() {
  const [idData, setIdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { applications } = await listMyApplications();
        const active = applications.find((a) => a.status === "active" || a.status === "completed");
        if (!active) {
          setError("No active internship found.");
          return;
        }
        const data = await getDigitalId(active.application_id);
        setIdData(data);
      } catch {
        setError("Could not load your Digital ID.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <p className="text-sm text-ink-500 dark:text-white/60">{error}</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Digital ID</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-white/60">Your verified internship identity card.</p>

      <div className="glass-card mx-auto mt-8 max-w-sm p-6">
        <div className="flex items-center justify-between">
          <span className="font-display text-xs font-semibold uppercase tracking-widest text-brand-violet">
            Digital Internship ID
          </span>
          <ShieldCheck size={18} className="text-brand-blue" />
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-brand-gradient">
            {idData.photo_url && <img src={idData.photo_url} alt="" className="h-full w-full object-cover" />}
          </div>
          <div>
            <div className="font-display font-semibold text-ink-900 dark:text-white">{idData.student_name}</div>
            <div className="text-sm capitalize text-ink-500 dark:text-white/60">{idData.domain.replace("_", " ")} Intern</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
          <InfoField label="Unique ID" value={idData.unique_id.slice(0, 8).toUpperCase()} mono />
          <InfoField label="Status" value={idData.status} valueClass="capitalize text-emerald-600" />
          <InfoField label="Joined" value={idData.joined_date ? new Date(idData.joined_date).toLocaleDateString() : "—"} />
          <InfoField label="Expires" value={idData.expiry_date ? new Date(idData.expiry_date).toLocaleDateString() : "—"} />
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-ink-900/5 p-3 dark:bg-white/5">
          <span className="text-xs text-ink-500 dark:text-white/50">Scan to verify</span>
          {idData.qr_code_url && <img src={idData.qr_code_url} alt="QR Code" className="h-14 w-14" />}
        </div>

        <a href={idData.qr_code_url} download className="btn-primary mt-6 w-full">
          <Download size={15} /> Download ID
        </a>
      </div>
    </div>
  );
}

function InfoField({ label, value, mono, valueClass = "" }) {
  return (
    <div>
      <div className="text-ink-500 dark:text-white/50">{label}</div>
      <div className={`font-medium text-ink-900 dark:text-white ${mono ? "font-mono" : ""} ${valueClass}`}>{value}</div>
    </div>
  );
}
