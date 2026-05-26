export default function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <div className="aspect-video shimmer-skeleton" />
      <div className="flex flex-col gap-2.5 p-4">
        <div className="shimmer-skeleton h-4 w-16 rounded-full" />
        <div className="shimmer-skeleton h-4 w-full rounded-md" />
        <div className="shimmer-skeleton h-4 w-4/5 rounded-md" />
        <div className="shimmer-skeleton h-3 w-full rounded-md mt-1" />
        <div className="shimmer-skeleton h-3 w-full rounded-md" />
        <div className="shimmer-skeleton h-3 w-3/5 rounded-md" />
      </div>
    </div>
  );
}
