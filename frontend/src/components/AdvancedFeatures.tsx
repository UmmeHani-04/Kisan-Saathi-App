import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CloudSun,
  ExternalLink,
  FileImage,
  Landmark,
  Leaf,
  LoaderCircle,
  ScanSearch,
  ShieldAlert,
  Sprout,
  Upload,
  Wheat,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth";
import { useLanguage, type SiteLanguage } from "@/lib/siteLanguage";

const API_URL = import.meta.env["VITE_CHAT_API_URL"] || "http://localhost:8000";

type CropKey = "wheat" | "rice" | "cotton" | "maize";
type Activity = { key: string; icon: string; days: number; en: string; hi: string; mr: string };

const cropActivities: Record<CropKey, Activity[]> = {
  wheat: [
    {
      key: "land",
      icon: "🌱",
      days: 0,
      en: "Land preparation",
      hi: "भूमि की तैयारी",
      mr: "जमीन तयार करणे",
    },
    {
      key: "seed",
      icon: "🌾",
      days: 5,
      en: "Seed selection and treatment",
      hi: "बीज चयन और उपचार",
      mr: "बियाणे निवड व प्रक्रिया",
    },
    { key: "sowing", icon: "🌾", days: 12, en: "Sowing", hi: "बुवाई", mr: "पेरणी" },
    {
      key: "irrigation",
      icon: "💧",
      days: 28,
      en: "First irrigation",
      hi: "पहली सिंचाई",
      mr: "पहिले पाणी",
    },
    {
      key: "fertilizer",
      icon: "🧪",
      days: 35,
      en: "Top-dress fertilizer",
      hi: "ऊपरी खाद डालें",
      mr: "वरखत देणे",
    },
    {
      key: "harvest",
      icon: "🌾",
      days: 115,
      en: "Harvest check",
      hi: "कटाई की जांच",
      mr: "कापणी तपासणी",
    },
  ],
  rice: [
    {
      key: "nursery",
      icon: "🌱",
      days: 0,
      en: "Nursery and land preparation",
      hi: "नर्सरी और भूमि तैयारी",
      mr: "रोपवाटिका व जमीन तयारी",
    },
    {
      key: "transplant",
      icon: "🌾",
      days: 22,
      en: "Transplant seedlings",
      hi: "पौध रोपाई",
      mr: "रोपांची लागवड",
    },
    {
      key: "irrigation",
      icon: "💧",
      days: 30,
      en: "Maintain shallow water",
      hi: "हल्का पानी बनाए रखें",
      mr: "थोडे पाणी ठेवा",
    },
    {
      key: "weed",
      icon: "🌿",
      days: 38,
      en: "Weed management",
      hi: "खरपतवार नियंत्रण",
      mr: "तण नियंत्रण",
    },
    {
      key: "fertilizer",
      icon: "🧪",
      days: 48,
      en: "Split fertilizer application",
      hi: "खाद की दूसरी मात्रा",
      mr: "खताचा दुसरा हप्ता",
    },
    {
      key: "harvest",
      icon: "🌾",
      days: 125,
      en: "Harvest check",
      hi: "कटाई की जांच",
      mr: "कापणी तपासणी",
    },
  ],
  cotton: [
    {
      key: "land",
      icon: "🌱",
      days: 0,
      en: "Deep ploughing and land preparation",
      hi: "गहरी जुताई और भूमि तैयारी",
      mr: "खोल नांगरणी व जमीन तयारी",
    },
    { key: "sowing", icon: "🌾", days: 10, en: "Sowing", hi: "बुवाई", mr: "पेरणी" },
    {
      key: "weed",
      icon: "🌿",
      days: 28,
      en: "Early weed management",
      hi: "प्रारंभिक खरपतवार नियंत्रण",
      mr: "प्रारंभिक तण नियंत्रण",
    },
    {
      key: "pest",
      icon: "🛡️",
      days: 48,
      en: "Monitor for pests",
      hi: "कीट निगरानी",
      mr: "किडींचे निरीक्षण",
    },
    {
      key: "fertilizer",
      icon: "🧪",
      days: 65,
      en: "Split fertilizer application",
      hi: "खाद की मात्रा दें",
      mr: "खताचा हप्ता द्या",
    },
    {
      key: "harvest",
      icon: "🌾",
      days: 165,
      en: "Pick mature bolls",
      hi: "पकी हुई कपास चुनें",
      mr: "पिकलेली कापूस वेचा",
    },
  ],
  maize: [
    {
      key: "land",
      icon: "🌱",
      days: 0,
      en: "Land preparation",
      hi: "भूमि की तैयारी",
      mr: "जमीन तयार करणे",
    },
    { key: "sowing", icon: "🌾", days: 8, en: "Sowing", hi: "बुवाई", mr: "पेरणी" },
    {
      key: "irrigation",
      icon: "💧",
      days: 25,
      en: "First irrigation",
      hi: "पहली सिंचाई",
      mr: "पहिले पाणी",
    },
    {
      key: "fertilizer",
      icon: "🧪",
      days: 32,
      en: "Top-dress fertilizer",
      hi: "ऊपरी खाद डालें",
      mr: "वरखत देणे",
    },
    {
      key: "pest",
      icon: "🛡️",
      days: 48,
      en: "Scout for pests",
      hi: "कीटों की जांच",
      mr: "किडींची पाहणी",
    },
    {
      key: "harvest",
      icon: "🌾",
      days: 95,
      en: "Harvest check",
      hi: "कटाई की जांच",
      mr: "कापणी तपासणी",
    },
  ],
};

