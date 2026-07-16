import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-6 py-24 md:py-32">
      {(eyebrow || title) && (
        <header className="mb-12 max-w-2xl">
          {eyebrow && (
            <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px w-8 bg-accent" />
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
              {title}
            </h2>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
