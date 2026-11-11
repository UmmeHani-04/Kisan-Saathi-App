import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  Bot,
  CalendarDays,
  CloudSun,
  Home,
  Landmark,
  Leaf,
  LogOut,
  Menu,
  ShoppingBasket,
  UserCircle,
  WalletCards,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "@/components/auth";
import AdvancedFeatures from "@/components/AdvancedFeatures";
import LoanEligibilityChecker from "@/components/LoanEligibilityChecker";
import EmiCalculator from "@/components/EmiCalculator";
import MandiPrices from "@/components/MandiPrices";
import WeatherSection from "@/components/WeatherSection";
import VoiceInput from "@/components/VoiceInput";
import {
  useLanguage,
  LanguageContext,
  getStoredLanguage,
  storeLanguage,
  translate,
  type SiteLanguage,
} from "@/lib/siteLanguage";
import { useContext } from "react";

const API_URL = import.meta.env["VITE_CHAT_API_URL"] || "http://localhost:8000";

const navItems = [
  { to: "/dashboard", labelKey: "dashboard", icon: Home },
  { to: "/assistant", labelKey: "aiAssistant", icon: Bot },
  { to: "/crop-calendar", labelKey: "cropCalendar", icon: CalendarDays },
  { to: "/crop-health", labelKey: "cropDisease", icon: Leaf },
  { to: "/schemes", labelKey: "governmentSchemes", icon: Landmark },
  { to: "/weather", labelKey: "weatherAlerts", icon: CloudSun },
  { to: "/mandi", labelKey: "mandiPrices", icon: ShoppingBasket },
  { to: "/emi-calculator", labelKey: "emiCalculator", icon: WalletCards },
  { to: "/loan-eligibility", labelKey: "loanChecker", icon: Landmark },
  { to: "/profile", labelKey: "myProfile", icon: UserCircle },
] as const;

function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>("en");
  useEffect(() => setLanguage(getStoredLanguage()), []);
  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: (key) => translate(language, key) }}
    >
      <AuthProvider>{children}</AuthProvider>
    </LanguageContext.Provider>
  );
}