const copy = {
  en: {
    title: "Smart tools for your farm",
    subtitle:
      "Simple tools for planning, protecting crops, finding schemes and preparing for weather.",
    calendar: "Smart Crop Calendar",
    calendarDesc: "Plan crop activities from your sowing date.",
    crop: "Crop",
    sowingDate: "Sowing date",
    generate: "Generate calendar",
    saved: "Calendar saved on this device",
    save: "Save calendar",
    completed: "Completed",
    upcoming: "Upcoming",
    scheme: "Government Scheme Finder",
    schemeDesc: "Find schemes that may match your farm details.",
    state: "State",
    district: "District",
    category: "Farmer category",
    land: "Land",
    owned: "Own land",
    leased: "Leased land",
    find: "Find schemes",
    possible: "Potentially relevant",
    official: "Official website",
    disease: "AI Crop Health Assistant",
    diseaseDesc: "Upload a clear crop photo for preliminary guidance.",
    upload: "Upload crop photo",
    chooseCrop: "Crop (optional)",
    analyze: "Analyze photo",
    analyzing: "Checking image…",
    noVision:
      "Image analysis is not configured yet. Add GROQ_VISION_MODEL to the backend and use an image-capable model.",
    preview: "Photo preview",
    warning:
      "This is preliminary guidance, not a diagnosis. Consult an agriculture expert for serious crop problems.",
    invalidImage: "Use a JPG, PNG or WebP image smaller than 5 MB.",
    tools: "FARM TOOLS",
    calendarCard: "Plan every stage of your farming journey, from sowing to harvesting.",
    diseaseCard: "Upload a crop photo and get AI-powered preliminary health guidance.",
    schemeCard: "Discover government schemes and benefits relevant to your farm.",
    weatherCard: "Understand weather conditions and plan your farming activities.",
    openTool: "Open tool",
    dropPhoto: "Drop a photo here or browse",
    weather: "Smart Weather Alerts",
    weatherDesc: "Use the live forecast to plan field work safely.",
  },
  hi: {
    title: "आपके खेत के लिए स्मार्ट साधन",
    subtitle: "योजना, फसल सुरक्षा, योजनाओं और मौसम की तैयारी के लिए सरल साधन।",
    calendar: "स्मार्ट फसल कैलेंडर",
    calendarDesc: "बुवाई की तारीख से फसल के काम की योजना बनाएं।",
    crop: "फसल",
    sowingDate: "बुवाई की तारीख",
    generate: "कैलेंडर बनाएं",
    saved: "कैलेंडर इस डिवाइस पर सेव है",
    save: "कैलेंडर सेव करें",
    completed: "पूरा हुआ",
    upcoming: "आने वाला काम",
    scheme: "सरकारी योजना खोजक",
    schemeDesc: "अपने खेत के अनुसार संभावित योजनाएं खोजें।",
    state: "राज्य",
    district: "जिला",
    category: "किसान श्रेणी",
    land: "भूमि",
    owned: "अपनी भूमि",
    leased: "पट्टे की भूमि",
    find: "योजनाएं खोजें",
    possible: "संभावित रूप से उपयोगी",
    official: "आधिकारिक वेबसाइट",
    disease: "एआई फसल स्वास्थ्य सहायक",
    diseaseDesc: "प्रारंभिक मार्गदर्शन के लिए साफ फसल फोटो अपलोड करें।",
    upload: "फसल फोटो अपलोड करें",
    chooseCrop: "फसल (वैकल्पिक)",
    analyze: "फोटो जांचें",
    analyzing: "फोटो की जांच हो रही है…",
    noVision: "फोटो जांच अभी कॉन्फ़िगर नहीं है। बैकएंड में GROQ_VISION_MODEL जोड़ें।",
    preview: "फोटो का पूर्वावलोकन",
    warning: "यह प्रारंभिक मार्गदर्शन है, निदान नहीं। गंभीर समस्या में कृषि विशेषज्ञ से सलाह लें।",
    invalidImage: "5 MB से छोटी JPG, PNG या WebP फोटो चुनें।",
    tools: "स्मार्ट साधन",
    calendarCard: "बुवाई से कटाई तक अपनी खेती के हर चरण की योजना बनाएं।",
    diseaseCard: "फसल की फोटो अपलोड करें और एआई से प्रारंभिक स्वास्थ्य मार्गदर्शन पाएं।",
    schemeCard: "अपने खेत के लिए उपयोगी सरकारी योजनाएं और लाभ खोजें।",
    weatherCard: "मौसम समझें और खेती के काम की योजना बनाएं।",
    openTool: "साधन खोलें",
    dropPhoto: "फोटो यहां छोड़ें या चुनें",
    weather: "स्मार्ट मौसम चेतावनी",
    weatherDesc: "खेत का काम सुरक्षित रूप से तय करने के लिए लाइव पूर्वानुमान देखें।",
  },
  mr: {
    title: "तुमच्या शेतीसाठी स्मार्ट साधने",
    subtitle: "नियोजन, पीक संरक्षण, योजना आणि हवामानासाठी सोपी साधने.",
    calendar: "स्मार्ट पीक दिनदर्शिका",
    calendarDesc: "पेरणीच्या तारखेपासून शेतीच्या कामांचे नियोजन करा.",
    crop: "पीक",
    sowingDate: "पेरणीची तारीख",
    generate: "दिनदर्शिका तयार करा",
    saved: "दिनदर्शिका या उपकरणावर जतन केली आहे",
    save: "दिनदर्शिका जतन करा",
    completed: "पूर्ण",
    upcoming: "पुढील काम",
    scheme: "सरकारी योजना शोधक",
    schemeDesc: "तुमच्या शेतीसाठी उपयुक्त योजना शोधा.",
    state: "राज्य",
    district: "जिल्हा",
    category: "शेतकरी वर्ग",
    land: "जमीन",
    owned: "स्वतःची जमीन",
    leased: "भाडेतत्त्वाची जमीन",
    find: "योजना शोधा",
    possible: "संभाव्यतः उपयुक्त",
    official: "अधिकृत संकेतस्थळ",
    disease: "एआय पीक आरोग्य सहाय्यक",
    diseaseDesc: "प्राथमिक मार्गदर्शनासाठी स्वच्छ पिकाचा फोटो अपलोड करा.",
    upload: "पिकाचा फोटो अपलोड करा",
    chooseCrop: "पीक (ऐच्छिक)",
    analyze: "फोटो तपासा",
    analyzing: "फोटो तपासत आहे…",
    noVision: "फोटो तपासणी अजून कॉन्फिगर केलेली नाही. बॅकएंडमध्ये GROQ_VISION_MODEL जोडा.",
    preview: "फोटो पूर्वदृश्य",
    warning: "हे प्राथमिक मार्गदर्शन आहे, निदान नाही. गंभीर समस्येसाठी कृषी तज्ज्ञांचा सल्ला घ्या.",
    invalidImage: "5 MB पेक्षा कमी JPG, PNG किंवा WebP फोटो निवडा.",
    tools: "स्मार्ट साधने",
    calendarCard: "पेरणीपासून कापणीपर्यंत शेतीच्या प्रत्येक टप्प्याचे नियोजन करा.",
    diseaseCard: "पिकाचा फोटो अपलोड करा आणि एआयकडून प्राथमिक आरोग्य मार्गदर्शन घ्या.",
    schemeCard: "तुमच्या शेतीसाठी उपयुक्त सरकारी योजना आणि लाभ शोधा.",
    weatherCard: "हवामान समजून शेतीच्या कामाचे नियोजन करा.",
    openTool: "साधन उघडा",
    dropPhoto: "फोटो येथे सोडा किंवा निवडा",
    weather: "स्मार्ट हवामान सूचना",
    weatherDesc: "लाइव्ह अंदाज पाहून शेतातील काम सुरक्षितपणे ठरवा.",
  },
} satisfies Record<SiteLanguage, Record<string, string>>;

