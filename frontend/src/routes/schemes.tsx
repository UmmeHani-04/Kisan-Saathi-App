import { createFileRoute } from "@tanstack/react-router";
import { SchemesPage } from "@/components/Workspace";
export const Route = createFileRoute("/schemes")({ component: SchemesPage });
