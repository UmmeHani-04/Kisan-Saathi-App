import { createFileRoute } from "@tanstack/react-router";
import { EmiPage } from "@/components/Workspace";
export const Route = createFileRoute("/emi-calculator")({ component: EmiPage });
