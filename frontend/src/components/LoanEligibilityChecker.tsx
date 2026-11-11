import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, FileText, Info, Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/siteLanguage";

type LandUnit = "acres" | "hectares";
type OwnershipStatus = "owner" | "tenant";
type ExistingLoans = "yes" | "no";

export type LoanEligibilityForm = {
  landSize: number;
  landUnit: LandUnit;
  ownershipStatus: OwnershipStatus;
  cropType: string;
  existingLoans: ExistingLoans;
};

export type EligibleScheme = {
  id: string;
  name: string;
  description: string;
  documents: string[];
};

const schemes = {
  kcc: {
    id: "kcc",
    name: "KCC - Kisan Credit Card",
    description:
      "A flexible credit facility for crop cultivation and other agricultural needs. Landowners and tenant farmers may be considered, subject to bank rules.",
    documents: [
      "Identity proof (Aadhaar, voter ID, or another accepted document)",
      "Address proof",
      "Land ownership or valid cultivation/tenancy proof",
      "Recent passport-size photographs",
      "Bank account details",
    ],
  },
  pmKisan: {
    id: "pm-kisan",
    name: "PM-KISAN",
    description:
      "Income support for eligible landholding farmer families. Ownership records and government eligibility checks apply.",
    documents: [
      "Aadhaar card",
      "Land ownership records",
      "Bank account details linked to Aadhaar",
      "Mobile number",
    ],
  },
  cropInsurance: {
    id: "crop-insurance",
    name: "Crop Insurance",
    description:
      "Protection against eligible crop losses caused by notified risks. Coverage and enrollment dates depend on the crop and season.",
    documents: [
      "Identity proof",
      "Land ownership or cultivation/tenancy proof",
      "Bank account details",
      "Sowing declaration or crop details",
    ],
  },
} satisfies Record<string, EligibleScheme>;

function getEligibleSchemes(form: LoanEligibilityForm): EligibleScheme[] {
  if (form.landSize <= 0 || !form.cropType) {
    return [];
  }

  const eligibleSchemes: EligibleScheme[] = [schemes.kcc, schemes.cropInsurance];

  if (form.ownershipStatus === "owner") {
    eligibleSchemes.splice(1, 0, schemes.pmKisan);
  }

  return eligibleSchemes;
}

const initialForm: LoanEligibilityForm = {
  landSize: 0,
  landUnit: "acres",
  ownershipStatus: "owner",
  cropType: "",
  existingLoans: "no",
};

const fieldClassName =
  "h-11 w-full rounded-lg border-input bg-background px-3 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30";
const labelClassName = "text-sm font-medium text-foreground";

