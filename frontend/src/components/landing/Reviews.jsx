import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeading } from "./Features";

const REVIEWS = [
  { name: "Priya Sharma", college: "VIT Vellore", domain: "Web Development", quote: "The tasks felt like real client work, not tutorials. My portfolio finally has projects I'm proud to show." },
  { name: "Rahul Mehta", college: "NIT Surat", domain: "Data Analytics", quote: "Mentor feedback on my churn analysis was the most useful critique I've gotten on any project." },
  { name: "Sneha Iyer", college: "Christ University", domain: "Web Development", quote: "Went from barely knowing Flask to deploying a full auth system in 30 days." },
];

export default function Reviews() {
  return (
    <section id="reviews" className="section">
      <SectionHeading eyebrow="Student Reviews" title="What interns say after 30 days" />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-panel p-6"
          >
            <div className="mb-3 flex gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="text-sm text-ink-700 dark:text-white/80">&ldquo;{r.quote}&rdquo;</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-gradient" />
              <div>
                <div className="text-sm font-semibold text-ink-900 dark:text-white">{r.name}</div>
                <div className="text-xs text-ink-500 dark:text-white/50">{r.college} · {r.domain}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
