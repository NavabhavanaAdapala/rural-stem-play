import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="mt-20 bg-ink text-ink-foreground">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-display text-2xl font-extrabold">VidyaQuest</span>
          </div>
          <p className="mt-4 max-w-sm text-sm opacity-75">
            Gamified STEM learning for rural students in grades 6–12. Learn in your language, even without internet.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-bold">Learn</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/subjects" className="hover:underline">{t("subjects")}</Link></li>
            <li><Link to="/games" className="hover:underline">{t("games")}</Link></li>
            <li><Link to="/ai-tutor" className="hover:underline">{t("aiTutor")}</Link></li>
            <li><Link to="/leaderboard" className="hover:underline">{t("leaderboard")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-bold">VidyaQuest</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/about" className="hover:underline">{t("aboutUs")}</Link></li>
            <li><Link to="/contact" className="hover:underline">{t("contactUs")}</Link></li>
            <li><Link to="/help" className="hover:underline">{t("helpCenter")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10 py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()} VidyaQuest · Made for rural learners across India
      </div>
    </footer>
  );
};

export default Footer;
