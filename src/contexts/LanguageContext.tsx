import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi" | "te";

const T: Record<string, Record<Language, string>> = {
  home: { en: "Home", hi: "होम", te: "హోమ్" },
  subjects: { en: "Subjects", hi: "विषय", te: "విషయాలు" },
  games: { en: "Games", hi: "खेल", te: "ఆటలు" },
  leaderboard: { en: "Leaderboard", hi: "लीडरबोर्ड", te: "లీడర్‌బోర్డ్" },
  aiTutor: { en: "AI Tutor", hi: "AI ट्यूटर", te: "AI ట్యూటర్" },
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड", te: "డాష్‌బోర్డ్" },
  profile: { en: "Profile", hi: "प्रोफ़ाइल", te: "ప్రొఫైల్" },
  signIn: { en: "Sign In", hi: "साइन इन", te: "సైన్ ఇన్" },
  signUp: { en: "Sign Up", hi: "साइन अप", te: "సైన్ అప్" },
  signOut: { en: "Sign Out", hi: "साइन आउट", te: "సైన్ అవుట్" },
  heroTitle: { en: "Learn, Play & Grow!", hi: "सीखो, खेलो और बढ़ो!", te: "నేర్చుకో, ఆడు & ఎదుగు!" },
  heroSubtitle: {
    en: "Fun games, quizzes and rewards that make STEM learning exciting for rural students in grades 6–12.",
    hi: "मज़ेदार खेल, क्विज़ और इनाम जो कक्षा 6–12 के ग्रामीण छात्रों के लिए STEM सीखना रोमांचक बनाते हैं।",
    te: "6–12 తరగతుల గ్రామీణ విద్యార్థులకు STEM నేర్చుకోవడాన్ని ఉత్సాహంగా మార్చే సరదా ఆటలు, క్విజ్‌లు మరియు బహుమతులు.",
  },
  startLearning: { en: "Start Learning", hi: "सीखना शुरू करें", te: "నేర్చుకోవడం ప్రారంభించండి" },
  watchDemo: { en: "Watch Demo", hi: "डेमो देखें", te: "డెమో చూడండి" },
  featuresTitle: { en: "Why VidyaQuest?", hi: "विद्याक्वेस्ट क्यों?", te: "విద్యాక్వెస్ట్ ఎందుకు?" },
  offlineAccess: { en: "Works Offline", hi: "ऑफ़लाइन काम करता है", te: "ఆఫ్‌లైన్‌లో పనిచేస్తుంది" },
  offlineDesc: { en: "Keep learning even when the internet is weak or gone.", hi: "इंटरनेट कमज़ोर हो या न हो, सीखते रहें।", te: "ఇంటర్నెట్ బలహీనంగా ఉన్నా లేకపోయినా నేర్చుకుంటూ ఉండండి." },
  gamified: { en: "Games & Rewards", hi: "खेल और इनाम", te: "ఆటలు & బహుమతులు" },
  gamifiedDesc: { en: "Earn XP, unlock certificates and climb the leaderboard.", hi: "XP कमाएँ, प्रमाणपत्र पाएँ और लीडरबोर्ड पर चढ़ें।", te: "XP సంపాదించండి, సర్టిఫికేట్లు పొందండి, లీడర్‌బోర్డ్‌లో ఎదగండి." },
  multiLang: { en: "Your Language", hi: "आपकी भाषा", te: "మీ భాష" },
  multiLangDesc: { en: "Learn in English, Hindi or Telugu.", hi: "अंग्रेज़ी, हिंदी या तेलुगु में सीखें।", te: "ఇంగ్లీష్, హిందీ లేదా తెలుగులో నేర్చుకోండి." },
  aiDesc: { en: "Ask doubts anytime and get a personal study plan.", hi: "कभी भी सवाल पूछें और अपनी अध्ययन योजना पाएँ।", te: "ఎప్పుడైనా సందేహాలు అడగండి, మీ స్వంత అధ్యయన ప్రణాళిక పొందండి." },
  subjectsTitle: { en: "Explore Subjects", hi: "विषयों को खोजें", te: "విషయాలను అన్వేషించండి" },
  continueLearning: { en: "Continue Learning", hi: "सीखना जारी रखें", te: "నేర్చుకోవడం కొనసాగించండి" },
  ctaTitle: { en: "Ready to start your learning adventure?", hi: "अपनी सीखने की यात्रा शुरू करने के लिए तैयार?", te: "మీ అభ్యాస సాహసం ప్రారంభించడానికి సిద్ధమా?" },
  joinNow: { en: "Join Free", hi: "मुफ़्त जुड़ें", te: "ఉచితంగా చేరండి" },
  aboutUs: { en: "About Us", hi: "हमारे बारे में", te: "మా గురించి" },
  contactUs: { en: "Contact Us", hi: "संपर्क करें", te: "సంప్రదించండి" },
  helpCenter: { en: "Help Center", hi: "सहायता केंद्र", te: "సహాయ కేంద్రం" },
  email: { en: "Email", hi: "ईमेल", te: "ఇమెయిల్" },
  password: { en: "Password", hi: "पासवर्ड", te: "పాస్‌వర్డ్" },
  fullName: { en: "Full Name", hi: "पूरा नाम", te: "పూర్తి పేరు" },
  grade: { en: "Grade", hi: "कक्षा", te: "తరగతి" },
  welcomeBack: { en: "Welcome back!", hi: "फिर से स्वागत है!", te: "తిరిగి స్వాగతం!" },
  createAccount: { en: "Create your account", hi: "अपना खाता बनाएँ", te: "మీ ఖాతా సృష్టించండి" },
  askAnything: { en: "Ask me anything about your studies…", hi: "पढ़ाई के बारे में कुछ भी पूछें…", te: "మీ చదువు గురించి ఏదైనా అడగండి…" },
};

interface LangCtx {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (k: string) => string;
  pick: (en: string | null | undefined, hi?: string | null, te?: string | null) => string;
}

const Ctx = createContext<LangCtx | undefined>(undefined);
export const languageNames: Record<Language, string> = { en: "English", hi: "हिंदी", te: "తెలుగు" };

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLang] = useState<Language>(() => (localStorage.getItem("vq-lang") as Language) || "en");
  const setLanguage = (l: Language) => {
    setLang(l);
    localStorage.setItem("vq-lang", l);
  };
  const t = (k: string) => T[k]?.[language] ?? T[k]?.en ?? k;
  const pick = (en?: string | null, hi?: string | null, te?: string | null) =>
    (language === "hi" && hi) || (language === "te" && te) || en || "";
  return <Ctx.Provider value={{ language, setLanguage, t, pick }}>{children}</Ctx.Provider>;
};

export const useLanguage = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLanguage must be used within LanguageProvider");
  return c;
};