export default function LoanEligibilityChecker() {
  const { t } = useLanguage();
  const [form, setForm] = useState<LoanEligibilityForm>(initialForm);
  const [results, setResults] = useState<EligibleScheme[] | null>(null);
  const [error, setError] = useState("");

  function updateField<Key extends keyof LoanEligibilityForm>(
    field: Key,
    value: LoanEligibilityForm[Key],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!Number.isFinite(form.landSize) || form.landSize <= 0) {
      setError("Enter a land size greater than 0.");
      setResults(null);
      return;
    }

    if (!form.cropType) {
      setError("Select the crop you grow.");
      setResults(null);
      return;
    }

    setError("");
    setResults(getEligibleSchemes(form));
  }

  function handleReset() {
    setForm(initialForm);
    setResults(null);
    setError("");
  }

  return (
    <section
      className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6"
      aria-labelledby="loan-checker-title"
    >
      <Card className="overflow-hidden border-border/70 shadow-md">
        <CardHeader className="border-b bg-muted/30 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <Sprout className="size-6" aria-hidden="true" />
            </div>
            <div>
              <CardTitle id="loan-checker-title" className="text-xl sm:text-2xl">
                {t("loanChecker")}
              </CardTitle>
              <CardDescription className="mt-2 max-w-2xl leading-relaxed">
                {t("checkerDescription")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_10rem]">
              <div className="space-y-2">
                <label htmlFor="land-size" className={labelClassName}>
                  {t("landSize")}
                </label>
                <Input
                  id="land-size"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  placeholder={t("landPlaceholder")}
                  value={form.landSize || ""}
                  onChange={(event) =>
                    updateField("landSize", event.target.value ? Number(event.target.value) : 0)
                  }
                  className={fieldClassName}
                  aria-describedby="land-size-help"
                />
                <p id="land-size-help" className="text-xs text-muted-foreground">
                  {t("landHelp")}
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="land-unit" className={labelClassName}>
                  {t("unit")}
                </label>
                <select
                  id="land-unit"
                  value={form.landUnit}
                  onChange={(event) => updateField("landUnit", event.target.value as LandUnit)}
                  className={fieldClassName}
                >
                  <option value="acres">{t("acres")}</option>
                  <option value="hectares">{t("hectares")}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="ownership-status" className={labelClassName}>
                {t("ownershipStatus")}
              </label>
              <select
                id="ownership-status"
                value={form.ownershipStatus}
                onChange={(event) =>
                  updateField("ownershipStatus", event.target.value as OwnershipStatus)
                }
                className={fieldClassName}
              >
                <option value="owner">{t("owner")}</option>
                <option value="tenant">{t("tenant")}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="crop-type" className={labelClassName}>
                {t("cropType")}
              </label>
              <select
                id="crop-type"
                value={form.cropType}
                onChange={(event) => updateField("cropType", event.target.value)}
                className={fieldClassName}
              >
                <option value="">{t("selectCrop")}</option>
                <option value="cereals">Cereals (rice, wheat, maize)</option>
                <option value="pulses">Pulses</option>
                <option value="oilseeds">Oilseeds</option>
                <option value="cotton">Cotton</option>
                <option value="sugarcane">Sugarcane</option>
                <option value="vegetables">Vegetables</option>
                <option value="other">Other</option>
              </select>
            </div>

            <fieldset className="space-y-2">
              <legend className={labelClassName}>{t("existingLoans")}</legend>
              <div className="grid grid-cols-2 gap-3">
                {(["no", "yes"] as const).map((value) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      form.existingLoans === value
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-input hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="existing-loans"
                      value={value}
                      checked={form.existingLoans === value}
                      onChange={() => updateField("existingLoans", value)}
                      className="size-4 accent-primary"
                    />
                    {value === "yes" ? t("yes") : t("no")}
                  </label>
                ))}
              </div>
            </fieldset>

            {error && (
              <p className="text-sm font-medium text-destructive" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
              <Button type="submit" className="h-11 px-5">
                {t("checkEligibility")}
              </Button>
              <Button type="button" variant="outline" className="h-11" onClick={handleReset}>
                {t("clear")}
              </Button>
            </div>
          </form>

          <div className="min-w-0">
            {results === null ? (
              <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
                <Info className="mb-3 size-8 text-muted-foreground" aria-hidden="true" />
                <p className="font-medium text-foreground">{t("suggestionsPlaceholder")}</p>
                <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {t("suggestionsDescription")}
                </p>
              </div>
            ) : (
              <div className="space-y-4" aria-live="polite">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{t("schemesToExplore")}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("suggestionsBasedOnDetails")}
                  </p>
                </div>

                <div className="space-y-3">
                  {results.map((scheme) => (
                    <Card
                      key={scheme.id}
                      className="border-primary/20 bg-primary/[0.03] shadow-none"
                    >
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex gap-3">
                          <CheckCircle2
                            className="mt-0.5 size-5 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground">{scheme.name}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {scheme.description}
                            </p>
                            <div className="mt-4">
                              <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <FileText className="size-4 text-primary" aria-hidden="true" />
                                {t("documents")}
                              </h4>
                              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                                {scheme.documents.map((document) => (
                                  <li key={document} className="flex gap-2">
                                    <span className="text-primary" aria-hidden="true">
                                      •
                                    </span>
                                    <span>{document}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {form.existingLoans === "yes" && (
                  <p className="rounded-lg bg-amber-50 p-3 text-sm leading-relaxed text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                    Since you have an existing loan, the lender may review your repayment history
                    and outstanding balance before approving new credit.
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <div className="border-t bg-muted/20 px-5 py-4 text-xs leading-relaxed text-muted-foreground sm:px-8">
          <strong className="font-semibold text-foreground">{t("disclaimer")}:</strong>{" "}
          {t("generalGuidance")} {t("finalApproval")}
        </div>
      </Card>
    </section>
  );
}
