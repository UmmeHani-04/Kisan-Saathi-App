import { createContext, useContext } from "react";

export type SiteLanguage = "en" | "hi" | "mr";

const STORAGE_KEY = "kishan-saathi-language";

export const siteLanguages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
] as const;

type TranslationKey =
  | "home"
  | "contact"
  | "about"
  | "services"
  | "features"
  | "assistant"
  | "emi"
  | "eligibility"
  | "weather"
  | "getStarted"
  | "exploreServices"
  | "askQuestion"
  | "weatherUpdates"
  | "cropGuidance"
  | "marketPrices"
  | "loanAssistance"
  | "notifications"
  | "easyAccess"
  | "loanGuidance"
  | "simpleSteps"
  | "farmFirst"
  | "searchWeather"
  | "language"
  | "loanChecker"
  | "planWeather"
  | "weatherDescription"
  | "localForecast"
  | "locationPlaceholder"
  | "enterLocation"
  | "forecastPrompt"
  | "rain"
  | "wind"
  | "weatherUnavailable"
  | "documents"
  | "landSize"
  | "ownershipStatus"
  | "cropType"
  | "existingLoans"
  | "checkEligibility"
  | "clear"
  | "heroEyebrow"
  | "heroTitle"
  | "heroDescription"
  | "heroNote"
  | "designedForFarmers"
  | "understandOptions"
  | "documentChecklists"
  | "helpWhenNeeded"
  | "aboutEyebrow"
  | "aboutTitle"
  | "aboutDescription"
  | "talkAssistant"
  | "madeForNeeds"
  | "featureDescription"
  | "howItWorks"
  | "stepsTitle"
  | "ourServices"
  | "servicesTitle"
  | "servicesDescription"
  | "planFarmLoan"
  | "emiTitle"
  | "emiDescription"
  | "loanAmount"
  | "calculateEmi"
  | "interestRate"
  | "repaymentPeriod"
  | "estimatedEmi"
  | "loanPrincipal"
  | "totalInterest"
  | "totalRepayment"
  | "askAboutLoan"
  | "emiDisclaimer"
  | "assistantEyebrow"
  | "assistantTitle"
  | "assistantDescription"
  | "verifyRules"
  | "assistantReady"
  | "namaste"
  | "assistantQuestion"
  | "answerIn"
  | "loanDocuments"
  | "loanEligibility"
  | "typeQuestion"
  | "sendQuestion"
  | "guidanceDisclaimer"
  | "ctaTitle"
  | "ctaDescription"
  | "askKishan"
  | "explore"
  | "quickLinks"
  | "important"
  | "footerDisclaimer"
  | "checkerDescription"
  | "unit"
  | "acres"
  | "hectares"
  | "landHelp"
  | "owner"
  | "tenant"
  | "selectCrop"
  | "yes"
  | "no"
  | "suggestionsPlaceholder"
  | "suggestionsDescription"
  | "schemesToExplore"
  | "suggestionsBasedOnDetails"
  | "disclaimer"
  | "generalGuidance"
  | "finalApproval"
  | "clearSky"
  | "mainlyClear"
  | "partlyCloudy"
  | "overcast"
  | "foggy"
  | "lightDrizzle"
  | "drizzle"
  | "heavyDrizzle"
  | "lightRain"
  | "rainCondition"
  | "rain"
  | "heavyRain"
  | "lightSnow"
  | "snow"
  | "heavySnow"
  | "rainShowers"
  | "heavyShowers"
  | "thunderstorm"
  | "thunderstormHail"
  | "variableConditions"
  | "rainTip"
  | "heatTip"
  | "windTip"
  | "routineTip"
  | "weatherCredit"
  | "mandi"
  | "mandiTitle"
  | "mandiDescription"
  | "mandiSearch"
  | "state"
  | "district"
  | "commodity"
  | "market"
  | "loadPrices"
  | "price"
  | "minimum"
  | "maximum"
  | "updated"
  | "loginToContinue"
  | "startVoice"
  | "stopVoice"
  | "voiceUnavailable"
  | "noPrices"
  | "humidity"
  | "sunrise"
  | "heavyRainAlert"
  | "heatAlert"
  | "windAlert"
  | "weatherGoodForWork"
  | "dashboard"
  | "aiAssistant"
  | "cropCalendar"
  | "cropDisease"
  | "governmentSchemes"
  | "weatherAlerts"
  | "mandiPrices"
  | "emiCalculator"
  | "myProfile"
  | "publicWebsite"
  | "logout"
  | "welcomeBack"
  | "yourFarmAtAGlance"
  | "dashboardHeroTitle"
  | "dashboardHeroDescription"
  | "checkWeather"
  | "weatherOverview"
  | "planAroundWeather"
  | "seeForecast"
  | "cropActivity"
  | "stayCropPlan"
  | "trackTask"
  | "marketWatch"
  | "checkMandiPrices"
  | "compareMarkets"
  | "quickAccess"
  | "farmSmarter"
  | "openTool"
  | "farmingTool"
  | "smartCropCalendarTitle"
  | "smartCropCalendarDescription"
  | "cropDiseaseTitle"
  | "cropDiseaseDescription"
  | "governmentSchemesTitle"
  | "governmentSchemesDescription"
  | "weatherAlertsTitle"
  | "weatherAlertsDescription"
  | "mandiPageTitle"
  | "mandiPageDescription"
  | "emiPageTitle"
  | "emiPageDescription"
  | "profileTitle"
  | "profileDescription"
  | "assistantPageTitle"
  | "assistantPageDescription";

