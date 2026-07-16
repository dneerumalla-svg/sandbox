import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/portfolio";

export function Projects() {
  return (
    <section
      id="projects"
      className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mb-16 flex items-end justify-between">
        <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
          Projects
        </h2>
        <span className="hidden text-sm text-muted-foreground md:block">
          Selected Works
        </span>
      </div>

      {/* Wrapper supports future horizontal scroll once more projects are added. */}
      <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
        <div className="grid gap-12 md:grid-cols-2">
          {projects.map((p, i) => {
            const href = p.demo || p.github || "";
            const external = Boolean(href);
            const Wrapper: React.ElementType = external ? "a" : "div";
            const wrapperProps = external
              ? {
                  href,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "group block",
                }
              : { className: "group block" };

            return (
              <Wrapper key={i} {...wrapperProps}>
                <div className="relative mb-6 aspect-video overflow-hidden bg-surface">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm uppercase tracking-widest text-border">
                      Coming soon
                    </div>
                  )}
                  <div className="absolute inset-0 bg-accent opacity-0 mix-blend-multiply transition-opacity group-hover:opacity-10" />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-bold text-foreground transition-colors group-hover:text-accent">
                    {p.title}
                  </h3>
                  {external && (
                    <ArrowUpRight className="mt-1 h-5 w-5 text-muted-foreground transition-colors group-hover:text-accent" />
                  )}
                </div>
                <p className="mb-4 mt-2 text-muted-foreground">
                  {p.description}
                </p>
                {p.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {p.technologies.map((t) => (
                      <span
                        key={t}
                        className="border border-border px-2 py-1 text-[10px] uppercase tracking-tight text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
