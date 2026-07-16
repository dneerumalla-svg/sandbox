import { Github, Mail } from "lucide-react";
import { site, links } from "@/content/portfolio";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center border-b border-border px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.25em] text-accent">
          {site.role}
        </span>

        <h1 className="font-display text-6xl font-bold leading-[0.9] tracking-tighter text-foreground md:text-8xl lg:text-9xl">
          {site.firstName}
          <br />
          {site.lastName}
        </h1>

        <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          {site.intro}
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="rounded-none bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition-colors hover:brightness-110"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="rounded-none border border-border px-8 py-4 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Contact
          </a>

          <div className="flex items-center gap-3 sm:ml-2">
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <Github className="h-5 w-5" />
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                GitHub
              </span>
            </a>
            <a
              href={`mailto:${links.email}`}
              aria-label="Email"
              title="Email"
              className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <Mail className="h-5 w-5" />
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Email
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-10 top-1/2 hidden h-96 w-64 -translate-y-1/2 border border-border opacity-40 lg:block">
        <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full bg-accent opacity-5" />
      </div>
    </section>
  );
}
