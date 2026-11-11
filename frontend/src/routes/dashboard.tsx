import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/Workspace";
export const Route = createFileRoute("/dashboard")({ component: DashboardPage });
