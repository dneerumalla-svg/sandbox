import { createFileRoute } from "@tanstack/react-router";
import Calculator from "@/components/Calculator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova Calculator — Modern Web Calculator" },
      {
        name: "description",
        content:
          "A polished Apple-inspired scientific calculator with history, keyboard input, dark mode, and smooth animations.",
      },
      { property: "og:title", content: "Nova Calculator" },
      {
        property: "og:description",
        content: "Modern scientific calculator with history and dark mode.",
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  return <Calculator />;
}
