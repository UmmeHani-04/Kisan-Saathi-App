import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/Workspace";
export const Route = createFileRoute("/profile")({ component: ProfilePage });
