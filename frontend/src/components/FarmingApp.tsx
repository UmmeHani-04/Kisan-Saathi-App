import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  Menu,
  X,
  Home,
  Info,
  LayoutGrid,
  BriefcaseBusiness,
  Phone,
  UserCircle,
  LogIn,
  ArrowUp,
  Sprout,
  CloudSun,
  TrendingUp,
  Landmark,
  Bell,
  Smartphone,
  Leaf,
  Sun,
  ShoppingBasket,
  MessageCircle,
  Search,
  Files,
  ArrowUpRight,
  ShieldCheck,
  ClipboardList,
  Handshake,
  Wheat,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/AuthDialog";
import AdvancedFeatures from "@/components/AdvancedFeatures";
import VoiceInput from "@/components/VoiceInput";
import { AuthProvider, useAuth } from "@/components/auth";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
  getStoredLanguage,
  LanguageContext,
  siteLanguages,
  storeLanguage,
  translate,
  useLanguage,
} from "@/lib/siteLanguage";
import landscape from "@/assets/farming-landscape.jpg";
import community from "@/assets/farming-community.jpg";

const API_URL = import.meta.env["VITE_CHAT_API_URL"] || "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 45_000;

type ChatTurn = { role: "user" | "assistant"; content: string };

const languages = [
  { code: "auto", label: "Auto" },
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
] as const;

const features = [
  {
    icon: "🌦️",
    title: "Weather Updates",
    text: "Plan your farming activities with timely weather information.",
  },
  {
    icon: "🌱",
    title: "Crop Guidance",
    text: "Learn about crops, fertilizers, soil and farming methods.",
  },
  {
    icon: "📈",
    title: "Market Prices",
    text: "Understand crop prices and explore selling options.",
  },
  {
    icon: "🌾",
    title: "Loan Assistance",
    text: "Explore agricultural loans and government schemes.",
  },
  {
    icon: "🔔",
    title: "Notifications",
    text: "Stay informed about important updates and deadlines.",
  },
  {
    icon: "📱",
    title: "Easy Access",
    text: "Get farming information in a simple, accessible format.",
  },
];

const services = [
  {
    icon: "🌿",
    title: "Crop Consultation",
    text: "Explore crop choices, cultivation tips and farming practices.",
    color: "green",
  },
  {
    icon: "☀️",
    title: "Weather Guidance",
    text: "Use weather information to plan your next farming activity.",
    color: "yellow",
  },
  {
    icon: "🛒",
    title: "Market Intelligence",
    text: "Learn how to check mandi prices and compare market options.",
    color: "blue",
  },
  {
    icon: "🏦",
    title: "Farm Loan Support",
    text: "Understand loan options, eligibility and application documents.",
    color: "purple",
  },
];

const steps = [
  { icon: "♙", title: "Tell Us Your Need", text: "Ask about a loan, scheme or farming challenge." },
  {
    icon: "⌕",
    title: "Explore Your Options",
    text: "Learn about possible schemes and requirements.",
  },
  {
    icon: "▤",
    title: "Understand Documents",
    text: "Prepare a checklist before contacting your bank.",
  },
  {
    icon: "↗",
    title: "Take the Next Step",
    text: "Check official sources and apply through the proper channel.",
  },
];

