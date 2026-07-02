import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Code2, LineChart, ArrowRight } from "lucide-react";
import { SectionHeading } from "./Features";

const DOMAINS = [
  {
    key: "web_development",
    icon: Code2,
    title: "Web Development",
    desc: "Portfolio site, responsive landing page, a Flask CRUD app, auth system, and a deployed capstone project.",
    tasks: ["Portfolio Website", "Responsive Landing Page", "CRUD Flask Project", "Authentication System", "Deploy Final Full Stack Project"],
    gradient: "from-brand-blue to-brand-violet",
  },
  {
    key: "data_analytics",
    icon: LineChart,
    title: "Data Analytics",
    desc: "Data cleaning, EDA, a churn analysis, a Power BI dashboard, and a final end-to-end analytics project.",
    tasks: ["Data Cleaning", "Exploratory Data Analysis", "Customer Churn Analysis", "Power BI Dashboard", "Final Analytics Project"],
    gradient: "from-brand-violet to-brand-violetDeep",
  },
];

export default function Domains() {
  const navigate = useNavigate();

  return (
    <section id="domains" className="section">
      <SectionHeading eyebrow="Choose Your Path" title="Two domains. Five real tasks each." />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {DOMAINS.map((d, i) => (
          <motion.div
            key={d.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-panel overflow-hidden p-8"
          >
            <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${d.gradient} text-white`}>
              <d.icon size={22} />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">{d.title}</h3>
            <p className="mt-2 text-sm text-ink-500 dark:text-white/60">{d.desc}</p>

            <ol className="mt-6 space-y-2">
              {d.tasks.map((t, idx) => (
                <li key={t} className="flex items-center gap-3 text-sm text-ink-700 dark:text-white/80">
                  <span className="font-mono text-xs text-brand-violet">{String(idx + 1).padStart(2, "0")}</span>
                  {t}
                </li>
              ))}
            </ol>

            <button
              onClick={() => navigate("/apply", { state: { domain: d.key } })}
              className="btn-secondary mt-8 w-full"
            >
              Choose {d.title} <ArrowRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
