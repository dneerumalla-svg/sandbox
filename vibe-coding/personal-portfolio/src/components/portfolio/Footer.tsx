import { site } from "@/content/portfolio";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
        <p>
          © {year} {site.name}. All rights reserved.
        </p>
        <p>Built while learning software development.</p>
      </div>
    </footer>
  );
}
