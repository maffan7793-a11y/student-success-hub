import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, QrCode } from "lucide-react";

const STATS = [
  { value: "3000+", label: "Students" },
  { value: "500+", label: "Certificates" },
  { value: "95%", label: "Satisfaction" },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-brand-radial pb-10 pt-16 md:pt-24">
      <div className="section grid items-center gap-14 md:grid-cols-2">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            30-Day Virtual Internship
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl font-bold leading-tight text-ink-900 dark:text-white md:text-5xl"
          >
            Kickstart Your Career with a{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">₹79 Virtual Internship</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-lg text-lg text-ink-700 dark:text-white/70"
          >
            Gain real-world experience through project-based internships in Web Development
            and Data Analytics — with mentor review and a verified certificate.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <button onClick={() => navigate("/apply")} className="btn-primary">
              Apply Now <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate("/login")} className="btn-secondary">
              Student Login
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex gap-10"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-bold text-ink-900 dark:text-white">{s.value}</div>
                <div className="text-sm text-ink-500 dark:text-white/50">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Signature element: floating glass Digital ID card */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -4 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ rotate: 0, y: -6 }}
          className="glass-card mx-auto w-full max-w-sm p-6"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-semibold uppercase tracking-widest text-brand-violet">
              Digital Internship ID
            </span>
            <ShieldCheck size={18} className="text-brand-blue" />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-brand-gradient" />
            <div>
              <div className="font-display font-semibold text-ink-900 dark:text-white">Aisha Verma</div>
              <div className="text-sm text-ink-500 dark:text-white/60">Web Development Intern</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-ink-500 dark:text-white/50">ID</div>
              <div className="font-mono font-medium text-ink-900 dark:text-white">SSH-2C91F4A0</div>
            </div>
            <div>
              <div className="text-ink-500 dark:text-white/50">Status</div>
              <div className="font-medium text-emerald-600">Active</div>
            </div>
            <div>
              <div className="text-ink-500 dark:text-white/50">Joined</div>
              <div className="font-medium text-ink-900 dark:text-white">01 Jul 2026</div>
            </div>
            <div>
              <div className="text-ink-500 dark:text-white/50">Expires</div>
              <div className="font-medium text-ink-900 dark:text-white">31 Jul 2026</div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-ink-900/5 p-3 dark:bg-white/5">
            <span className="text-xs text-ink-500 dark:text-white/50">Scan to verify</span>
            <QrCode size={28} className="text-ink-900 dark:text-white" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
