import { createFileRoute } from "@tanstack/react-router";
import { MandiPage } from "@/components/Workspace";

export const Route = createFileRoute("/mandi")({ component: MandiPage });
