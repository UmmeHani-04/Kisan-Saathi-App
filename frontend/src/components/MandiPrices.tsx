import { useState } from "react";
import { LoaderCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth";
import { useLanguage } from "@/lib/siteLanguage";
import VoiceInput from "@/components/VoiceInput";

const API_URL = import.meta.env["VITE_CHAT_API_URL"] || "http://localhost:8000";

type MandiRecord = Record<string, string | number | undefined>;

function firstValue(record: MandiRecord, names: string[]) {
  const key = Object.keys(record).find((candidate) =>
    names.includes(candidate.toLowerCase().replaceAll(" ", "_")),
  );
  return key ? String(record[key] ?? "—") : "—";
}

export default function MandiPrices() {
  const { t } = useLanguage();
  const { user, configured, getIdToken } = useAuth();
  const [filters, setFilters] = useState({ state: "", district: "", commodity: "", market: "" });
  const [records, setRecords] = useState<MandiRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadPrices() {
    if (configured && !user) {
      setError(t("loginToContinue"));
      return;
    }

    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: "50" });
      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim()) params.set(key, value.trim());
      });
      const token = await getIdToken();
      const requestInit: RequestInit = {};
      if (token) requestInit.headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(`${API_URL}/api/mandi-prices?${params}`, requestInit);
      const data: { records?: MandiRecord[]; error?: string } = await response.json();
      if (!response.ok) throw new Error(data.error || "Mandi request failed");
      setRecords(data.records ?? []);
    } catch (requestError) {
      console.error("Mandi prices lookup failed:", requestError);
      setRecords([]);
      setError("Mandi prices are temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" id="mandi-prices">
      <div className="section-heading">
        <span className="eyebrow">{t("mandi")}</span>
        <h2>{t("mandiTitle")}</h2>
        <p>{t("mandiDescription")}</p>
      </div>
      <Card className="mx-auto max-w-5xl border-border/70 shadow-md">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="size-5 text-primary" aria-hidden="true" />
            {t("mandiSearch")}
          </CardTitle>
          <div className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(filters) as Array<keyof typeof filters>).map((field) => (
              <div key={field} className="flex gap-2">
                <Input
                  value={filters[field]}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, [field]: event.target.value }))
                  }
                  placeholder={t(field)}
                  aria-label={t(field)}
                  className="h-10 min-w-0"
                />
                {field === "commodity" && (
                  <VoiceInput
                    value={filters[field]}
                    onChange={(value) => setFilters((current) => ({ ...current, [field]: value }))}
                  />
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="mt-3 w-fit"
            onClick={() => void loadPrices()}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {t("loadPrices")}
          </Button>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          {error && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          )}
          {!error && records.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("noPrices")}</p>
          )}
          {records.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-3">{t("commodity")}</th>
                    <th className="px-3 py-3">{t("market")}</th>
                    <th className="px-3 py-3">{t("minimum")}</th>
                    <th className="px-3 py-3">{t("maximum")}</th>
                    <th className="px-3 py-3">{t("price")}</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr
                      key={`${index}-${firstValue(record, ["commodity"])}`}
                      className="border-b last:border-0"
                    >
                      <td className="px-3 py-3 font-medium">
                        {firstValue(record, ["commodity", "commodity_name"])}
                      </td>
                      <td className="px-3 py-3">{firstValue(record, ["market", "market_name"])}</td>
                      <td className="px-3 py-3">
                        {firstValue(record, ["min_price", "minimum_price"])}
                      </td>
                      <td className="px-3 py-3">
                        {firstValue(record, ["max_price", "maximum_price"])}
                      </td>
                      <td className="px-3 py-3">{firstValue(record, ["modal_price", "price"])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
