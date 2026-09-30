export default function Loading() {
  return (
    <div className="container-eo py-8 lg:py-12" aria-hidden="true">
      <div className="skeleton mb-6 h-4 w-48 rounded-sm" />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="skeleton aspect-[4/5] rounded-sm" />
        <div className="lg:max-w-md">
          <div className="skeleton h-8 w-2/3 rounded-sm" />
          <div className="skeleton mt-3 h-4 w-1/2 rounded-sm" />
          <div className="skeleton mt-8 h-7 w-24 rounded-sm" />
          <div className="mt-6 flex gap-2">
            <div className="skeleton h-9 w-20 rounded-sm" />
            <div className="skeleton h-9 w-20 rounded-sm" />
            <div className="skeleton h-9 w-20 rounded-sm" />
          </div>
          <div className="skeleton mt-8 h-12 w-full rounded-sm" />
        </div>
      </div>
    </div>
  );
}
