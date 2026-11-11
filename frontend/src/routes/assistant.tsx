import { createFileRoute } from "@tanstack/react-router";
import { AssistantPage } from "@/components/Workspace";
export const Route = createFileRoute("/assistant")({ component: AssistantPage });
