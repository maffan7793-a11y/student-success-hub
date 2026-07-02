import { motion } from "framer-motion";
import { SectionHeading } from "./Features";

const STEPS = [
  { title: "Apply & Choose Domain", desc: "Fill in your details and pick Web Development or Data Analytics." },
  { title: "Pay ₹79", desc: "Secure Razorpay checkout. Get instant dashboard access and an offer letter." },
  { title: "Complete 5 Tasks", desc: "Work through real tasks with tutorials, submit GitHub/live links as you go." },
  { title: "Get Reviewed", desc: "Mentors approve each submission and leave feedback if changes are needed." },
  { title: "Download Certificate", desc: "Once all tasks are approved, your verified certificate generates automatically." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <SectionHeading eyebrow="The Process" title="From application to certificate in 30 days" />

      <div className="relative mt-14">
        <div className="absolute left-4 top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand-blue via-brand-violet to-brand-violetDeep md:block" />
        <div className="space-y-8">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative flex gap-5 pl-0 md:pl-0"
            >
              <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient font-mono text-sm font-semibold text-white shadow-glow">
                {i + 1}
              </span>
              <div className="glass-panel flex-1 p-5">
                <h3 className="font-display font-semibold text-ink-900 dark:text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-500 dark:text-white/60">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