const translations: Record<SiteLanguage, Record<TranslationKey, string>> = {
  en: {
    home: "Home",
    contact: "Contact",
    about: "About",
    services: "Services",
    features: "Features",
    assistant: "Loan Assistant",
    emi: "EMI Calculator",
    eligibility: "Eligibility Checker",
    weather: "Weather",
    getStarted: "Get Started",
    exploreServices: "Explore Services",
    askQuestion: "Ask Your Question",
    weatherUpdates: "Weather Updates",
    cropGuidance: "Crop Guidance",
    marketPrices: "Market Prices",
    loanAssistance: "Loan Assistance",
    notifications: "Notifications",
    easyAccess: "Easy Access",
    loanGuidance: "Loan Guidance",
    simpleSteps: "Simple Steps",
    farmFirst: "Farm First",
    searchWeather: "Search weather",
    language: "Language",
    loanChecker: "Loan Eligibility Checker",
    planWeather: "Plan around the weather",
    weatherDescription:
      "Search your village or town for a five-day forecast and practical field tips.",
    localForecast: "Local forecast",
    locationPlaceholder: "Search a village or town",
    enterLocation: "Enter a location to see the forecast.",
    forecastPrompt: "Enter a village, town, or district.",
    rain: "Rain",
    wind: "Wind",
    weatherUnavailable: "Weather is temporarily unavailable. Please try again.",
    documents: "Documents to prepare",
    landSize: "Land size",
    ownershipStatus: "Ownership status",
    cropType: "Crop type",
    existingLoans: "Do you have existing loans?",
    checkEligibility: "Check eligibility",
    clear: "Clear",
    heroEyebrow: "DIGITAL SUPPORT FOR PROSPEROUS FARMING",
    heroTitle: "Your Farming Partner.",
    heroDescription:
      "Get guidance on agricultural loans, government schemes, farming practices and more — all in one place.",
    heroNote: "Simple guidance. Smarter farming. Better opportunities.",
    designedForFarmers: "Designed for farmers",
    understandOptions: "Understand your options",
    documentChecklists: "Clear document checklists",
    helpWhenNeeded: "Help when you need it",
    aboutEyebrow: "ABOUT KISHAN SAATHI",
    aboutTitle: "We're here to support our farming community.",
    aboutDescription:
      "Finding the right agricultural loan or government scheme can feel confusing. Kishan Saathi makes information easier to understand.",
    talkAssistant: "Talk to the assistant",
    madeForNeeds: "MADE FOR YOUR NEEDS",
    featureDescription: "Useful information to help you make more informed decisions.",
    howItWorks: "HOW IT WORKS",
    stepsTitle: "Simple Steps to Get Started",
    ourServices: "OUR SERVICES",
    servicesTitle: "Support for Every Farming Journey",
    servicesDescription: "Explore the kind of guidance you need, all in one place.",
    planFarmLoan: "PLAN YOUR FARM LOAN",
    emiTitle: "Farm Loan EMI Calculator",
    emiDescription: "Estimate your monthly instalment before applying for a loan.",
    loanAmount: "Loan amount",
    calculateEmi: "Calculate EMI",
    interestRate: "Annual interest rate",
    repaymentPeriod: "Repayment period",
    estimatedEmi: "ESTIMATED MONTHLY EMI",
    loanPrincipal: "Loan principal",
    totalInterest: "Total interest",
    totalRepayment: "Total repayment",
    askAboutLoan: "Ask Assistant About This Loan",
    emiDisclaimer: "This is an estimate. Confirm final details with your bank.",
    assistantEyebrow: "YOUR DIGITAL FARMING COMPANION",
    assistantTitle: "Have a question? Let's find your next step.",
    assistantDescription:
      "Ask about agricultural loans, Kisan Credit Card, eligibility requirements or documents.",
    verifyRules:
      "Always verify eligibility and current requirements with the official scheme or bank.",
    assistantReady: "Here to help you get started",
    namaste: "Namaste!",
    assistantQuestion: "What would you like to know about farming loans or government schemes?",
    answerIn: "Answer in:",
    loanDocuments: "Loan documents",
    loanEligibility: "Loan eligibility",
    typeQuestion: "Type your farming question...",
    sendQuestion: "Send question",
    guidanceDisclaimer:
      "Guidance only, not financial advice or a loan approval. Always confirm current rules with your bank or the official scheme.",
    ctaTitle: "Ready to take the next step?",
    ctaDescription: "Start exploring agricultural loans and farming resources today.",
    askKishan: "Ask Kishan Saathi",
    explore: "Explore",
    quickLinks: "Quick Links",
    important: "Important",
    footerDisclaimer:
      "Information is educational and does not guarantee loan approval or scheme eligibility.",
    checkerDescription: "Share a few details to see agricultural schemes you may want to explore.",
    unit: "Unit",
    acres: "Acres",
    hectares: "Hectares",
    landPlaceholder: "e.g. 2.5",
    landHelp: "Enter the area of land you cultivate.",
    owner: "Owner",
    tenant: "Tenant / cultivator",
    selectCrop: "Select a crop",
    yes: "Yes",
    no: "No",
    suggestionsPlaceholder: "Your suggestions will appear here",
    suggestionsDescription: "Complete the form to get a starting point for your scheme research.",
    schemesToExplore: "Schemes to explore",
    suggestionsBasedOnDetails: "These suggestions are based on the details you entered.",
    disclaimer: "Disclaimer",
    generalGuidance: "This checker provides general guidance only.",
    finalApproval:
      "Eligibility, required documents, and final approval are decided by the relevant government department or lending institution.",
    clearSky: "Clear sky",
    mainlyClear: "Mainly clear",
    partlyCloudy: "Partly cloudy",
    overcast: "Overcast",
    foggy: "Foggy",
    lightDrizzle: "Light drizzle",
    drizzle: "Drizzle",
    heavyDrizzle: "Heavy drizzle",
    lightRain: "Light rain",
    rainCondition: "Rain",
    heavyRain: "Heavy rain",
    lightSnow: "Light snow",
    snow: "Snow",
    heavySnow: "Heavy snow",
    rainShowers: "Rain showers",
    heavyShowers: "Heavy showers",
    thunderstorm: "Thunderstorm",
    thunderstormHail: "Thunderstorm with hail",
    variableConditions: "Variable conditions",
    rainTip: "Rain is likely. Avoid pesticide spraying and postpone drying harvested grain.",
    heatTip: "Hot conditions expected. Plan irrigation for early morning or evening.",
    windTip: "Wind may be strong. Avoid spraying and secure lightweight crop supports.",
    routineTip:
      "Conditions look suitable for routine field work. Check your crop before irrigation.",
    weatherCredit: "Weather data by Open-Meteo. Forecasts are for general planning only.",
    mandi: "Mandi Prices",
    mandiTitle: "Check today's mandi prices",
    mandiDescription: "Search government market records by state, district, commodity, or market.",
    mandiSearch: "Search prices",
    state: "State",
    district: "District",
    commodity: "Commodity",
    market: "Market",
    loadPrices: "Load prices",
    price: "Price",
    minimum: "Minimum",
    maximum: "Maximum",
    updated: "Updated",
    loginToContinue: "Please log in to use this feature.",
    startVoice: "Start voice input",
    stopVoice: "Stop voice input",
    voiceUnavailable: "Voice input is not supported in this browser.",
    noPrices: "No mandi prices found for these filters.",
    humidity: "Humidity",
    sunrise: "Sunrise",
    heavyRainAlert: "Heavy rain may be likely. Avoid spraying and check drainage.",
    heatAlert: "High temperature expected. Plan irrigation for early morning or evening.",
    windAlert: "Strong wind is possible. Secure crop supports and avoid spraying.",
    weatherGoodForWork: "No major warning from the current forecast. Check your crop before work.",
    dashboard: "Dashboard",
    aiAssistant: "AI Assistant",
    cropCalendar: "Crop Calendar",
    cropDisease: "Crop Disease",
    governmentSchemes: "Government Schemes",
    weatherAlerts: "Weather Alerts",
    mandiPrices: "Mandi Prices",
    emiCalculator: "EMI Calculator",
    myProfile: "My Profile",
    publicWebsite: "Public website",
    logout: "Log out",
    welcomeBack: "Welcome back",
    yourFarmAtAGlance: "YOUR FARM, AT A GLANCE",
    dashboardHeroTitle: "Make every farming decision with confidence.",
    dashboardHeroDescription:
      "Access practical tools, timely insights and trusted guidance in one place.",
    checkWeather: "Check today's weather",
    weatherOverview: "Weather overview",
    planAroundWeather: "Plan around the weather",
    seeForecast: "See your local forecast and field alerts",
    cropActivity: "Crop activity",
    stayCropPlan: "Stay on top of your crop plan",
    trackTask: "Track the next task in your calendar",
    marketWatch: "Market watch",
    checkMandiPrices: "Check today's mandi prices",
    compareMarkets: "Compare markets before you sell",
    quickAccess: "QUICK ACCESS",
    farmSmarter: "Everything you need to farm smarter",
    openTool: "Open tool",
    farmingTool: "FARMING TOOL",
    smartCropCalendarTitle: "Smart Crop Calendar",
    smartCropCalendarDescription:
      "Plan every stage of your farming journey from sowing to harvest.",
    cropDiseaseTitle: "AI Crop Disease Detection",
    cropDiseaseDescription: "Upload a crop image for preliminary AI-powered health guidance.",
    governmentSchemesTitle: "Government Scheme Finder",
    governmentSchemesDescription:
      "Discover official schemes and benefits that may be relevant to your farm.",
    weatherAlertsTitle: "Smart Weather Alerts",
    weatherAlertsDescription:
      "Search your location for practical weather insights and farming alerts.",
    mandiPageTitle: "Mandi Prices",
    mandiPageDescription: "Compare current market prices and make informed selling decisions.",
    emiPageTitle: "EMI Calculator",
    emiPageDescription: "Estimate your monthly farm-loan repayment before you apply.",
    profileTitle: "My Profile",
    profileDescription: "Manage your account information and language preference.",
    assistantPageTitle: "AI Farming Assistant",
    assistantPageDescription:
      "Ask practical questions about crops, loans, schemes and farming decisions.",
  },
  hi: {
    home: "होम",
    contact: "संपर्क",
    about: "हमारे बारे में",
    services: "सेवाएं",
    features: "विशेषताएं",
    assistant: "ऋण सहायक",
    emi: "ईएमआई कैलकुलेटर",
    eligibility: "पात्रता जांच",
    weather: "मौसम",
    getStarted: "शुरू करें",
    exploreServices: "सेवाएं देखें",
    askQuestion: "अपना सवाल पूछें",
    weatherUpdates: "मौसम की जानकारी",
    cropGuidance: "फसल मार्गदर्शन",
    marketPrices: "मंडी भाव",
    loanAssistance: "ऋण सहायता",
    notifications: "सूचनाएं",
    easyAccess: "आसान पहुंच",
    loanGuidance: "ऋण मार्गदर्शन",
    simpleSteps: "सरल चरण",
    farmFirst: "किसान पहले",
    searchWeather: "मौसम खोजें",
    language: "भाषा",
    loanChecker: "ऋण पात्रता जांच",
    planWeather: "मौसम के अनुसार योजना बनाएं",
    weatherDescription:
      "पांच दिनों का पूर्वानुमान और खेती के उपयोगी सुझाव देखने के लिए अपना गांव या शहर खोजें।",
    localForecast: "स्थानीय मौसम पूर्वानुमान",
    locationPlaceholder: "गांव या शहर खोजें",
    enterLocation: "पूर्वानुमान देखने के लिए स्थान दर्ज करें।",
    forecastPrompt: "गांव, शहर या जिला दर्ज करें।",
    rain: "बारिश",
    wind: "हवा",
    weatherUnavailable: "मौसम की जानकारी अभी उपलब्ध नहीं है। कृपया फिर प्रयास करें।",
    documents: "तैयार रखने वाले दस्तावेज",
    landSize: "भूमि का आकार",
    ownershipStatus: "स्वामित्व स्थिति",
    cropType: "फसल का प्रकार",
    existingLoans: "क्या आपके पास पहले से ऋण है?",
    checkEligibility: "पात्रता जांचें",
    clear: "साफ़ करें",
    heroEyebrow: "समृद्ध खेती के लिए डिजिटल सहायता",
    heroTitle: "आपका खेती का साथी।",
    heroDescription: "कृषि ऋण, सरकारी योजनाओं और खेती की जानकारी के लिए सरल मार्गदर्शन पाएं।",
    heroNote: "सरल मार्गदर्शन। बेहतर खेती। बेहतर अवसर।",
    designedForFarmers: "किसानों के लिए बनाया गया",
    understandOptions: "अपने विकल्प समझें",
    documentChecklists: "दस्तावेजों की सूची",
    helpWhenNeeded: "जरूरत के समय सहायता",
    aboutEyebrow: "किशन साथी के बारे में",
    aboutTitle: "हम अपने किसान समुदाय की सहायता के लिए यहां हैं।",
    aboutDescription:
      "सही कृषि ऋण या सरकारी योजना ढूंढना कठिन लग सकता है। किशन साथी जानकारी को सरल बनाता है।",
    talkAssistant: "सहायक से बात करें",
    madeForNeeds: "आपकी जरूरतों के लिए",
    featureDescription: "बेहतर निर्णय लेने में आपकी मदद करने वाली उपयोगी जानकारी।",
    howItWorks: "यह कैसे काम करता है",
    stepsTitle: "शुरू करने के सरल चरण",
    ourServices: "हमारी सेवाएं",
    servicesTitle: "हर खेती यात्रा के लिए सहायता",
    servicesDescription: "आपको जिस मार्गदर्शन की जरूरत है, वह एक ही जगह पाएं।",
    planFarmLoan: "अपने कृषि ऋण की योजना बनाएं",
    emiTitle: "कृषि ऋण ईएमआई कैलकुलेटर",
    emiDescription: "ऋण लेने से पहले अपनी मासिक किस्त का अनुमान लगाएं।",
    loanAmount: "ऋण राशि",
    calculateEmi: "EMI की गणना करें",
    interestRate: "वार्षिक ब्याज दर",
    repaymentPeriod: "चुकौती अवधि",
    estimatedEmi: "अनुमानित मासिक ईएमआई",
    loanPrincipal: "मूल ऋण राशि",
    totalInterest: "कुल ब्याज",
    totalRepayment: "कुल चुकौती",
    askAboutLoan: "इस ऋण के बारे में पूछें",
    emiDisclaimer: "यह केवल अनुमान है। अंतिम जानकारी बैंक से पक्की करें।",
    assistantEyebrow: "आपका डिजिटल खेती साथी",
    assistantTitle: "कोई सवाल है? अगला कदम जानें।",
    assistantDescription:
      "कृषि ऋण, किसान क्रेडिट कार्ड, पात्रता या जरूरी दस्तावेजों के बारे में पूछें।",
    verifyRules: "पात्रता और वर्तमान नियमों की पुष्टि आधिकारिक योजना या बैंक से करें।",
    assistantReady: "शुरू करने में आपकी मदद के लिए तैयार",
    namaste: "नमस्ते!",
    assistantQuestion: "आप कृषि ऋण या सरकारी योजनाओं के बारे में क्या जानना चाहते हैं?",
    answerIn: "उत्तर की भाषा:",
    loanDocuments: "ऋण दस्तावेज",
    loanEligibility: "ऋण पात्रता",
    typeQuestion: "अपना खेती से जुड़ा सवाल लिखें...",
    sendQuestion: "सवाल भेजें",
    guidanceDisclaimer:
      "यह केवल सामान्य मार्गदर्शन है, वित्तीय सलाह या ऋण स्वीकृति नहीं। वर्तमान नियम बैंक से पक्के करें।",
    ctaTitle: "अगला कदम उठाने के लिए तैयार हैं?",
    ctaDescription: "आज ही कृषि ऋण और खेती के संसाधनों को देखना शुरू करें।",
    askKishan: "किशन साथी से पूछें",
    explore: "देखें",
    quickLinks: "त्वरित लिंक",
    important: "महत्वपूर्ण",
    footerDisclaimer: "यह जानकारी शैक्षिक है और ऋण स्वीकृति या योजना पात्रता की गारंटी नहीं देती।",
    checkerDescription:
      "कुछ जानकारी साझा करें और उन कृषि योजनाओं को देखें जिन पर आप विचार कर सकते हैं।",
    unit: "इकाई",
    acres: "एकड़",
    hectares: "हेक्टेयर",
    landPlaceholder: "उदा. 2.5",
    landHelp: "आप जिस भूमि पर खेती करते हैं उसका क्षेत्रफल दर्ज करें।",
    owner: "मालिक",
    tenant: "किरायेदार / cultivator",
    selectCrop: "फसल चुनें",
    yes: "हां",
    no: "नहीं",
    suggestionsPlaceholder: "आपके सुझाव यहां दिखाई देंगे",
    suggestionsDescription: "योजना की जानकारी शुरू करने के लिए फॉर्म पूरा करें।",
    schemesToExplore: "देखने योग्य योजनाएं",
    suggestionsBasedOnDetails: "ये सुझाव आपके द्वारा दर्ज की गई जानकारी पर आधारित हैं।",
    disclaimer: "अस्वीकरण",
    generalGuidance: "यह जांच केवल सामान्य मार्गदर्शन देती है।",
    finalApproval:
      "पात्रता, आवश्यक दस्तावेज और अंतिम स्वीकृति संबंधित सरकारी विभाग या ऋण संस्था तय करती है।",
    clearSky: "साफ़ आसमान",
    mainlyClear: "मुख्य रूप से साफ़",
    partlyCloudy: "आंशिक बादल",
    overcast: "बादल छाए हुए",
    foggy: "कोहरा",
    lightDrizzle: "हल्की बूंदाबांदी",
    drizzle: "बूंदाबांदी",
    heavyDrizzle: "तेज़ बूंदाबांदी",
    lightRain: "हल्की बारिश",
    rainCondition: "बारिश",
    heavyRain: "तेज़ बारिश",
    lightSnow: "हल्की बर्फबारी",
    snow: "बर्फबारी",
    heavySnow: "तेज़ बर्फबारी",
    rainShowers: "बारिश की बौछारें",
    heavyShowers: "तेज़ बौछारें",
    thunderstorm: "गरज के साथ बारिश",
    thunderstormHail: "ओलों के साथ गरज",
    variableConditions: "बदलता मौसम",
    rainTip: "बारिश की संभावना है। कीटनाशक का छिड़काव और कटी फसल सुखाना टालें।",
    heatTip: "गर्मी की संभावना है। सुबह जल्दी या शाम को सिंचाई करें।",
    windTip: "हवा तेज़ हो सकती है। छिड़काव न करें और फसल के सहारे सुरक्षित करें।",
    routineTip: "मौसम सामान्य खेत के काम के लिए ठीक है। सिंचाई से पहले फसल जांचें।",
    weatherCredit: "मौसम की जानकारी Open-Meteo से। पूर्वानुमान केवल सामान्य योजना के लिए है।",
    mandi: "मंडी भाव",
    mandiTitle: "आज के मंडी भाव देखें",
    mandiDescription: "राज्य, जिले, फसल या मंडी के अनुसार सरकारी बाजार रिकॉर्ड खोजें।",
    mandiSearch: "भाव खोजें",
    state: "राज्य",
    district: "जिला",
    commodity: "फसल",
    market: "मंडी",
    loadPrices: "भाव लोड करें",
    price: "भाव",
    minimum: "न्यूनतम",
    maximum: "अधिकतम",
    updated: "अपडेट",
    loginToContinue: "इस सुविधा का उपयोग करने के लिए लॉग इन करें।",
    startVoice: "आवाज़ इनपुट शुरू करें",
    stopVoice: "आवाज़ इनपुट रोकें",
    voiceUnavailable: "इस ब्राउज़र में आवाज़ इनपुट उपलब्ध नहीं है।",
    noPrices: "इन फिल्टर के लिए मंडी भाव नहीं मिले।",
    humidity: "नमी",
    sunrise: "सूर्योदय",
    heavyRainAlert: "भारी बारिश की संभावना हो सकती है। छिड़काव रोकें और जल निकासी देखें।",
    heatAlert: "तापमान अधिक रहने की संभावना है। सुबह या शाम सिंचाई करें।",
    windAlert: "तेज हवा संभव है। फसल के सहारे मजबूत करें और छिड़काव न करें।",
    weatherGoodForWork: "वर्तमान पूर्वानुमान में बड़ी चेतावनी नहीं है। काम से पहले फसल देखें।",
    dashboard: "डैशबोर्ड",
    aiAssistant: "एआई सहायक",
    cropCalendar: "फसल कैलेंडर",
    cropDisease: "फसल रोग",
    governmentSchemes: "सरकारी योजनाएं",
    weatherAlerts: "मौसम चेतावनी",
    mandiPrices: "मंडी भाव",
    emiCalculator: "ईएमआई कैलकुलेटर",
    myProfile: "मेरी प्रोफ़ाइल",
    publicWebsite: "सार्वजनिक वेबसाइट",
    logout: "लॉग आउट",
    welcomeBack: "वापसी पर स्वागत है",
    yourFarmAtAGlance: "आपके खेत की एक झलक",
    dashboardHeroTitle: "हर खेती का निर्णय आत्मविश्वास से लें।",
    dashboardHeroDescription: "उपयोगी टूल, समय पर जानकारी और भरोसेमंद मार्गदर्शन एक जगह पाएं।",
    checkWeather: "आज का मौसम देखें",
    weatherOverview: "मौसम सारांश",
    planAroundWeather: "मौसम के अनुसार योजना बनाएं",
    seeForecast: "स्थानीय पूर्वानुमान और खेत की चेतावनी देखें",
    cropActivity: "फसल गतिविधि",
    stayCropPlan: "फसल योजना पर नज़र रखें",
    trackTask: "कैलेंडर का अगला काम देखें",
    marketWatch: "बाजार जानकारी",
    checkMandiPrices: "आज के मंडी भाव देखें",
    compareMarkets: "बेचने से पहले बाजारों की तुलना करें",
    quickAccess: "त्वरित पहुंच",
    farmSmarter: "स्मार्ट खेती के लिए सभी जरूरी सुविधाएं",
    openTool: "टूल खोलें",
    farmingTool: "कृषि टूल",
    smartCropCalendarTitle: "स्मार्ट फसल कैलेंडर",
    smartCropCalendarDescription: "बुवाई से कटाई तक खेती के हर चरण की योजना बनाएं।",
    cropDiseaseTitle: "एआई फसल रोग पहचान",
    cropDiseaseDescription: "प्रारंभिक एआई स्वास्थ्य मार्गदर्शन के लिए फसल की तस्वीर अपलोड करें।",
    governmentSchemesTitle: "सरकारी योजना खोजक",
    governmentSchemesDescription: "अपने खेत से जुड़ी सरकारी योजनाएं और लाभ खोजें।",
    weatherAlertsTitle: "स्मार्ट मौसम चेतावनी",
    weatherAlertsDescription: "व्यावहारिक मौसम जानकारी और खेत की चेतावनी के लिए स्थान खोजें।",
    mandiPageTitle: "मंडी भाव",
    mandiPageDescription: "आज के बाजार भावों की तुलना करके बेहतर बिक्री निर्णय लें।",
    emiPageTitle: "ईएमआई कैलकुलेटर",
    emiPageDescription: "ऋण लेने से पहले अपनी मासिक कृषि ऋण किस्त का अनुमान लगाएं।",
    profileTitle: "मेरी प्रोफ़ाइल",
    profileDescription: "अपने खाते की जानकारी और भाषा प्राथमिकता प्रबंधित करें।",
    assistantPageTitle: "एआई खेती सहायक",
    assistantPageDescription: "फसल, ऋण, योजनाओं और खेती के फैसलों पर व्यावहारिक सवाल पूछें।",
  },
  mr: {
    home: "मुख्यपृष्ठ",
    contact: "संपर्क",
    about: "आमच्याबद्दल",
    services: "सेवा",
    features: "वैशिष्ट्ये",
    assistant: "कर्ज सहाय्यक",
    emi: "ईएमआय कॅल्क्युलेटर",
    eligibility: "पात्रता तपासा",
    weather: "हवामान",
    getStarted: "सुरुवात करा",
    exploreServices: "सेवा पहा",
    askQuestion: "तुमचा प्रश्न विचारा",
    weatherUpdates: "हवामान माहिती",
    cropGuidance: "पीक मार्गदर्शन",
    marketPrices: "बाजार भाव",
    loanAssistance: "कर्ज सहाय्य",
    notifications: "सूचना",
    easyAccess: "सोपे वापर",
    loanGuidance: "कर्ज मार्गदर्शन",
    simpleSteps: "सोपे टप्पे",
    farmFirst: "शेतकरी प्रथम",
    searchWeather: "हवामान शोधा",
    language: "भाषा",
    loanChecker: "कर्ज पात्रता तपासणी",
    planWeather: "हवामानानुसार नियोजन करा",
    weatherDescription:
      "पाच दिवसांचा अंदाज आणि शेतीसाठी उपयुक्त सूचना पाहण्यासाठी गाव किंवा शहर शोधा.",
    localForecast: "स्थानिक हवामान अंदाज",
    locationPlaceholder: "गाव किंवा शहर शोधा",
    enterLocation: "अंदाज पाहण्यासाठी ठिकाण प्रविष्ट करा.",
    forecastPrompt: "गाव, शहर किंवा जिल्हा प्रविष्ट करा.",
    rain: "पाऊस",
    wind: "वारा",
    weatherUnavailable: "हवामानाची माहिती सध्या उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा.",
    documents: "तयार ठेवायची कागदपत्रे",
    landSize: "जमिनीचा आकार",
    ownershipStatus: "मालकीची स्थिती",
    cropType: "पिकाचा प्रकार",
    existingLoans: "तुमच्याकडे आधीपासून कर्ज आहे का?",
    checkEligibility: "पात्रता तपासा",
    clear: "पुसून टाका",
    heroEyebrow: "समृद्ध शेतीसाठी डिजिटल सहाय्य",
    heroTitle: "तुमचा शेती साथीदार.",
    heroDescription: "कृषी कर्ज, सरकारी योजना आणि शेतीविषयक माहितीसाठी सोपे मार्गदर्शन मिळवा.",
    heroNote: "सोपे मार्गदर्शन. स्मार्ट शेती. चांगल्या संधी.",
    designedForFarmers: "शेतकऱ्यांसाठी तयार",
    understandOptions: "तुमचे पर्याय समजून घ्या",
    documentChecklists: "कागदपत्रांची यादी",
    helpWhenNeeded: "गरजेच्या वेळी मदत",
    aboutEyebrow: "किशन साथीबद्दल",
    aboutTitle: "आमच्या शेतकरी समुदायाला मदत करण्यासाठी आम्ही येथे आहोत.",
    aboutDescription:
      "योग्य कृषी कर्ज किंवा सरकारी योजना शोधणे कठीण वाटू शकते. किशन साथी माहिती सोपी करतो.",
    talkAssistant: "सहाय्यकाशी बोला",
    madeForNeeds: "तुमच्या गरजांसाठी",
    featureDescription: "अधिक चांगले निर्णय घेण्यासाठी उपयुक्त माहिती.",
    howItWorks: "हे कसे काम करते",
    stepsTitle: "सुरुवात करण्याचे सोपे टप्पे",
    ourServices: "आमच्या सेवा",
    servicesTitle: "प्रत्येक शेती प्रवासासाठी सहाय्य",
    servicesDescription: "तुम्हाला आवश्यक मार्गदर्शन एकाच ठिकाणी मिळवा.",
    planFarmLoan: "तुमच्या कृषी कर्जाची योजना करा",
    emiTitle: "कृषी कर्ज ईएमआय कॅल्क्युलेटर",
    emiDescription: "कर्ज घेण्यापूर्वी मासिक हप्त्याचा अंदाज घ्या.",
    loanAmount: "कर्जाची रक्कम",
    calculateEmi: "EMI मोजा",
    interestRate: "वार्षिक व्याजदर",
    repaymentPeriod: "परतफेडीचा कालावधी",
    estimatedEmi: "अंदाजे मासिक ईएमआय",
    loanPrincipal: "मूळ कर्ज",
    totalInterest: "एकूण व्याज",
    totalRepayment: "एकूण परतफेड",
    askAboutLoan: "या कर्जाबद्दल विचारा",
    emiDisclaimer: "हा अंदाज आहे. अंतिम माहिती बँकेकडून निश्चित करा.",
    assistantEyebrow: "तुमचा डिजिटल शेती साथीदार",
    assistantTitle: "काही प्रश्न आहे? पुढील पाऊल शोधूया.",
    assistantDescription: "कृषी कर्ज, किसान क्रेडिट कार्ड, पात्रता किंवा कागदपत्रांबद्दल विचारा.",
    verifyRules: "पात्रता आणि सध्याच्या नियमांची अधिकृत योजना किंवा बँकेकडून खात्री करा.",
    assistantReady: "सुरुवात करण्यासाठी मदतीसाठी तयार",
    namaste: "नमस्कार!",
    assistantQuestion: "तुम्हाला कृषी कर्ज किंवा सरकारी योजनांबद्दल काय जाणून घ्यायचे आहे?",
    answerIn: "उत्तराची भाषा:",
    loanDocuments: "कर्जाची कागदपत्रे",
    loanEligibility: "कर्ज पात्रता",
    typeQuestion: "तुमचा शेतीविषयक प्रश्न लिहा...",
    sendQuestion: "प्रश्न पाठवा",
    guidanceDisclaimer:
      "हे फक्त सामान्य मार्गदर्शन आहे, आर्थिक सल्ला किंवा कर्ज मंजुरी नाही. सध्याचे नियम बँकेकडून तपासा.",
    ctaTitle: "पुढील पाऊल उचलण्यासाठी तयार आहात?",
    ctaDescription: "आजच कृषी कर्ज आणि शेतीची साधने पाहण्यास सुरुवात करा.",
    askKishan: "किशन साथीला विचारा",
    explore: "पहा",
    quickLinks: "जलद दुवे",
    important: "महत्त्वाचे",
    footerDisclaimer:
      "ही माहिती शैक्षणिक आहे आणि कर्ज मंजुरी किंवा योजनेच्या पात्रतेची हमी देत नाही.",
    checkerDescription: "काही माहिती देऊन तुम्ही विचार करू शकता अशा कृषी योजना पहा.",
    unit: "एकक",
    acres: "एकर",
    hectares: "हेक्टर",
    landPlaceholder: "उदा. 2.5",
    landHelp: "तुम्ही ज्या जमिनीवर शेती करता तिचे क्षेत्रफळ प्रविष्ट करा.",
    owner: "मालक",
    tenant: "भाडेकरू / लागवडदार",
    selectCrop: "पीक निवडा",
    yes: "होय",
    no: "नाही",
    suggestionsPlaceholder: "तुमच्या सूचना येथे दिसतील",
    suggestionsDescription: "योजना शोधण्यासाठी फॉर्म पूर्ण करा.",
    schemesToExplore: "पाहण्यासारख्या योजना",
    suggestionsBasedOnDetails: "या सूचना तुम्ही दिलेल्या माहितीवर आधारित आहेत.",
    disclaimer: "अस्वीकरण",
    generalGuidance: "ही तपासणी फक्त सामान्य मार्गदर्शन देते.",
    finalApproval:
      "पात्रता, आवश्यक कागदपत्रे आणि अंतिम मंजुरी संबंधित सरकारी विभाग किंवा कर्ज संस्था ठरवते.",
    clearSky: "निरभ्र आकाश",
    mainlyClear: "मुख्यतः निरभ्र",
    partlyCloudy: "अंशतः ढगाळ",
    overcast: "ढगाळ",
    foggy: "धुके",
    lightDrizzle: "हलकी रिमझिम",
    drizzle: "रिमझिम",
    heavyDrizzle: "जोरदार रिमझिम",
    lightRain: "हलका पाऊस",
    rainCondition: "पाऊस",
    heavyRain: "जोरदार पाऊस",
    lightSnow: "हलकी बर्फवृष्टी",
    snow: "बर्फवृष्टी",
    heavySnow: "जोरदार बर्फवृष्टी",
    rainShowers: "पावसाच्या सरी",
    heavyShowers: "जोरदार सरी",
    thunderstorm: "मेघगर्जनेसह पाऊस",
    thunderstormHail: "गारांसह मेघगर्जना",
    variableConditions: "बदलते हवामान",
    rainTip: "पावसाची शक्यता आहे. कीटकनाशक फवारणी आणि कापलेले धान्य वाळवणे पुढे ढकला.",
    heatTip: "उष्ण हवामान अपेक्षित आहे. सकाळी लवकर किंवा संध्याकाळी सिंचन करा.",
    windTip: "वारा जोरदार असू शकतो. फवारणी टाळा आणि पिकांचे आधार सुरक्षित करा.",
    routineTip: "नियमित शेतकामासाठी हवामान योग्य आहे. सिंचनापूर्वी पीक तपासा.",
    weatherCredit: "हवामान माहिती Open-Meteo कडून। अंदाज फक्त सामान्य नियोजनासाठी आहे.",
    mandi: "बाजार भाव",
    mandiTitle: "आजचे बाजार भाव पहा",
    mandiDescription: "राज्य, जिल्हा, पीक किंवा बाजारानुसार सरकारी बाजार नोंदी शोधा.",
    mandiSearch: "भाव शोधा",
    state: "राज्य",
    district: "जिल्हा",
    commodity: "पीक",
    market: "बाजार",
    loadPrices: "भाव लोड करा",
    price: "भाव",
    minimum: "किमान",
    maximum: "कमाल",
    updated: "अपडेट",
    loginToContinue: "हे वैशिष्ट्य वापरण्यासाठी लॉग इन करा.",
    startVoice: "आवाज इनपुट सुरू करा",
    stopVoice: "आवाज इनपुट थांबवा",
    voiceUnavailable: "या ब्राउझरमध्ये आवाज इनपुट उपलब्ध नाही.",
    noPrices: "या फिल्टरसाठी बाजार भाव सापडले नाहीत.",
    humidity: "आर्द्रता",
    sunrise: "सूर्योदय",
    heavyRainAlert: "मुसळधार पावसाची शक्यता आहे. फवारणी टाळा आणि निचरा तपासा.",
    heatAlert: "तापमान जास्त राहण्याची शक्यता आहे. सकाळी किंवा संध्याकाळी पाणी द्या.",
    windAlert: "जोरदार वारा शक्य आहे. पिकांचे आधार मजबूत करा आणि फवारणी टाळा.",
    weatherGoodForWork: "सध्याच्या अंदाजात मोठी सूचना नाही. कामापूर्वी पीक तपासा.",
    dashboard: "डॅशबोर्ड",
    aiAssistant: "एआय सहाय्यक",
    cropCalendar: "पीक कॅलेंडर",
    cropDisease: "पीक रोग",
    governmentSchemes: "सरकारी योजना",
    weatherAlerts: "हवामान सूचना",
    mandiPrices: "बाजार भाव",
    emiCalculator: "ईएमआय कॅल्क्युलेटर",
    myProfile: "माझी प्रोफाइल",
    publicWebsite: "सार्वजनिक वेबसाइट",
    logout: "लॉग आउट",
    welcomeBack: "पुन्हा स्वागत आहे",
    yourFarmAtAGlance: "तुमच्या शेताची झलक",
    dashboardHeroTitle: "प्रत्येक शेतीचा निर्णय आत्मविश्वासाने घ्या.",
    dashboardHeroDescription:
      "उपयुक्त साधने, वेळेवर माहिती आणि विश्वासार्ह मार्गदर्शन एका ठिकाणी मिळवा.",
    checkWeather: "आजचे हवामान पाहा",
    weatherOverview: "हवामानाचा आढावा",
    planAroundWeather: "हवामानानुसार नियोजन करा",
    seeForecast: "स्थानिक अंदाज आणि शेतातील सूचना पाहा",
    cropActivity: "पीक कामकाज",
    stayCropPlan: "पीक नियोजनावर लक्ष ठेवा",
    trackTask: "कॅलेंडरमधील पुढील काम पाहा",
    marketWatch: "बाजार माहिती",
    checkMandiPrices: "आजचे बाजार भाव पाहा",
    compareMarkets: "विक्रीपूर्वी बाजारांची तुलना करा",
    quickAccess: "जलद प्रवेश",
    farmSmarter: "स्मार्ट शेतीसाठी आवश्यक सर्व सुविधा",
    openTool: "साधन उघडा",
    farmingTool: "शेती साधन",
    smartCropCalendarTitle: "स्मार्ट पीक कॅलेंडर",
    smartCropCalendarDescription: "पेरणीपासून कापणीपर्यंत शेतीच्या प्रत्येक टप्प्याचे नियोजन करा.",
    cropDiseaseTitle: "एआय पीक रोग ओळख",
    cropDiseaseDescription: "प्राथमिक एआय आरोग्य मार्गदर्शनासाठी पिकाचा फोटो अपलोड करा.",
    governmentSchemesTitle: "सरकारी योजना शोधक",
    governmentSchemesDescription: "तुमच्या शेतासाठी उपयुक्त सरकारी योजना आणि लाभ शोधा.",
    weatherAlertsTitle: "स्मार्ट हवामान सूचना",
    weatherAlertsDescription: "उपयुक्त हवामान माहिती आणि शेतातील सूचनांसाठी ठिकाण शोधा.",
    mandiPageTitle: "बाजार भाव",
    mandiPageDescription: "आजच्या बाजार भावांची तुलना करून चांगला विक्री निर्णय घ्या.",
    emiPageTitle: "ईएमआय कॅल्क्युलेटर",
    emiPageDescription: "कर्ज घेण्यापूर्वी मासिक शेती कर्ज हप्त्याचा अंदाज घ्या.",
    profileTitle: "माझी प्रोफाइल",
    profileDescription: "तुमच्या खात्याची माहिती आणि भाषा पसंती व्यवस्थापित करा.",
    assistantPageTitle: "एआय शेती सहाय्यक",
    assistantPageDescription:
      "पीक, कर्ज, योजना आणि शेतीच्या निर्णयांबद्दल व्यावहारिक प्रश्न विचारा.",
  },
};

export function getStoredLanguage(): SiteLanguage {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "hi" || stored === "mr" ? stored : "en";
}

export function storeLanguage(language: SiteLanguage) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, language);
}

type LanguageContextValue = {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
  t: (key: TranslationKey) => string;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export function translate(language: SiteLanguage, key: TranslationKey) {
  return translations[language][key];
}
