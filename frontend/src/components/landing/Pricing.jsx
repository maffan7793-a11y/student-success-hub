import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SectionHeading } from "./Features";

const INCLUDES = [
  "Dashboard Access",
  "Internship Tasks",
  "Offer Letter",
  "Mentor Review",
  "Certificate",
  "Career Resources",
  "Portfolio Projects",
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="section">
      <SectionHeading eyebrow="Simple Pricing" title="One price. Everything included." />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass-card mx-auto mt-12 max-w-md p-8 text-center"
      >
        <div className="font-display text-5xl font-bold text-ink-900 dark:text-white">
          ₹79
          <span className="text-base font-medium text-ink-500 dark:text-white/50"> / one-time</span>
        </div>
        <p className="mt-2 text-sm text-ink-500 dark:text-white/60">
          For the full 30-day internship program
        </p>

        <ul className="mt-8 space-y-3 text-left">
          {INCLUDES.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-ink-700 dark:text-white/80">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-violet/15 text-brand-violet">
                <Check size={12} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <button onClick={() => navigate("/apply")} className="btn-primary mt-8 w-full">
          Apply Now
        </button>
      </motion.div>
    </section>
  );
}
