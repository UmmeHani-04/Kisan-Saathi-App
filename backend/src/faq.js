// Verified, instant answers for the three quick-reply chips in the frontend.
// They are built from data/knowledge.json, so they cost nothing, are fast,
// and work even when no API key is configured.

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

const bullets = (items) => items.map((item) => `- ${item}`).join("\n");

export function buildFaq(knowledge) {
  const kcc = knowledge.schemes.find((s) => s.id === "kcc");

  const kccAnswer = [
    `**${kcc.name}** is a ${kcc.type.toLowerCase()}. ${kcc.summary}`,
    `**Who can apply**\n${bullets(kcc.who_can_apply)}`,
    `**Interest and benefits**\n${kcc.interest_and_benefits}`,
    `**Collateral**\n${kcc.collateral}`,
    `Please confirm current limits, rates and rules with your bank branch before applying. This is guidance only, not an approval.`,
  ].join("\n\n");

  const docsAnswer = [
    `**Documents usually needed for an agricultural loan**\n${bullets(knowledge.documents.common)}`,
    `**If you are a tenant farmer or sharecropper, you may also need**\n${bullets(knowledge.documents.tenant_or_sharecropper_extra)}`,
    `**For larger loans, the bank may also ask for**\n${bullets(knowledge.documents.may_be_asked_for_larger_loans)}`,
    knowledge.documents.caution,
  ].join("\n\n");

  const eligibilityAnswer = [
    `**How to check if you may be eligible**\n${bullets(knowledge.eligibility_basics)}`,
    `**Next steps**\n${bullets([
      "Collect your land record, ID proof and bank details.",
      "Visit your nearest bank or cooperative bank branch and ask for the current eligibility rules for a Kisan Credit Card or crop loan.",
      "Ask the Kisan Call Centre (1800-180-1551) if you need help in your language.",
    ])}`,
    `Only the bank can confirm your eligibility. Never pay anyone to guarantee a loan.`,
  ].join("\n\n");

  return new Map([
    [normalize("What is the Kisan Credit Card scheme?"), kccAnswer],
    [normalize("What documents may be needed for an agricultural loan?"), docsAnswer],
    [normalize("How can I check my eligibility for a farm loan?"), eligibilityAnswer],
  ]);
}

export function findFaqAnswer(faq, message) {
  return faq.get(normalize(message)) ?? null;
}
