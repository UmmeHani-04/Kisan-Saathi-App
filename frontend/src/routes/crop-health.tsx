import { createFileRoute } from "@tanstack/react-router";
import { DiseasePage } from "@/components/Workspace";

export const Route = createFileRoute("/crop-health")({ component: DiseasePage });
