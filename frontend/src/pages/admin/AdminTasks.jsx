import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Github, ExternalLink, FileText } from "lucide-react";
import { listPendingTasks, reviewTask } from "../../api/admin";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackDraft, setFeedbackDraft] = useState({});

  const load = async () => {
    setLoading(true);
    const data = await listPendingTasks();
    setTasks(data.tasks);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleReview = async (submissionId, decision) => {
    await reviewTask(submissionId, { decision, feedback: feedbackDraft[submissionId] || "" });
    load();
  };

  if (loading) return <LoadingSkeleton rows={4} />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Task Review</h1>
      <p className="mt-1 text-sm text-white/50">{tasks.length} submission(s) awaiting review.</p>

      <div className="mt-6 space-y-4">
        {tasks.map((t) => (
          <div key={t.id} className="rounded-xl2 border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-medium">{t.student_name} <span className="text-white/40">· {t.student_email}</span></div>
                <div className="mt-1 text-xs text-white/50">
                  {t.application_id} · {t.domain.replace("_", " ")} · Task {t.task_number}: {t.title}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {t.github_url && <a href={t.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-brand-blue hover:underline"><Github size={14} /> GitHub</a>}
              {t.live_url && <a href={t.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-brand-blue hover:underline"><ExternalLink size={14} /> Live URL</a>}
              {t.report_url && <a href={t.report_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-brand-blue hover:underline"><FileText size={14} /> Report</a>}
            </div>

            <textarea
              placeholder="Feedback (optional for approval, recommended for rejection)"
              value={feedbackDraft[t.id] || ""}
              onChange={(e) => setFeedbackDraft((prev) => ({ ...prev, [t.id]: e.target.value }))}
              className="input mt-4 !bg-white/5 !border-white/10 !text-white"
              rows={2}
            />

            <div className="mt-4 flex gap-3">
              <button onClick={() => handleReview(t.id, "approved")} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/25">
                <CheckCircle2 size={16} /> Approve
              </button>
              <button onClick={() => handleReview(t.id, "rejected")} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500/15 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/25">
                <XCircle size={16} /> Reject
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="rounded-xl2 border border-white/10 bg-white/5 p-10 text-center text-white/40">
            No pending submissions. All caught up!
          </div>
        )}
      </div>
    </div>
  );
}
