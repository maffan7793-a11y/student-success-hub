import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle2, Clock, TrendingUp, FileDown, Rocket } from "lucide-react";
import { getDashboardOverview } from "../../api/applications";
import LoadingSkeleton, { CardSkeleton } from "../../components/common/LoadingSkeleton";

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardOverview().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (!data?.has_active_internship) {
    return (
      <div className="glass-card mx-auto max-w-md p-10 text-center">
        <Rocket size={32} className="mx-auto mb-4 text-brand-violet" />
        <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">No active internship yet</h2>
        <p className="mt-2 text-sm text-ink-500 dark:text-white/60">Apply for a domain to unlock your dashboard tasks.</p>
        <Link to="/apply" className="btn-primary mt-6 inline-flex">Apply Now</Link>
      </div>
    );
  }

  const cards = [
    { icon: Calendar, label: "Days Left", value: data.days_left ?? "—", color: "from-brand-blue to-brand-violet" },
    { icon: CheckCircle2, label: "Completed Tasks", value: `${data.completed_tasks}/${data.total_tasks}`, color: "from-emerald-500 to-teal-500" },
    { icon: Clock, label: "Pending Tasks", value: data.pending_tasks, color: "from-amber-500 to-orange-500" },
    { icon: TrendingUp, label: "Progress", value: `${data.progress_percent}%`, color: "from-brand-violet to-brand-violetDeep" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
        Welcome back 👋
      </h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-white/60">
        {data.application.domain.replace("_", " ")} internship · {data.application.application_id}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glass-panel p-5">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white`}>
              <c.icon size={18} />
            </div>
            <div className="font-display text-2xl font-bold text-ink-900 dark:text-white">{c.value}</div>
            <div className="text-sm text-ink-500 dark:text-white/50">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel mt-6 p-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-ink-900 dark:text-white">Internship Progress</span>
          <span className="text-ink-500 dark:text-white/50">{data.progress_percent}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-900/10 dark:bg-white/10">
          <div className="h-full rounded-full bg-brand-gradient transition-all duration-500" style={{ width: `${data.progress_percent}%` }} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="glass-panel flex flex-1 items-center justify-between p-5">
          <div>
            <div className="font-medium text-ink-900 dark:text-white">Offer Letter</div>
            <div className="text-xs text-ink-500 dark:text-white/50">Download your official offer letter</div>
          </div>
          {data.application.offer_letter_url ? (
            <a href={data.application.offer_letter_url} className="btn-secondary !px-4 !py-2 text-sm"><FileDown size={15} /></a>
          ) : (
            <span className="text-xs text-ink-500 dark:text-white/40">Generating...</span>
          )}
        </div>
        <Link to="/dashboard/tasks" className="glass-panel flex flex-1 items-center justify-between p-5 transition-colors hover:bg-brand-violet/5">
          <div>
            <div className="font-medium text-ink-900 dark:text-white">Continue Tasks</div>
            <div className="text-xs text-ink-500 dark:text-white/50">Pick up where you left off</div>
          </div>
          <Rocket size={18} className="text-brand-violet" />
        </Link>
      </div>
    </div>
  );
}
