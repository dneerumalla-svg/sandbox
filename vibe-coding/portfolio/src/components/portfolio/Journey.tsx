import { timeline } from "@/content/portfolio";

export function Journey() {
  return (
    <section
      id="journey"
      className="border-y border-border bg-surface/30 px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 font-display text-3xl font-bold text-foreground">
          Journey
        </h2>

        {/* Vertical rail on small screens; horizontal-scrollable rail on md+
            so future milestones can be added without redesigning the layout. */}
        <div className="md:overflow-x-auto md:pb-6">
          <ol className="space-y-12 border-l border-border pl-8 md:flex md:min-w-max md:space-y-0 md:border-l-0 md:border-t md:pl-0 md:pt-8">
            {timeline.map((entry, i) => (
              <li
                key={i}
                className="relative md:min-w-[280px] md:max-w-sm md:flex-1 md:pl-0 md:pr-16 md:pt-0"
              >
                <div
                  className={`absolute -left-[37px] top-1.5 h-4 w-4 rounded-full md:-top-[42px] md:left-0 ${
                    i === 0
                      ? "bg-accent shadow-[0_0_15px_rgba(232,93,58,0.5)]"
                      : "bg-border"
                  }`}
                />
                <p className="mb-1 text-sm text-muted-foreground">
                  {entry.year}
                </p>
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  {entry.title}
                </h3>
                <p className="text-muted-foreground">{entry.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