const schemes = [
  {
    name: "PM-KISAN",
    icon: "🌾",
    text: "Income support for eligible landholding farmer families. Confirm current rules and e-KYC requirements.",
    link: "https://pmkisan.gov.in/",
  },
  {
    name: "PM Fasal Bima Yojana",
    icon: "🛡️",
    text: "Crop insurance for notified risks, crops and seasons. Check enrollment dates locally.",
    link: "https://pmfby.gov.in/",
  },
  {
    name: "Kisan Credit Card",
    icon: "🏦",
    text: "Farm working-capital credit through banks. The bank decides eligibility and documents.",
    link: "https://www.pmkisan.gov.in/",
  },
  {
    name: "Soil Health Card",
    icon: "🌱",
    text: "Soil testing and nutrient recommendations through government soil health services.",
    link: "https://soilhealth.dac.gov.in/",
  },
];

const localizedSchemeText = {
  en: [
    "Income support for eligible landholding farmer families. Confirm current rules and e-KYC requirements.",
    "Crop insurance for notified risks, crops and seasons. Check enrollment dates locally.",
    "Farm working-capital credit through banks. The bank decides eligibility and documents.",
    "Soil testing and nutrient recommendations through government soil health services.",
  ],
  hi: [
    "पात्र भूमिधर किसान परिवारों के लिए आय सहायता। वर्तमान नियम और ई-केवाईसी की पुष्टि करें।",
    "अधिसूचित जोखिम, फसलों और मौसमों के लिए फसल बीमा। स्थानीय पंजीकरण तिथि जांचें।",
    "बैंकों के माध्यम से खेती के लिए कार्यशील पूंजी ऋण। पात्रता और दस्तावेज बैंक तय करता है।",
    "सरकारी मृदा स्वास्थ्य सेवाओं के माध्यम से मिट्टी जांच और पोषक तत्वों की सलाह।",
  ],
  mr: [
    "पात्र जमीनधारक शेतकरी कुटुंबांसाठी उत्पन्न सहाय्य. सध्याचे नियम आणि ई-केवायसी तपासा.",
    "अधिसूचित जोखीम, पिके आणि हंगामांसाठी पीक विमा. स्थानिक नोंदणीच्या तारखा तपासा.",
    "बँकांमार्फत शेतीसाठी कार्यकारी भांडवल कर्ज. पात्रता आणि कागदपत्रे बँक ठरवते.",
    "सरकारी मृदा आरोग्य सेवांद्वारे माती तपासणी आणि पोषक द्रव्यांचा सल्ला.",
  ],
} satisfies Record<SiteLanguage, string[]>;

