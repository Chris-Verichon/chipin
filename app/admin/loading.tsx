import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-36 hidden sm:block" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        {/* Chart */}
        <Skeleton className="h-72 rounded-lg" />
        {/* Tables */}
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </main>
    </div>
  );
}
