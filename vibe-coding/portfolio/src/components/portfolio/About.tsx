import { about, currentlyLearning } from "@/content/portfolio";

export function About() {
  return (
    <section
      id="about"
      className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2 md:px-12 md:py-32"
    >
      <div>
        <h2 className="mb-8 font-display text-3xl font-bold text-foreground">
          About
        </h2>
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-end">
        <div className="mb-8 h-px w-full bg-border" />
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
            Currently Learning
          </p>
          <p className="mb-1 text-foreground">{currentlyLearning.topic}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Currently learning Python fundamentals through structured courses
            while using AI coding tools to build beginner projects, reinforce
            programming concepts, and become more familiar with modern software
            development.
          </p>
        </div>
      </div>
    </section>
  );
}