function localLabel(activity: Activity, language: SiteLanguage) {
  return activity[language];
}

function renderGuidance(text: string) {
  return text.split(/\r?\n/).map((line, index) => {
    const clean = line
      .replace(/\*\*/g, "")
      .replace(/^[-*]\s*/, "")
      .trim();
    if (!clean) return <span className="guidance-spacer" key={index} />;
    const isHeading =
      /^(Possible problem|Visible symptoms|Possible causes|Immediate steps|When to contact|संभावित समस्या|दिखने वाले लक्षण|संभावित कारण|तुरंत कदम|विशेषज्ञ से संपर्क|संभाव्य समस्या|दिसणारी लक्षणे|संभाव्य कारणे|तातडीची पावले|तज्ज्ञांशी संपर्क)/i.test(
        clean,
      );
    return isHeading ? (
      <strong className="guidance-heading" key={index}>
        {clean}
      </strong>
    ) : (
      <span className="guidance-line" key={index}>
        {clean}
      </span>
    );
  });
}

export function CropCalendar({
  language,
  text,
}: {
  language: SiteLanguage;
  text: Record<string, string>;
}) {
  const [crop, setCrop] = useState<CropKey>("wheat");
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().slice(0, 10));
  const [completed, setCompleted] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);
  const [saved, setSaved] = useState(false);
  const activities = useMemo(() => cropActivities[crop], [crop]);
  const dates = activities.map((item) => {
    const date = new Date(`${sowingDate}T12:00:00`);
    date.setDate(date.getDate() + item.days);
    return date;
  });
  const doneCount = completed.length;

  return (
    <Card className="advanced-card">
      <CardHeader>
        <CardTitle>
          <CalendarDays aria-hidden="true" /> {text.calendar}
        </CardTitle>
        <p>{text.calendarDesc}</p>
      </CardHeader>
      <CardContent>
        <div className="advanced-form-grid">
          <label>
            {text.crop}
            <select
              value={crop}
              onChange={(e) => {
                setCrop(e.target.value as CropKey);
                setGenerated(false);
              }}
            >
              <option value="wheat">Wheat / गेहूं / गहू</option>
              <option value="rice">Rice / धान / भात</option>
              <option value="cotton">Cotton / कपास / कापूस</option>
              <option value="maize">Maize / मक्का / मका</option>
            </select>
          </label>
          <label>
            {text.sowingDate}
            <Input
              type="date"
              value={sowingDate}
              onChange={(e) => {
                setSowingDate(e.target.value);
                setGenerated(false);
              }}
            />
          </label>
          <Button type="button" onClick={() => setGenerated(true)}>
            <CalendarDays /> {text.generate}
          </Button>
        </div>
        {generated && (
          <div className="crop-timeline" aria-label={text.calendar}>
            <div className="timeline-progress">
              <span style={{ width: `${(doneCount / activities.length) * 100}%` }} />
            </div>
            {activities.map((item, index) => {
              const isDone = completed.includes(item.key);
              return (
                <button
                  type="button"
                  className={`timeline-item ${isDone ? "is-done" : ""}`}
                  key={item.key}
                  onClick={() =>
                    setCompleted((current) =>
                      isDone ? current.filter((key) => key !== item.key) : [...current, item.key],
                    )
                  }
                >
                  <span className="timeline-icon">{isDone ? <CheckCircle2 /> : item.icon}</span>
                  <span>
                    <strong>{localLabel(item, language)}</strong>
                    <small>
                      {dates[index].toLocaleDateString(
                        language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN",
                      )}{" "}
                      · {isDone ? text.completed : index === doneCount ? text.upcoming : ""}
                    </small>
                  </span>
                </button>
              );
            })}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                localStorage.setItem(
                  "kishan-saathi-crop-calendar",
                  JSON.stringify({ crop, sowingDate, completed }),
                );
                setSaved(true);
              }}
            >
              {saved ? text.saved : text.save}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SchemeFinder({
  language,
  text,
}: {
  language: SiteLanguage;
  text: Record<string, string>;
}) {
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    category: "small",
    land: "owned",
  });
  return (
    <Card className="advanced-card">
      <CardHeader>
        <CardTitle>
          <Landmark aria-hidden="true" /> {text.scheme}
        </CardTitle>
        <p>{text.schemeDesc}</p>
      </CardHeader>
      <CardContent>
        <div className="advanced-form-grid scheme-form">
          <label>
            {text.state}
            <Input
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              placeholder={text.state}
            />
          </label>
          <label>
            {text.district}
            <Input
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              placeholder={text.district}
            />
          </label>
          <label>
            {text.category}
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="small">
                {text.category} — {text.possible}
              </option>
              <option value="other">{text.category}</option>
            </select>
          </label>
          <label>
            {text.land}
            <select
              value={filters.land}
              onChange={(e) => setFilters({ ...filters, land: e.target.value })}
            >
              <option value="owned">{text.owned}</option>
              <option value="leased">{text.leased}</option>
            </select>
          </label>
          <Button type="button" onClick={() => setShow(true)}>
            <ChevronDown /> {text.find}
          </Button>
        </div>
        {show && (
          <div className="scheme-grid">
            {schemes.map((scheme, index) => (
              <article className="scheme-card" key={scheme.name}>
                <span className="feature-icon">{scheme.icon}</span>
                <h3>{scheme.name}</h3>
                <span className="scheme-badge">{text.possible}</span>
                <p>{localizedSchemeText[language][index]}</p>
                <a href={scheme.link} target="_blank" rel="noreferrer">
                  {text.official} <ExternalLink size={14} />
                </a>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DiseaseAssistant({
  language,
  text,
}: {
  language: SiteLanguage;
  text: Record<string, string>;
}) {
  const { getIdToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [crop, setCrop] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  function chooseFile(next: File | undefined) {
    if (!next) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(next.type) ||
      next.size > 5 * 1024 * 1024
    ) {
      setError(text.invalidImage);
      return;
    }
    setFile(next);
    setError("");
    setResult("");
    setPreview(URL.createObjectURL(next));
  }

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read image"));
        reader.readAsDataURL(file);
      });
      const token = await getIdToken();
      const response = await fetch(`${API_URL}/api/crop-health`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ imageData, crop, language }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || text.noVision);
      setResult(data.reply || text.noVision);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : text.noVision);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="advanced-card">
      <CardHeader>
        <CardTitle>
          <Leaf aria-hidden="true" /> {text.disease}
        </CardTitle>
        <p>{text.diseaseDesc}</p>
      </CardHeader>
      <CardContent>
        <label
          className={`upload-zone ${dragging ? "is-dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            chooseFile(event.dataTransfer.files[0]);
          }}
        >
          <div className="upload-orbit">
            <ScanSearch aria-hidden="true" />
          </div>
          <strong>{text.dropPhoto}</strong>
          <span>{text.upload}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => chooseFile(e.target.files?.[0])}
          />
        </label>
        {preview && (
          <div className={`disease-preview ${loading ? "is-scanning" : ""}`}>
            <img src={preview} alt={text.preview} />
            <label>
              {text.chooseCrop}
              <Input value={crop} onChange={(e) => setCrop(e.target.value)} />
            </label>
            <Button type="button" disabled={loading} onClick={() => void analyze()}>
              {loading ? <LoaderCircle className="animate-spin" /> : <Upload />}{" "}
              {loading ? text.analyzing : text.analyze}
            </Button>
          </div>
        )}
        {error && (
          <p className="advanced-error" role="alert">
            {error}
          </p>
        )}
        {result && (
          <div className="disease-result">
            <ShieldAlert aria-hidden="true" />
            <div className="guidance-content">{renderGuidance(result)}</div>
          </div>
        )}
        <p className="advanced-disclaimer">{text.warning}</p>
      </CardContent>
    </Card>
  );
}

export default function AdvancedFeatures({
  mode,
  overviewOnly = false,
}: {
  mode?: "calendar" | "schemes" | "disease";
  overviewOnly?: boolean;
} = {}) {
  const { language } = useLanguage();
  const text = copy[language];
  if (mode === "calendar") return <CropCalendar language={language} text={text} />;
  if (mode === "schemes") return <SchemeFinder language={language} text={text} />;
  if (mode === "disease") return <DiseaseAssistant language={language} text={text} />;
  const overview = [
    {
      icon: <Wheat />,
      title: text.calendar,
      description: text.calendarCard,
      href: "/crop-calendar",
      tone: "green",
    },
    {
      icon: <Leaf />,
      title: text.disease,
      description: text.diseaseCard,
      href: "/crop-health",
      tone: "lime",
    },
    {
      icon: <Landmark />,
      title: text.scheme,
      description: text.schemeCard,
      href: "/schemes",
      tone: "gold",
    },
    {
      icon: <CloudSun />,
      title: text.weather,
      description: text.weatherCard,
      href: "/weather",
      tone: "sky",
    },
  ];
  return (
    <section className="advanced-features section" id="advanced-features">
      <div className="section-heading">
        <span className="eyebrow">
          <Sprout aria-hidden="true" /> {text.tools}
        </span>
        <h2>{text.title}</h2>
        <p>{text.subtitle}</p>
      </div>
      <div className="advanced-overview-grid">
        {overview.map((item, index) => (
          <a className={`advanced-overview-card ${item.tone}`} href={item.href} key={item.title}>
            <span className="overview-number">0{index + 1}</span>
            <span className="overview-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span className="overview-action">
              {text.openTool} <span aria-hidden="true">→</span>
            </span>
          </a>
        ))}
      </div>
      {overviewOnly ? null : (
        <div className="advanced-feature-grid">
          <div id="crop-calendar">
            <CropCalendar language={language} text={text} />
          </div>
          <div id="scheme-finder">
            <SchemeFinder language={language} text={text} />
          </div>
          <div id="crop-health">
            <DiseaseAssistant language={language} text={text} />
          </div>
        </div>
      )}
    </section>
  );
}
