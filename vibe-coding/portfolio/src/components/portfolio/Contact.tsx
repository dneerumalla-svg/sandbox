import { useEffect, useState } from "react";
import { links } from "@/content/portfolio";

export function Contact() {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const trigger = () => {
      if (window.location.hash === "#contact") {
        setHighlight(false);
        // next tick so the class removal actually replays the animation
        requestAnimationFrame(() => {
          setHighlight(true);
          window.setTimeout(() => setHighlight(false), 1100);
        });
      }
    };
    // catch initial load with hash
    trigger();
    window.addEventListener("hashchange", trigger);
    return () => window.removeEventListener("hashchange", trigger);
  }, []);

  return (
    <section id="contact" className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="mb-8 font-display text-5xl font-bold leading-none text-foreground md:text-6xl">
              Let's build
              <br />
              <span className="text-accent">together.</span>
            </h2>
            <p className="mb-12 text-xl text-muted-foreground">
              Reach out for collaborations or just to say hi.
            </p>
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Contact details
              </p>
              <a
                href={`mailto:${links.email}`}
                className={`block text-lg text-foreground underline decoration-border underline-offset-4 transition-all hover:decoration-accent ${
                  highlight ? "contact-pulse" : ""
                }`}
              >
                {links.email}
              </a>
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer"
                className={`block text-lg text-foreground underline decoration-border underline-offset-4 transition-all hover:decoration-accent ${
                  highlight ? "contact-pulse" : ""
                }`}
              >
                {links.github.replace(/^https?:\/\//, "")}
              </a>
            </div>
          </div>

          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              const name = String(data.get("name") || "");
              const email = String(data.get("email") || "");
              const message = String(data.get("message") || "");
              const body = `From: ${name} <${email}>\n\n${message}`;
              window.location.href = `mailto:${links.email}?subject=${encodeURIComponent(
                `Portfolio inquiry from ${name}`,
              )}&body=${encodeURIComponent(body)}`;
            }}
          >
            <div className="grid grid-cols-2 gap-8">
              <label className="flex flex-col border-b border-border pb-4 transition-colors focus-within:border-accent">
                <span className="mb-2 text-[10px] uppercase text-muted-foreground">
                  Name
                </span>
                <input
                  name="name"
                  type="text"
                  required
                  className="border-none bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50"
                  placeholder="Your name"
                />
              </label>
              <label className="flex flex-col border-b border-border pb-4 transition-colors focus-within:border-accent">
                <span className="mb-2 text-[10px] uppercase text-muted-foreground">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  className="border-none bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50"
                  placeholder="Email address"
                />
              </label>
            </div>
            <label className="flex flex-col border-b border-border pb-12 transition-colors focus-within:border-accent">
              <span className="mb-2 text-[10px] uppercase text-muted-foreground">
                Message
              </span>
              <textarea
                name="message"
                required
                rows={4}
                className="resize-none border-none bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50"
                placeholder="Write your message..."
              />
            </label>
            <button
              type="submit"
              className="w-full bg-foreground py-5 text-xs font-bold uppercase tracking-widest text-background transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
