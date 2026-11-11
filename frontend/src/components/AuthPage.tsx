import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import AuthDialog from "@/components/AuthDialog";
import { AuthProvider, useAuth } from "@/components/auth";
import {
  getStoredLanguage,
  LanguageContext,
  siteLanguages,
  storeLanguage,
  translate,
  type SiteLanguage,
} from "@/lib/siteLanguage";

function AuthPageContent({
  mode,
  language,
  setLanguage,
}: {
  mode: "login" | "signup";
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
}) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);

  useEffect(() => {
    if (!loading && user) void navigate({ to: "/dashboard", replace: true });
  }, [loading, navigate, user]);

  return (
    <main className="auth-page">
      <div className="auth-page-language">
        <label htmlFor="auth-language">Language</label>
        <select
          id="auth-language"
          value={language}
          onChange={(event) => {
            const next = event.target.value as SiteLanguage;
            setLanguage(next);
            storeLanguage(next);
          }}
        >
          {siteLanguages.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <section className="auth-page-card" aria-labelledby="auth-page-title">
        <Link to="/" className="auth-page-brand">
          <span className="brand-mark">
            <Leaf aria-hidden="true" />
          </span>
          <span>
            Kishan <b>Saathi</b>
            <small>Your farming partner</small>
          </span>
        </Link>
        <AuthDialog
          open
          onOpenChange={() => undefined}
          embedded
          initialMode={mode}
          onSuccess={() => {
            const target =
              window.localStorage.getItem("kishanSaathiRedirectAfterLogin") || "/dashboard";
            window.localStorage.removeItem("kishanSaathiRedirectAfterLogin");
            void navigate({ to: target as "/dashboard", replace: true });
          }}
        />
        <Link to="/" className="auth-page-back">
          Back to home
        </Link>
        <span id="auth-page-title" className="sr-only">
          {mode === "login" ? t("welcomeBack") : "Join Kishan Saathi"}
        </span>
      </section>
    </main>
  );
}

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const [language, setLanguage] = useState<SiteLanguage>("en");
  useEffect(() => setLanguage(getStoredLanguage()), []);
  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: (key) => translate(language, key) }}
    >
      <AuthProvider>
        <AuthPageContent mode={mode} language={language} setLanguage={setLanguage} />
      </AuthProvider>
    </LanguageContext.Provider>
  );
}
