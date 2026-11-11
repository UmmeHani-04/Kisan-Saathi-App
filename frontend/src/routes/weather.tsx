import { createFileRoute } from "@tanstack/react-router";
import { WeatherPage } from "@/components/Workspace";

export const Route = createFileRoute("/weather")({ component: WeatherPage });
