import { Mail, MessageCircle, HelpCircle } from "lucide-react";

export default function Support() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Support</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-white/60">Need help with a task, payment, or your certificate?</p>

      <div className="mt-6 space-y-4">
        <div className="glass-panel flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white"><Mail size={18} /></span>
          <div>
            <div className="font-medium text-ink-900 dark:text-white">Email Support</div>
            <div className="text-sm text-ink-500 dark:text-white/60">support@studentsuccesshub.com · replies within 24h</div>
          </div>
        </div>
        <div className="glass-panel flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white"><MessageCircle size={18} /></span>
          <div>
            <div className="font-medium text-ink-900 dark:text-white">Live Chat</div>
            <div className="text-sm text-ink-500 dark:text-white/60">Available Mon–Sat, 10am–6pm IST</div>
          </div>
        </div>
        <div className="glass-panel flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white"><HelpCircle size={18} /></span>
          <div>
            <div className="font-medium text-ink-900 dark:text-white">FAQ</div>
            <div className="text-sm text-ink-500 dark:text-white/60">Check common questions on the homepage FAQ section</div>
          </div>
        </div>
      </div>
    </div>
  );
}
