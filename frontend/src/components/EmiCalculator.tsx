import { useState } from "react";
import { ArrowUpRight, Calculator } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateEmi, formatRupees } from "@/lib/emi";
import { useLanguage } from "@/lib/siteLanguage";

export default function EmiCalculator() {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(5);
  const result = calculateEmi({ principal: amount, annualRatePercent: rate, months: years * 12 });
  const emi = result?.emi ?? 0;
  const principalPercent = result?.principalShare ?? 100;
  const interestPercent = result?.interestShare ?? 0;

  return (
    <Card className="emi-workspace-card">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="size-5 text-primary" aria-hidden="true" />
          {t("emiPageTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="emi-workspace-grid">
        <div className="emi-workspace-fields">
          <label>
            <span className="emi-slider-heading">
              <span>{t("loanAmount")}</span>
              <strong>{formatRupees(amount)}</strong>
            </span>
            <input
              className="emi-range"
              type="range"
              min="10000"
              max="2500000"
              step="5000"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
            <span className="emi-slider-limits">
              <span>₹10,000</span>
              <span>₹25,00,000</span>
            </span>
            <input
              type="number"
              min="10000"
              max="2500000"
              step="5000"
              value={amount}
              onChange={(event) =>
                setAmount(Math.max(10000, Math.min(2500000, Number(event.target.value) || 10000)))
              }
            />
          </label>
          <label>
            <span className="emi-slider-heading">
              <span>{t("interestRate")}</span>
              <strong>{rate.toFixed(1)}%</strong>
            </span>
            <input
              className="emi-range"
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
            <span className="emi-slider-limits">
              <span>0%</span>
              <span>20%</span>
            </span>
            <input
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={rate}
              onChange={(event) =>
                setRate(Math.max(0, Math.min(20, Number(event.target.value) || 0)))
              }
            />
          </label>
          <label>
            <span className="emi-slider-heading">
              <span>{t("repaymentPeriod")}</span>
              <strong>
                {years} {years === 1 ? "year" : "years"}
              </strong>
            </span>
            <input
              className="emi-range"
              type="range"
              min="1"
              max="10"
              step="1"
              value={years}
              onChange={(event) => setYears(Number(event.target.value))}
            />
            <span className="emi-slider-limits">
              <span>1 year</span>
              <span>10 years</span>
            </span>
          </label>
        </div>
        <div className="emi-workspace-result">
          <span>{t("estimatedEmi")}</span>
          <strong>{formatRupees(emi)}</strong>
          <p>
            {formatRupees(amount)} at {rate.toFixed(1)}% for {years}{" "}
            {years === 1 ? "year" : "years"}
          </p>
          <div>
            <span>{t("totalInterest")}</span>
            <b>{formatRupees(result?.totalInterest ?? 0)}</b>
          </div>
          <div>
            <span>{t("totalRepayment")}</span>
            <b>{formatRupees(result?.totalPayable ?? 0)}</b>
          </div>
          <div className="emi-breakdown">
            <div className="emi-breakdown-bar">
              <span className="emi-principal-bar" style={{ width: `${principalPercent}%` }} />
              <span className="emi-interest-bar" style={{ width: `${interestPercent}%` }} />
            </div>
            <div className="emi-breakdown-legend">
              <span>
                {t("loanPrincipal")} {principalPercent.toFixed(1)}%
              </span>
              <span>
                {t("totalInterest")} {interestPercent.toFixed(1)}%
              </span>
            </div>
          </div>
          <Button asChild className="emi-ask-button">
            <Link to="/assistant">
              {t("askAboutLoan")} <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
