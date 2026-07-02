import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "./Features";

const FAQS = [
  { q: "Is this a real internship?", a: "Yes. You complete real, mentor-reviewed project tasks over 30 days and receive a verified certificate on completion — it's project-based, not a passive course." },
  { q: "What do I get for ₹79?", a: "Dashboard access, all 5 domain tasks with tutorials, mentor review, an offer letter, career resources, and a verified certificate at the end." },
  { q: "Can I switch domains after applying?", a: "Domain selection happens before payment. If you haven't paid yet, you can restart the application with a different domain." },
  { q: "What happens if a task is rejected?", a: "You'll get written feedback from a mentor and can resubmit — there's no limit on resubmissions within your 30-day window." },
  { q: "How do I verify a certificate?", a: "Anyone can verify a certificate using the Verify Certificate page with the certificate ID or student name — no login required." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section">
      <SectionHeading eyebrow="Questions" title="Frequently asked questions" />

      <div className="mx-auto mt-12 max-w-2xl space-y-3">
        {FAQS.map((item, i) => (
          <div key={item.q} className="glass-panel overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-medium text-ink-900 dark:text-white">{item.q}</span>
              <motion.span animate={{ rotate: open === i ? 180 : 0 }}>
                <ChevronDown size={18} className="text-ink-500 dark:text-white/50" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-sm text-ink-500 dark:text-white/60">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
