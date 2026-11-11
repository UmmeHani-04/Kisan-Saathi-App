export type EmiInput = {
  principal: number; // loan amount in rupees
  annualRatePercent: number; // e.g. 9 for 9% per year
  months: number; // whole number of months
};

export type YearRow = {
  year: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
};

export type EmiResult = {
  emi: number;
  totalPayable: number;
  totalInterest: number;
  principalShare: number; // 0..100
  interestShare: number; // 0..100
  yearly: YearRow[];
};

export const LIMITS = {
  minAmount: 1_000,
  maxAmount: 100_000_000, // 10 crore
  maxRate: 36,
  maxMonths: 360, // 30 years
} as const;

/** Standard reducing-balance EMI: P * r * (1+r)^n / ((1+r)^n - 1), r = monthly rate. */
export function calculateEmi({ principal, annualRatePercent, months }: EmiInput): EmiResult | null {
  const valid =
    Number.isFinite(principal) &&
    Number.isFinite(annualRatePercent) &&
    Number.isInteger(months) &&
    principal >= LIMITS.minAmount &&
    principal <= LIMITS.maxAmount &&
    annualRatePercent >= 0 &&
    annualRatePercent <= LIMITS.maxRate &&
    months >= 1 &&
    months <= LIMITS.maxMonths;
  if (!valid) return null;

  const r = annualRatePercent / 12 / 100;
  const emi =
    r === 0
      ? principal / months
      : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);

  const totalPayable = emi * months;
  const totalInterest = totalPayable - principal;

  const yearly: YearRow[] = [];
  let balance = principal;
  let principalPaid = 0;
  let interestPaid = 0;
  for (let month = 1; month <= months; month++) {
    const interest = balance * r;
    const principalPart = emi - interest;
    balance -= principalPart;
    principalPaid += principalPart;
    interestPaid += interest;
    if (month % 12 === 0 || month === months) {
      yearly.push({
        year: Math.ceil(month / 12),
        principalPaid,
        interestPaid,
        balance: month === months ? 0 : Math.max(balance, 0),
      });
      principalPaid = 0;
      interestPaid = 0;
    }
  }

  const interestShare = totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0;
  return {
    emi,
    totalPayable,
    totalInterest,
    principalShare: 100 - interestShare,
    interestShare,
    yearly,
  };
}

/** 1234567 -> "₹12,34,567" (Indian digit grouping) */
export function formatRupees(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

/** 500000 -> "5 lakh", 25000000 -> "2.5 crore". Helps people read big numbers. */
export function describeAmount(value: number): string {
  const trim = (n: number) => String(Number(n.toFixed(2)));
  if (value >= 10_000_000) return `${trim(value / 10_000_000)} crore`;
  if (value >= 100_000) return `${trim(value / 100_000)} lakh`;
  if (value >= 1_000) return `${trim(value / 1_000)} thousand`;
  return trim(value);
}