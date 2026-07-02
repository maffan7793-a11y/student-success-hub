import { useEffect, useState } from "react";
import { Award, Download, ExternalLink } from "lucide-react";
import { listMyApplications } from "../../api/applications";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

export default function Certificates() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyApplications().then((d) => setApplications(d.applications)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={3} />;

  const completed = applications.filter((a) => a.status === "completed");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Certificates</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-white/60">Certificates unlock once all 5 tasks are approved.</p>

      {completed.length === 0 ? (
        <div className="glass-card mt-8 p-10 text-center">
          <Award size={28} className="mx-auto mb-3 text-ink-500 dark:text-white/30" />
          <p className="text-sm text-ink-500 dark:text-white/60">No certificates yet. Keep going on your tasks!</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {completed.map((app) => (
            <div key={app.application_id} className="glass-panel p-6">
              <Award size={22} className="mb-3 text-brand-violet" />
              <div className="font-display font-semibold capitalize text-ink-900 dark:text-white">{app.domain.replace("_", " ")}</div>
              <div className="mt-1 text-xs text-ink-500 dark:text-white/50">Application {app.application_id}</div>
              <div className="mt-5 flex gap-3">
                <a href={`/verify-certificate`} target="_blank" rel="noreferrer" className="btn-secondary flex-1 !px-4 !py-2 text-sm">
                  <ExternalLink size={14} /> Verify
                </a>
                <button className="btn-primary flex-1 !px-4 !py-2 text-sm">
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
