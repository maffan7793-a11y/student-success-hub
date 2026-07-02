export default function LoadingSkeleton({ fullScreen = false, rows = 3 }) {
  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-light dark:bg-base-dark">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-violet/20 border-t-brand-violet" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 w-full animate-pulse rounded-xl2 bg-ink-900/5 dark:bg-white/5" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return <div className="h-32 w-full animate-pulse rounded-xl2 bg-ink-900/5 dark:bg-white/5" />;
}