function App() {
  const { language: siteLanguage, setLanguage: setSiteLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { user, loading: authLoading, configured, signOutUser, getIdToken } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Friend";
  useEffect(() => {
    setLanguage(siteLanguage);
  }, [siteLanguage]);

  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            reveal.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".section, .feature-card, .service-card, .step, .bottom-cta")
      .forEach((el) => reveal.observe(el));
    const nav = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    document.querySelectorAll("section[id]").forEach((el) => nav.observe(el));
    return () => {
      reveal.disconnect();
      nav.disconnect();
    };
  }, [authLoading, configured, user]);
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [language, setLanguage] = useState<(typeof languages)[number]["code"]>(siteLanguage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const threadEndRef = useRef<HTMLDivElement>(null);

  function openAssistant() {
    openFeature("/assistant");
  }

  function openFeature(path: string) {
    if (configured && !user) {
      window.localStorage.setItem("kishanSaathiRedirectAfterLogin", path);
      setAuthOpen(true);
      return;
    }
    window.location.assign(path);
  }

  useEffect(() => {
    if (turns.length > 0 || loading) {
      threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [turns, loading]);

  async function askAssistant(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const message = question.trim();
    if (!message || loading) return;
    if (configured && !user) {
      setAuthOpen(true);
      return;
    }

    // Send earlier turns so the assistant can follow the conversation.
    const history = turns.slice(-10);

    setLoading(true);
    setError("");
    setTurns((current) => [...current, { role: "user", content: message }]);
    setQuestion("");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const token = await getIdToken();
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message, history, language }),
        signal: controller.signal,
      });

      const data: { reply?: string; error?: string } = await response.json().catch(() => ({}));
      if (response.status === 401) {
        setTurns((current) => current.slice(0, -1));
        setError(data.error || "Please log in to use the assistant.");
        setAuthOpen(true);
        return;
      }
      if (!response.ok || !data.reply) {
        setError(data.error || "The assistant could not answer right now. Please try again.");
        return;
      }

      const reply = data.reply;
      setTurns((current) => [...current, { role: "assistant", content: reply }]);
    } catch {
      setError("Could not connect. Please make sure your backend is running.");
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  }

  function startQuestion(text: string) {
    setQuestion(text);
    document.getElementById("assistant")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <div className="site public-site">
      <header className={menuOpen ? "navbar is-open" : "navbar"}>
        <a href="#home" className="brand">
          <span className="brand-mark">
            <Leaf aria-hidden="true" />
          </span>
          <span>
            Kishan <b>Saathi</b>
            <small>{t("heroNote")}</small>
          </span>
        </a>

        <nav
          id="main-navigation"
          className={menuOpen ? "is-open" : ""}
          aria-label="Main navigation"
        >
          <a href="#home" onClick={() => setMenuOpen(false)}>
            <Home aria-hidden="true" />
            {t("home")}
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            <Info aria-hidden="true" />
            {t("about")}
          </a>
          <a href="#features" onClick={() => setMenuOpen(false)}>
            <LayoutGrid aria-hidden="true" />
            {t("features")}
          </a>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            <BriefcaseBusiness aria-hidden="true" />
            {t("services")}
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            <Phone aria-hidden="true" />
            {t("contact")}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="site-language">
            {t("language")}
          </label>
          <select
            id="site-language"
            value={siteLanguage}
            onChange={(event) => {
              const nextLanguage = event.target.value as "en" | "hi" | "mr";
              setSiteLanguage(nextLanguage);
              storeLanguage(nextLanguage);
            }}
            className="h-9 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground"
          >
            {siteLanguages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
          {!authLoading &&
            (user ? (
              <>
                <UserCircle aria-hidden="true" className="account-icon" />
                <span className="hidden text-sm font-semibold text-foreground md:inline">
                  Hi, {firstName}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => void signOutUser()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => void window.location.assign("/login")}
              >
                <LogIn aria-hidden="true" />
                Login
              </Button>
            ))}
          <Button asChild className="nav-button max-sm:hidden">
            <Link to="/login">
              {t("getStarted")} <ArrowUpRight className="get-started-arrow" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>

      <Button
        variant="ghost"
        size="icon"
        className="menu-toggle mobile-menu-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X /> : <Menu />}
      </Button>

      <div
        className={menuOpen ? "nav-scrim is-open" : "nav-scrim"}
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
      />
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => {
          const target =
            window.localStorage.getItem("kishanSaathiRedirectAfterLogin") || "/dashboard";
          window.localStorage.removeItem("kishanSaathiRedirectAfterLogin");
          window.location.assign(target);
        }}
      />
      <main>
        <>
          <section className="hero" id="home">
            <img
              className="hero-image"
              src={landscape}
              alt="Indian farmer in a green agricultural field"
              width={1920}
              height={1024}
              fetchPriority="high"
            />
            <div className="hero-overlay" />
            <div className="hero-content">
              <span className="eyebrow">{t("heroEyebrow")}</span>
              <h1>
                Kishan Saathi
                <br />
                {t("heroTitle")}
              </h1>
              <p>{t("heroDescription")}</p>
              <div className="hero-actions">
                <Button asChild variant="hero" size="lg" className="hero-button">
                  <a
                    href="/assistant"
                    onClick={(event) => {
                      event.preventDefault();
                      openAssistant();
                    }}
                  >
                    {t("askQuestion")} <span>→</span>
                  </a>
                </Button>
                <Button asChild variant="glass" size="lg" className="hero-button">
                  <a href="#services">{t("exploreServices")}</a>
                </Button>
              </div>
              <p className="hero-note">🌿 {t("heroNote")}</p>
            </div>
          </section>

          <section className="stats">
            <div>
              <span>
                <Wheat aria-hidden="true" />
              </span>
              <p>
                <strong>{t("farmFirst")}</strong>
                <small>{t("designedForFarmers")}</small>
              </p>
            </div>
            <div>
              <span>
                <Landmark aria-hidden="true" />
              </span>
              <p>
                <strong>{t("loanGuidance")}</strong>
                <small>{t("understandOptions")}</small>
              </p>
            </div>
            <div>
              <span>
                <ClipboardList aria-hidden="true" />
              </span>
              <p>
                <strong>{t("simpleSteps")}</strong>
                <small>{t("documentChecklists")}</small>
              </p>
            </div>
            <div>
              <span>
                <Handshake aria-hidden="true" />
              </span>
              <p>
                <strong>{t("easyAccess")}</strong>
                <small>{t("helpWhenNeeded")}</small>
              </p>
            </div>
          </section>

          <section className="about section" id="about">
            <div className="about-photo">
              <img
                src={community}
                loading="lazy"
                width={1024}
                height={1024}
                alt="Indian farmers using technology in agriculture"
              />
              <div className="photo-label">Growing together, with knowledge 🌱</div>
            </div>
            <div className="about-copy">
              <span className="eyebrow">{t("aboutEyebrow")}</span>
              <h2>{t("aboutTitle")}</h2>
              <p>{t("aboutDescription")}</p>
              <a
                href="/assistant"
                className="text-link"
                onClick={(event) => {
                  event.preventDefault();
                  openAssistant();
                }}
              >
                {t("talkAssistant")} →
              </a>
            </div>
            <div className="about-facts">
              <div>
                <span>
                  <Sprout aria-hidden="true" />
                </span>
                <p>
                  <strong>{t("cropGuidance")}</strong>
                  <small>{t("featureDescription")}</small>
                </p>
              </div>
              <div>
                <span>
                  <Landmark aria-hidden="true" />
                </span>
                <p>
                  <strong>{t("loanAssistance")}</strong>
                  <small>{t("eligibility")}</small>
                </p>
              </div>
              <div>
                <span>
                  <ShieldCheck aria-hidden="true" />
                </span>
                <p>
                  <strong>{t("important")}</strong>
                  <small>{t("verifyRules")}</small>
                </p>
              </div>
              <div>
                <span>
                  <MessageCircle aria-hidden="true" />
                </span>
                <p>
                  <strong>{t("easyAccess")}</strong>
                  <small>{t("featureDescription")}</small>
                </p>
              </div>
            </div>
          </section>

          <section className="features-section section" id="features">
            <div className="section-heading">
              <span className="eyebrow">{t("madeForNeeds")}</span>
              <h2>{t("servicesTitle")}</h2>
              <p>{t("featureDescription")}</p>
            </div>
            <div className="feature-grid">
              {features.map((item) => (
                <article className="feature-card" key={item.title}>
                  <span className="feature-icon">
                    {(() => {
                      const Icon = [CloudSun, Sprout, TrendingUp, Landmark, Bell, Smartphone][
                        features.indexOf(item)
                      ];
                      return Icon ? <Icon aria-hidden="true" /> : item.icon;
                    })()}
                  </span>
                  <h3>
                    {
                      [
                        t("weatherUpdates"),
                        t("cropGuidance"),
                        t("marketPrices"),
                        t("loanAssistance"),
                        t("notifications"),
                        t("easyAccess"),
                      ][features.indexOf(item)]
                    }
                  </h3>
                  <p>{t("featureDescription")}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="steps-section section">
            <div className="section-heading">
              <span className="eyebrow">{t("howItWorks")}</span>
              <h2>{t("stepsTitle")}</h2>
            </div>
            <div className="steps-grid">
              {steps.map((step, index) => (
                <article className="step" key={step.title}>
                  <div className={`step-icon step-${index + 1}`}>
                    {(() => {
                      const Icon = [MessageCircle, Search, Files, ArrowUpRight][index];
                      return Icon ? <Icon aria-hidden="true" /> : step.icon;
                    })()}
                  </div>
                  <h3>
                    {index + 1}. {step.title}
                  </h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="services-section section" id="services">
            <div className="section-heading">
              <span className="eyebrow">{t("ourServices")}</span>
              <h2>{t("servicesTitle")}</h2>
              <p>{t("servicesDescription")}</p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <div className={`service-banner ${service.color}`}>
                    {(() => {
                      const Icon = [Leaf, Sun, ShoppingBasket, Landmark][services.indexOf(service)];
                      return Icon ? <Icon aria-hidden="true" /> : service.icon;
                    })()}
                    <ArrowUpRight className="service-arrow" aria-hidden="true" />
                  </div>
                  <div className="service-body">
                    <h3>{service.title}</h3>
                    <p>{t("servicesDescription")}</p>
                    <Button
                      variant="link"
                      onClick={() =>
                        startQuestion(
                          service.title === "Farm Loan Support"
                            ? "What agricultural loan schemes can farmers explore?"
                            : `Can you guide me about ${service.title.toLowerCase()}?`,
                        )
                      }
                    >
                      {t("explore")} →
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <AdvancedFeatures overviewOnly />

          <section className="assistant-section section" id="assistant">
            <div className="assistant-intro">
              <span className="eyebrow">{t("assistantEyebrow")}</span>
              <h2>{t("assistantTitle")}</h2>
              <p>{t("assistantDescription")}</p>
              <div className="trust-note">🌿 {t("verifyRules")}</div>
            </div>

            <div className="chat-card">
              <div className="chat-title">
                <div className="chat-avatar">
                  <Sprout aria-hidden="true" />
                </div>
                <div>
                  <h3>Kishan Saathi Assistant</h3>
                  <p>{t("assistantReady")}</p>
                </div>
                <span className="online-dot" />
              </div>

              <div className="chat-welcome">
                <strong>{t("namaste")} 🙏</strong>
                <p>{t("assistantQuestion")}</p>
              </div>

              <div className="language-switch" role="group" aria-label="Answer language">
                <span>{t("answerIn")}</span>
                {languages.map((item) => (
                  <Button
                    key={item.code}
                    type="button"
                    variant="outline"
                    aria-pressed={language === item.code}
                    className={language === item.code ? "is-selected" : ""}
                    onClick={() => {
                      setLanguage(item.code);
                      if (item.code !== "auto") storeLanguage(item.code);
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>

              <div className="question-chips">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setQuestion("What is the Kisan Credit Card scheme?")}
                >
                  What is KCC?
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() =>
                    setQuestion("What documents may be needed for an agricultural loan?")
                  }
                >
                  {t("loanDocuments")}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setQuestion("How can I check my eligibility for a farm loan?")}
                >
                  {t("loanEligibility")}
                </Button>
              </div>

              {turns.length > 0 && (
                <div
                  className="chat-thread"
                  role="log"
                  aria-live="polite"
                  aria-label="Conversation"
                >
                  {turns.map((turn, index) => (
                    <Message
                      key={`${turn.role}-${index}`}
                      from={turn.role}
                      className={turn.role === "assistant" ? "chat-reply" : "chat-user"}
                    >
                      <MessageContent>
                        {turn.role === "assistant" && <strong>Assistant</strong>}
                        {turn.role === "assistant" ? (
                          <MessageResponse>{turn.content}</MessageResponse>
                        ) : (
                          <p>{turn.content}</p>
                        )}
                      </MessageContent>
                    </Message>
                  ))}
                  <div ref={threadEndRef} />
                </div>
              )}
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              {loading && <Shimmer className="loading-text">Preparing your response...</Shimmer>}

              <PromptInput
                className="question-form"
                onSubmit={async (_, event) => {
                  await askAssistant(event);
                }}
              >
                <PromptInputTextarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder={t("typeQuestion")}
                  aria-label={t("typeQuestion")}
                />
                <PromptInputFooter className="justify-end">
                  <VoiceInput value={question} onChange={setQuestion} />
                  <PromptInputSubmit
                    status={loading ? "submitted" : "ready"}
                    disabled={loading || !question.trim()}
                    aria-label={t("sendQuestion")}
                  >
                    {loading ? undefined : <ArrowUp />}
                  </PromptInputSubmit>
                </PromptInputFooter>
              </PromptInput>
              <small className="chat-disclaimer">{t("guidanceDisclaimer")}</small>
            </div>
          </section>

          <section className="bottom-cta">
            <div>
              <span>
                <Wheat aria-hidden="true" />
              </span>
              <div>
                <h2>{t("ctaTitle")}</h2>
                <p>{t("ctaDescription")}</p>
              </div>
            </div>
            <Button asChild variant="hero" size="lg">
              <a
                href="/assistant"
                onClick={(event) => {
                  event.preventDefault();
                  openAssistant();
                }}
              >
                {t("askKishan")} ↗
              </a>
            </Button>
          </section>
        </>
      </main>

      <footer className="footer" id="contact">
        <div className="footer-main">
          <a href="#home" className="brand footer-brand">
            <span className="brand-mark">
              <Leaf aria-hidden="true" />
            </span>
            <span>
              Kishan <b>Saathi</b>
              <small>{t("heroNote")}</small>
            </span>
          </a>
          <div>
            <h4>{t("explore")}</h4>
            <a href="#about">{t("about")}</a>
            <a href="#features">{t("features")}</a>
            <a href="#services">{t("services")}</a>
          </div>
          <div>
            <h4>{t("quickLinks")}</h4>
            <a
              href="/assistant"
              onClick={(event) => {
                event.preventDefault();
                openAssistant();
              }}
            >
              {t("assistant")}
            </a>
            <a
              href="/emi-calculator"
              onClick={(event) => {
                event.preventDefault();
                openFeature("/emi-calculator");
              }}
            >
              {t("loanGuidance")}
            </a>
            <a href="#home">{t("home")}</a>
          </div>
          <div>
            <h4>{t("important")}</h4>
            <p>{t("footerDisclaimer")}</p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Kishan Saathi · Built to support India's farming community.
        </div>
      </footer>
    </div>
  );
}

export default function Root() {
  const [language, setLanguage] = useState<ReturnType<typeof getStoredLanguage>>("en");

  useEffect(() => {
    setLanguage(getStoredLanguage());
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: (key) => translate(language, key),
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </LanguageContext.Provider>
  );
}
