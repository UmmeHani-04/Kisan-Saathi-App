import { createFileRoute } from "@tanstack/react-router";
import FarmingApp from "@/components/FarmingApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kishan Saathi — Your Farming Partner" },
      {
        name: "description",
        content:
          "Get guidance on agricultural loans, government schemes, farming practices and more — all in one place.",
      },
      { property: "og:title", content: "Kishan Saathi — Your Farming Partner" },
      {
        property: "og:description",
        content:
          "Get guidance on agricultural loans, government schemes, farming practices and more — all in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FarmingApp,
});
