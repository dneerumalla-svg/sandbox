import { skills, currentlyLearning } from "@/content/portfolio";

export function Skills() {
  return (
    <section
      id="skills"
      className="border-y border-border bg-black/20 px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 lg:grid-cols-4">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-accent">
              {group.category}
            </h3>
            <ul className="space-y-3 text-lg font-medium text-foreground">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <div className="border border-border bg-background p-8">
          <h3 className="mb-4 font-display text-lg font-bold text-foreground">
            Currently Learning
          </h3>
          <p className="mb-2 text-foreground">{currentlyLearning.topic}</p>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            {currentlyLearning.description}
          </p>
          <div className="h-1 w-full bg-border">
            <div
              className="h-full bg-accent transition-all"
              style={{
                width: `${Math.max(0, Math.min(100, currentlyLearning.progress))}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
