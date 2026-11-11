import { createFileRoute } from "@tanstack/react-router";
import { LoanEligibilityPage } from "@/components/Workspace";

export const Route = createFileRoute("/loan-eligibility")({ component: LoanEligibilityPage });
