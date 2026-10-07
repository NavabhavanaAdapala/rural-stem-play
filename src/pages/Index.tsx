import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WifiOff, Trophy, Languages, Bot, PlayCircle, ArrowRight, Star } from "lucide-react";
import Layout from "@/components/Layout";
import DemoModal from "@/components/DemoModal";
import { Button, Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Subject, subjectIcon, subjectTone } from "@/lib/subjects";

const Index = () => {
  const { t, pick } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [demo, setDemo] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    supabase.from("subjects").select("*").order("created_at").then(({ data }) => setSubjects((data as Subject[]) || []));
  }, []);

  const go = (path: string) => navigate(user ? path : "/signin", { state: { from: path } });

  const features = [
    { icon: WifiOff, title: t("offlineAccess"), desc: t("offlineDesc"), tone: "bg-accent text-accent-foreground" },
    { icon: Trophy, title: t("gamified"), desc: t("gamifiedDesc"), tone: "bg-secondary text-secondary-foreground" },
    { icon: Languages, title: t("multiLang"), desc: t("multiLangDesc"), tone: "bg-primary text-primary-foreground" },
    { icon: Bot, title: t("aiTutor"), desc: t("aiDesc"), tone: "bg-ink text-ink-foreground" },
  ];

  return (
    <Layout>
      <section className="relative overflow-hidden hero-gradient dotted-bg text-primary-foreground">
        <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full bg-card/20 px-4 py-1.5 text-sm font-bold">
              <Star className="h-4 w-4" /> Grades 6–12 · STEM · Free
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-tight md:text-7xl">{t("heroTitle")}</h1>
            <p className="mt-5 max-w-lg text-lg opacity-90">{t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" onClick={() => go("/subjects")} className="shadow-soft">
                {t("startLearning")} <ArrowRight />
              </Button>
              <Button size="lg" variant="light" onClick={() => setDemo(true)}>
                <PlayCircle /> {t("watchDemo")}
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              {[["⭐", "1,250 XP", "Level 6"], ["🔥", "12 days", "Streak"], ["🏆", "#3", "Leaderboard"], ["📜", "4", "Certificates"]].map(([e, v, l], n) => (
                <Card key={l} className="animate-float border-0 p-6 text-center text-card-foreground" style={{ animationDelay: `${n * 0.4}s` }}>
                  <div className="text-4xl">{e}</div>
                  <div className="mt-2 font-display text-2xl font-extrabold">{v}</div>
                  <div className="text-sm text-muted-foreground">{l}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="text-center text-4xl font-extrabold">{t("featuresTitle")}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="p-6 transition hover:-translate-y-1">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${f.tone}`}>
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl font-bold">{f.title}</h3>
              <p className="mt-1 text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-4xl font-extrabold">{t("subjectsTitle")}</h2>
          <Button variant="outline" onClick={() => go("/subjects")}>{t("subjects")} <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.slice(0, 8).map((s, n) => {
            const Icon = subjectIcon(s.icon);
            const tone = subjectTone(n);
            return (
              <button key={s.id} onClick={() => go(`/subjects/${s.id}/quizzes`)} className="text-left">
                <Card className="flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:border-primary">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone.bg} ${tone.text}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold">{pick(s.name, s.name_hi, s.name_te)}</div>
                    <div className="text-sm text-primary">{t("continueLearning")} →</div>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </section>

      <section className="container py-16">
        <div className="rounded-3xl sun-gradient p-10 text-center text-secondary-foreground md:p-14">
          <h2 className="text-3xl font-extrabold md:text-5xl">{t("ctaTitle")}</h2>
          <Button size="lg" className="mt-8" onClick={() => navigate(user ? "/subjects" : "/signup")}>
            {user ? t("startLearning") : t("joinNow")} <ArrowRight />
          </Button>
        </div>
      </section>

      <DemoModal open={demo} onClose={() => setDemo(false)} />
    </Layout>
  );
};

export default Index;
