import { Skeleton } from "@/components/ui/skeleton";

export default function CagnotteLoading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-4 py-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </main>
    </div>
  );
}
