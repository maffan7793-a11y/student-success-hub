import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { SectionHeading } from "./Features";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section">
      <SectionHeading eyebrow="Get In Touch" title="Questions before you apply?" />

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="glass-panel p-8">
          <ul className="space-y-5 text-sm">
            <li className="flex items-center gap-3 text-ink-700 dark:text-white/80">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white"><Mail size={16} /></span>
              support@studentsuccesshub.com
            </li>
            <li className="flex items-center gap-3 text-ink-700 dark:text-white/80">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white"><Phone size={16} /></span>
              +91 90000 00000
            </li>
            <li className="flex items-center gap-3 text-ink-700 dark:text-white/80">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white"><MapPin size={16} /></span>
              Bengaluru, India
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel space-y-4 p-8">
          {submitted ? (
            <p className="text-sm font-medium text-emerald-600">Thanks — we'll get back to you within 24 hours.</p>
          ) : (
            <>
              <input required placeholder="Your name" className="w-full rounded-xl border border-ink-900/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-brand-violet dark:border-white/10 dark:bg-white/5" />
              <input required type="email" placeholder="Your email" className="w-full rounded-xl border border-ink-900/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-brand-violet dark:border-white/10 dark:bg-white/5" />
              <textarea required placeholder="Your message" rows={4} className="w-full rounded-xl border border-ink-900/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-brand-violet dark:border-white/10 dark:bg-white/5" />
              <button type="submit" className="btn-primary w-full">
                Send Message <Send size={15} />
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