function WorkspaceChrome({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, configured, loading, signOutUser } = useAuth();
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language || "en";
  const t =
    languageContext?.t || ((key: Parameters<typeof translate>[1]) => translate(language, key));
  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "";

  useEffect(() => {
    if (!loading && configured && !user) void navigate({ to: "/" });
  }, [configured, loading, navigate, user]);

  return (
    <div className="workspace">
      <button
        className="workspace-menu-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close navigation" : "Open navigation"}
      >
        {open ? <X /> : <Menu />}
      </button>
      <aside className={`workspace-sidebar ${open ? "is-open" : ""}`}>
        <Link to="/dashboard" className="workspace-brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <Leaf aria-hidden="true" />
          </span>
          <span>
            Kishan <b>Saathi</b>
            <small>Your farming partner</small>
          </span>
        </Link>
        <nav aria-label="Farmer workspace navigation">
          {navItems.map(({ to, labelKey, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={location.pathname === to ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              <Icon aria-hidden="true" /> {t(labelKey)}
            </Link>
          ))}
        </nav>
        <div className="workspace-sidebar-footer">
          <Link to="/">
            <Home aria-hidden="true" /> {t("publicWebsite")}
          </Link>
          <button type="button" onClick={() => void signOutUser()}>
            <LogOut aria-hidden="true" /> {t("logout")}
          </button>
        </div>
      </aside>
      <main className="workspace-main">
        <header className="workspace-topbar">
          <div>
            <span className="eyebrow">KISHAN SAATHI</span>
            {loading ? (
              <span className="workspace-title-skeleton" aria-label="Loading profile" />
            ) : (
              <h1>
                {t("welcomeBack")}
                {firstName ? `, ${firstName}` : ""}
              </h1>
            )}
          </div>
          <div className="workspace-user">
            <select
              aria-label="Language"
              value={language}
              onChange={(event) => {
                const nextLanguage = event.target.value as SiteLanguage;
                languageContext?.setLanguage(nextLanguage);
                storeLanguage(nextLanguage);
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
            <UserCircle aria-hidden="true" />
          </div>
        </header>
        <div className="workspace-content">{children}</div>
      </main>
    </div>
  );
}

export function WorkspacePage({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <WorkspaceChrome>{children}</WorkspaceChrome>
    </WorkspaceProvider>
  );
}

export function DashboardPage() {
  return (
    <WorkspacePage>
      <DashboardContent />
    </WorkspacePage>
  );
}

function DashboardContent() {
  const shortcuts = navItems.slice(1, 8);
  const { t } = useLanguage();
  return (
    <>
      <section className="workspace-hero">
        <div>
          <span className="eyebrow">{t("yourFarmAtAGlance")}</span>
          <h2>{t("dashboardHeroTitle")}</h2>
          <p>{t("dashboardHeroDescription")}</p>
        </div>
        <Link to="/weather" className="workspace-hero-action">
          <CloudSun /> {t("checkWeather")}
        </Link>
      </section>
      <div className="dashboard-grid">
        <Link to="/weather" className="dashboard-summary-card">
          <CloudSun />
          <span>{t("weatherOverview")}</span>
          <strong>{t("planAroundWeather")}</strong>
          <small>{t("seeForecast")}</small>
        </Link>
        <Link to="/crop-calendar" className="dashboard-summary-card">
          <CalendarDays />
          <span>{t("cropActivity")}</span>
          <strong>{t("stayCropPlan")}</strong>
          <small>{t("trackTask")}</small>
        </Link>
        <Link to="/mandi" className="dashboard-summary-card">
          <ShoppingBasket />
          <span>{t("marketWatch")}</span>
          <strong>{t("checkMandiPrices")}</strong>
          <small>{t("compareMarkets")}</small>
        </Link>
      </div>
      <div className="workspace-section-heading">
        <div>
          <span className="eyebrow">{t("quickAccess")}</span>
          <h2>{t("farmSmarter")}</h2>
        </div>
      </div>
      <div className="dashboard-feature-grid">
        {shortcuts.map(({ to, labelKey, icon: Icon }) => (
          <Link className="dashboard-feature-card" to={to} key={to}>
            <Icon />
            <strong>{t(labelKey)}</strong>
            <span>
              {t("openTool")} <b>→</b>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

export function FeaturePage({
  title,
  description,
  titleKey,
  descriptionKey,
  children,
}: {
  title: string;
  description: string;
  titleKey?: Parameters<typeof translate>[1];
  descriptionKey?: Parameters<typeof translate>[1];
  children: ReactNode;
}) {
  return (
    <WorkspacePage>
      <FeatureContent
        title={title}
        description={description}
        titleKey={titleKey}
        descriptionKey={descriptionKey}
      >
        {children}
      </FeatureContent>
    </WorkspacePage>
  );
}

function FeatureContent({
  title,
  description,
  titleKey,
  descriptionKey,
  children,
}: {
  title: string;
  description: string;
  titleKey?: Parameters<typeof translate>[1];
  descriptionKey?: Parameters<typeof translate>[1];
  children: ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <>
      <div className="workspace-page-heading">
        <span className="eyebrow">{t("farmingTool")}</span>
        <h2>{titleKey ? t(titleKey) : title}</h2>
        <p>{descriptionKey ? t(descriptionKey) : description}</p>
      </div>
      {children}
    </>
  );
}

export function CalendarPage() {
  return (
    <FeaturePage
      title="Smart Crop Calendar"
      description="Plan every stage of your farming journey from sowing to harvest."
      titleKey="smartCropCalendarTitle"
      descriptionKey="smartCropCalendarDescription"
    >
      <AdvancedFeatures mode="calendar" />
    </FeaturePage>
  );
}
export function DiseasePage() {
  return (
    <FeaturePage
      title="AI Crop Disease Detection"
      description="Upload a crop image for preliminary AI-powered health guidance."
      titleKey="cropDiseaseTitle"
      descriptionKey="cropDiseaseDescription"
    >
      <AdvancedFeatures mode="disease" />
    </FeaturePage>
  );
}
export function SchemesPage() {
  return (
    <FeaturePage
      title="Government Scheme Finder"
      description="Discover official schemes and benefits that may be relevant to your farm."
      titleKey="governmentSchemesTitle"
      descriptionKey="governmentSchemesDescription"
    >
      <AdvancedFeatures mode="schemes" />
    </FeaturePage>
  );
}
export function WeatherPage() {
  return (
    <FeaturePage
      title="Smart Weather Alerts"
      description="Search your location for practical weather insights and farming alerts."
      titleKey="weatherAlertsTitle"
      descriptionKey="weatherAlertsDescription"
    >
      <WeatherSection />
    </FeaturePage>
  );
}
export function MandiPage() {
  return (
    <FeaturePage
      title="Mandi Prices"
      description="Compare current market prices and make informed selling decisions."
      titleKey="mandiPageTitle"
      descriptionKey="mandiPageDescription"
    >
      <MandiPrices />
    </FeaturePage>
  );
}
export function EmiPage() {
  return (
    <FeaturePage
      title="EMI Calculator"
      description="Estimate your monthly farm-loan repayment before you apply."
      titleKey="emiPageTitle"
      descriptionKey="emiPageDescription"
    >
      <EmiCalculator />
    </FeaturePage>
  );
}

export function LoanEligibilityPage() {
  return (
    <FeaturePage
      title="Loan Eligibility"
      description="Check which agricultural schemes may match your farm details."
    >
      <LoanEligibilityChecker />
    </FeaturePage>
  );
}

export function ProfilePage() {
  return (
    <FeaturePage
      title="My Profile"
      description="Manage your account information and language preference."
      titleKey="profileTitle"
      descriptionKey="profileDescription"
    >
      <ProfileContent />
    </FeaturePage>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  return (
    <div className="profile-card">
      <UserCircle />
      <h3>{user?.displayName || "Kishan Saathi farmer"}</h3>
      <p>{user?.email || "Signed-in farmer account"}</p>
      <small>Your account is protected by Firebase Authentication.</small>
    </div>
  );
}

export function AssistantPage() {
  return (
    <FeaturePage
      title="AI Farming Assistant"
      description="Ask practical questions about crops, loans, schemes and farming decisions."
      titleKey="assistantPageTitle"
      descriptionKey="assistantPageDescription"
    >
      <AssistantContent />
    </FeaturePage>
  );
}

function AssistantContent() {
  const { user, configured, getIdToken } = useAuth();
  const { language, t } = useLanguage();
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  async function ask(event: FormEvent) {
    event.preventDefault();
    const message = question.trim();
    if (!message) return;
    setQuestion("");
    setLoading(true);
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message, history: [], language }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The assistant could not answer right now.");
      setReply(data.reply || "");
    } catch (error) {
      setReply(error instanceof Error ? error.message : "Could not connect to the assistant.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="workspace-chat-card">
      {configured && !user ? (
        <p>{t("loginToContinue")}</p>
      ) : (
        <>
          <div className="workspace-chat-response">{reply || t("assistantQuestion")}</div>
          <form onSubmit={ask} className="workspace-chat-form">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={t("typeQuestion")}
            />
            <VoiceInput value={question} onChange={setQuestion} />
            <button disabled={loading}>{loading ? "..." : t("sendQuestion")}</button>
          </form>
        </>
      )}
    </div>
  );
}
