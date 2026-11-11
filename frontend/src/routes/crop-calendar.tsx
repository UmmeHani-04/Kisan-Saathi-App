import { createFileRoute } from "@tanstack/react-router";
import { CalendarPage } from "@/components/Workspace";

export const Route = createFileRoute("/crop-calendar")({ component: CalendarPage });
