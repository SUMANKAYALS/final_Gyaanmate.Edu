export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-700/40 dark:bg-slate-700/40 ${className}`}
      aria-hidden
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-full mt-4" />
      </div>
    </div>
  );
}
