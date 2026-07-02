import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-ink-900/10 bg-white/60 dark:border-white/10 dark:bg-base-dark">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <GraduationCap size={18} />
              </span>
              Student Success Hub
            </div>
            <p className="text-sm text-ink-500 dark:text-white/60">
              Real, project-based virtual internships for students who want proof of skill, not just a certificate.
            </p>
          </div>

          <FooterCol title="Platform" links={[
            { label: "Apply Now", to: "/apply" },
            { label: "Student Login", to: "/login" },
            { label: "Verify Certificate", to: "/verify-certificate" },
          ]} />

          <FooterCol title="Domains" links={[
            { label: "Web Development", to: "/apply" },
            { label: "Data Analytics", to: "/apply" },
          ]} />

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-900 dark:text-white">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-ink-500 dark:text-white/60">
              <li className="flex items-center gap-2"><Mail size={14} /> support@studentsuccesshub.com</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +91 90000 00000</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Bengaluru, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-900/10 pt-6 text-xs text-ink-500 dark:border-white/10 dark:text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Student Success Hub. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-900 dark:text-white">
        {title}
      </h4>
      <ul className="space-y-2 text-sm text-ink-500 dark:text-white/60">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="transition-colors hover:text-brand-violet">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
