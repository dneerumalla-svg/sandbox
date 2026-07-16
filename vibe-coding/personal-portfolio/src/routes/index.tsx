import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Journey } from "@/components/portfolio/Journey";
import { Projects } from "@/components/portfolio/Projects";
import { Skills } from "@/components/portfolio/Skills";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { PageSkeleton } from "@/components/portfolio/PageSkeleton";
import { site } from "@/content/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} — ${site.role}` },
      { name: "description", content: site.intro },
      { property: "og:title", content: `${site.name} — Portfolio` },
      { property: "og:description", content: site.intro },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const done = () => {
      // small delay so the skeleton is perceptible on fast loads
      window.setTimeout(() => setReady(true), 350);
    };
    if (document.readyState === "complete") {
      done();
    } else {
      window.addEventListener("load", done, { once: true });
      return () => window.removeEventListener("load", done);
    }
  }, []);

  if (!ready) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <Nav />
      <main>
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
