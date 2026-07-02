import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Clock, XCircle, Circle, PlayCircle, Download, Award } from "lucide-react";
import { listMyApplications } from "../../api/applications";
import { listTasks, submitTask, generateCertificate } from "../../api/tasks";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

const STATUS_META = {
  not_started: { icon: Circle, label: "Not Started", color: "text-ink-500 dark:text-white/40" },
  pending: { icon: Clock, label: "Pending Review", color: "text-amber-500" },
  approved: { icon: CheckCircle2, label: "Approved", color: "text-emerald-500" },
  rejected: { icon: XCircle, label: "Changes Requested", color: "text-red-500" },
};

export default function MyTasks() {
  const [application, setApplication] = useState(null);
  const [domain, setDomain] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTask, setOpenTask] = useState(null);
  const [certState, setCertState] = useState({ generating: false, certificate: null, error: "" });

  const loadTasks = async (appId) => {
    const data = await listTasks(appId);
    setDomain(data.domain);
    setTasks(data.tasks);
  };

  useEffect(() => {
    (async () => {
      const { applications } = await listMyApplications();
      const active = applications.find((a) => a.status === "active" || a.status === "completed");
      if (active) {
        setApplication(active);
        await loadTasks(active.application_id);
      }
      setLoading(false);
    })();
  }, []);

  const allApproved = tasks.length > 0 && tasks.every((t) => t.status === "approved");

  const handleGenerateCertificate = async () => {
    setCertState({ generating: true, certificate: null, error: "" });
    try {
      const res = await generateCertificate(application.application_id);
      setCertState({ generating: false, certificate: res.certificate, error: "" });
    } catch (err) {
      setCertState({ generating: false, certificate: null, error: err.response?.data?.error || "Could not generate certificate." });
    }
  };

  if (loading) return <LoadingSkeleton rows={5} />;
  if (!application) return <p className="text-sm text-ink-500 dark:text-white/60">No active internship found. Apply first to unlock tasks.</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">My Tasks</h1>
      <p className="mt-1 text-sm capitalize text-ink-500 dark:text-white/60">{domain?.replace("_", " ")} · 5 tasks</p>

      <div className="mt-6 space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.task_number}
            task={task}
            domain={domain}
            isOpen={openTask === task.task_number}
            onToggle={() => setOpenTask(openTask === task.task_number ? null : task.task_number)}
            onSubmitted={() => loadTasks(application.application_id)}
            applicationId={application.application_id}
          />
        ))}
      </div>

      {allApproved && (
        <div className="glass-card mt-8 p-6 text-center">
          <Award size={28} className="mx-auto mb-3 text-brand-violet" />
          <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">All tasks approved!</h3>
          <p className="mt-1 text-sm text-ink-500 dark:text-white/60">Your certificate is ready to be generated.</p>

          {certState.error && <p className="mt-3 text-sm text-red-500">{certState.error}</p>}

          {certState.certificate ? (
            <a href={certState.certificate.pdf_url} target="_blank" rel="noreferrer" className="btn-primary mt-5 inline-flex">
              <Download size={16} /> Download Certificate
            </a>
          ) : (
            <button onClick={handleGenerateCertificate} disabled={certState.generating} className="btn-primary mt-5 disabled:opacity-60">
              {certState.generating ? "Generating..." : "Generate Certificate"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, domain, isOpen, onToggle, onSubmitted, applicationId }) {
  const meta = STATUS_META[task.status] || STATUS_META.not_started;
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { github_url: task.github_url || "", live_url: task.live_url || "", report_url: task.report_url || "" },
  });

  const isDataAnalytics = domain === "data_analytics";

  const onSubmit = async (data) => {
    await submitTask(applicationId, task.task_number, data);
    onSubmitted();
  };

  return (
    <div className="glass-panel overflow-hidden">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-6 py-4 text-left">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-brand-violet">Task {task.task_number}</span>
          <span className="font-medium text-ink-900 dark:text-white">{task.title}</span>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-medium ${meta.color}`}>
          <meta.icon size={14} /> {meta.label}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-ink-900/10 px-6 py-5 dark:border-white/10">
          <p className="text-sm text-ink-500 dark:text-white/60">{task.description}</p>

          <div className="mt-3 flex flex-wrap gap-3">
            {task.tutorial_url && (
              <a href={task.tutorial_url} target="_blank" rel="noreferrer" className="btn-secondary !px-4 !py-2 text-xs">
                <PlayCircle size={14} /> Watch Tutorial
              </a>
            )}
            {task.dataset_url && (
              <a href={task.dataset_url} target="_blank" rel="noreferrer" className="btn-secondary !px-4 !py-2 text-xs">
                <Download size={14} /> Download Dataset
              </a>
            )}
          </div>

          {task.feedback && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10">
              <span className="font-medium">Mentor feedback:</span> {task.feedback}
            </div>
          )}

          {task.status !== "approved" && (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
              <input {...register("github_url")} placeholder="GitHub URL" className="input" />
              {!isDataAnalytics && <input {...register("live_url")} placeholder="Live URL" className="input" />}
              {isDataAnalytics && <input {...register("report_url")} placeholder="Google Drive Report URL" className="input" />}
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
                {isSubmitting ? "Submitting..." : task.status === "rejected" ? "Resubmit" : "Submit Task"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
