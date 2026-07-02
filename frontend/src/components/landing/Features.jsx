import { motion } from "framer-motion";
import { Code2, LineChart, Award, Users, Clock, ShieldCheck } from "lucide-react";

const FEATURES = [
  { icon: Code2, title: "Real Project Tasks", desc: "Five hands-on tasks per domain, reviewed by mentors — not busywork." },
  { icon: Users, title: "Mentor Review", desc: "Every submission is reviewed with actionable feedback, not just a checkmark." },
  { icon: Clock, title: "30-Day Timeline", desc: "A focused, structured month that fits around your college schedule." },
  { icon: Award, title: "Verified Certificate", desc: "A certificate with a QR code anyone can verify — recruiters included." },
  { icon: LineChart, title: "Portfolio Ready", desc: "Walk away with deployed, GitHub-linked projects you can show off." },
  { icon: ShieldCheck, title: "Secure by Design", desc: "JWT-protected accounts and encrypted payments, end to end." },
];

export default function Features() {
  return (
    <section id="features" className="section">
      <SectionHeading eyebrow="Why Student Success Hub" title="Built around proof of work, not paperwork" />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="glass-panel p-6"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
              <f.icon size={20} />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold text-ink-900 dark:text-white">{f.title}</h3>
            <p className="text-sm text-ink-500 dark:text-white/60">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-3xl font-bold text-ink-900 dark:text-white md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-ink-500 dark:text-white/60">{subtitle}</p>}
    </div>
  );
}
