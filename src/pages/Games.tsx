import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Zap, Clock } from "lucide-react";
import Layout, { PageHeader } from "@/components/Layout";
import { Badge, Button, Card, Spinner, cn } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Subject, subjectIcon } from "@/lib/subjects";
import { difficultyTone } from "./SubjectQuizzes";

type Row = { id: string; title: string; title_hi: string | null; title_te: string | null; description: string | null; difficulty: string | null; xp_reward: number | null; time_limit_seconds: number | null; subject_id: string | null };

const Games = () => {
  const { pick } = useLanguage();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Row[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subject, setSubject] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([supabase.from("quizzes").select("*").order("created_at"), supabase.from("subjects").select("*").order("created_at")]).then(([q, s]) => {
      setQuizzes((q.data as Row[]) || []);
      setSubjects((s.data as Subject[]) || []);
      setLoading(false);
    });
  }, []);

  const list = useMemo(
    () => quizzes.filter((q) => (subject === "all" || q.subject_id === subject) && (difficulty === "all" || (q.difficulty || "easy") === difficulty)),
    [quizzes, subject, difficulty]
  );
  const subjById = Object.fromEntries(subjects.map((s) => [s.id, s]));

  const chip = (active: boolean) => cn("rounded-full border-2 px-4 py-1.5 text-sm font-bold transition", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary");

  return (
    <Layout>
      <PageHeader title="Game Zone 🎮" subtitle="Play quiz challenges from every subject and earn XP." />
      <div className="container py-8">
        <div className="flex flex-wrap gap-2">
          <button className={chip(subject === "all")} onClick={() => setSubject("all")}>All subjects</button>
          {subjects.map((s) => (
            <button key={s.id} className={chip(subject === s.id)} onClick={() => setSubject(s.id)}>{pick(s.name, s.name_hi, s.name_te)}</button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["all", "easy", "medium", "hard"].map((d) => (
            <button key={d} className={chip(difficulty === d)} onClick={() => setDifficulty(d)}>{d === "all" ? "Any level" : d}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : list.length === 0 ? (
          <Card className="mt-8 p-10 text-center text-muted-foreground">No games match these filters.</Card>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((q) => {
              const s = q.subject_id ? subjById[q.subject_id] : undefined;
              const Icon = subjectIcon(s?.icon);
              return (
                <Card key={q.id} className="flex flex-col p-6 transition hover:-translate-y-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-primary">
                    <Icon className="h-4 w-4" /> {s ? pick(s.name, s.name_hi, s.name_te) : "General"}
                  </div>
                  <h3 className="mt-2 text-lg font-bold">{pick(q.title, q.title_hi, q.title_te)}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{q.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className={difficultyTone(q.difficulty)}>{q.difficulty || "easy"}</Badge>
                    <Badge><Zap className="h-3 w-3" /> {q.xp_reward || 50} XP</Badge>
                    {q.time_limit_seconds && <Badge><Clock className="h-3 w-3" /> {Math.round(q.time_limit_seconds / 60)} min</Badge>}
                  </div>
                  <Button className="mt-5" onClick={() => navigate(`/quiz/${q.id}`)}><Play className="h-4 w-4" /> Play now</Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Games;
