export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav skeleton */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-12">
          <div className="skeleton-pulse h-6 w-10 rounded-sm" />
          <div className="hidden gap-6 md:flex">
            <div className="skeleton-pulse h-4 w-14 rounded-sm" />
            <div className="skeleton-pulse h-4 w-14 rounded-sm" />
            <div className="skeleton-pulse h-4 w-16 rounded-sm" />
            <div className="skeleton-pulse h-4 w-14 rounded-sm" />
            <div className="skeleton-pulse h-4 w-16 rounded-sm" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center border-b border-border px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <div className="skeleton-pulse mb-6 h-3 w-40 rounded-sm" />
          <div className="skeleton-pulse mb-4 h-20 w-64 rounded-sm md:h-28 md:w-96" />
          <div className="skeleton-pulse mb-10 h-20 w-80 rounded-sm md:h-28 md:w-[28rem]" />
          <div className="space-y-3">
            <div className="skeleton-pulse h-4 w-full max-w-xl rounded-sm" />
            <div className="skeleton-pulse h-4 w-4/5 max-w-lg rounded-sm" />
            <div className="skeleton-pulse h-4 w-3/5 max-w-md rounded-sm" />
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <div className="skeleton-pulse h-12 w-36 rounded-sm" />
            <div className="skeleton-pulse h-12 w-28 rounded-sm" />
            <div className="skeleton-pulse h-12 w-12 rounded-full" />
            <div className="skeleton-pulse h-12 w-12 rounded-full" />
          </div>
        </div>
      </section>

      {/* About-ish skeleton */}
      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2 md:px-12 md:py-32">
        <div>
          <div className="skeleton-pulse mb-8 h-8 w-32 rounded-sm" />
          <div className="space-y-3">
            <div className="skeleton-pulse h-4 w-full rounded-sm" />
            <div className="skeleton-pulse h-4 w-11/12 rounded-sm" />
            <div className="skeleton-pulse h-4 w-10/12 rounded-sm" />
            <div className="skeleton-pulse h-4 w-9/12 rounded-sm" />
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <div className="skeleton-pulse mb-8 h-px w-full" />
          <div className="skeleton-pulse mb-3 h-3 w-40 rounded-sm" />
          <div className="skeleton-pulse mb-2 h-4 w-56 rounded-sm" />
          <div className="skeleton-pulse h-4 w-4/5 rounded-sm" />
        </div>
      </section>
    </div>
  );
}
