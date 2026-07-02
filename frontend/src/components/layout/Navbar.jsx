import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Domains", href: "#domains" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/20 bg-white/70 backdrop-blur-xl dark:bg-base-dark/70" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
            <GraduationCap size={18} />
          </span>
          Student Success Hub
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-brand-violet dark:text-white/70 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {role === "student" ? (
            <button onClick={() => navigate("/dashboard")} className="btn-secondary !px-5 !py-2 text-sm">
              Dashboard
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="btn-secondary !px-5 !py-2 text-sm">
              Student Login
            </button>
          )}
          <button onClick={() => navigate("/apply")} className="btn-primary !px-5 !py-2 text-sm">
            Apply Now
          </button>
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/20 bg-white/95 px-6 py-4 backdrop-blur-xl dark:bg-base-dark/95 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm font-medium">
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => navigate("/login")} className="btn-secondary flex-1 !px-4 !py-2 text-sm">
                Login
              </button>
              <button onClick={() => navigate("/apply")} className="btn-primary flex-1 !px-4 !py-2 text-sm">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
