import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, Play, Zap } from "lucide-react";
import Layout, { PageHeader } from "@/components/Layout";
import { Badge, Button, Card, Spinner, cn } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lessonsFor } from "@/lib/lessons";
import type { Subject } from "@/lib/subjects";

type QuizRow = { id: string; title: string; title_hi: string | null; title_te: string | null; description: string | null; difficulty: string | null; xp_reward: number | null; time_limit_seconds: number | null };

export const difficultyTone = (d?: string | null) =>
  d === "hard" ? "bg-destructive/15 text-destructive" : d === "medium" ? "bg-secondary/25 text-secondary-foreground" : "bg-success/15 text-success";

const SubjectQuizzes = () => {
  const { subjectId } = useParams();
  const { pick } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);
  const [done, setDone] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"learn" | "quiz">("learn");
  const [read, setRead] = useState<Record<number, boolean>>(() => JSON.parse(localStorage.getItem(`vq-lessons-${subjectId}`) || "{}"));

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: q }] = await Promise.all([
        supabase.from("subjects").select("*").eq("id", subjectId!).maybeSingle(),
        supabase.from("quizzes").select("*").eq("subject_id", subjectId!).order("created_at"),
      ]);
      setSubject(s as Subject);
      setQuizzes((q as QuizRow[]) || []);
      if (user && q?.length) {
        const { data: a } = await supabase.from("quiz_attempts").select("quiz_id,score,total_questions").eq("user_id", user.id).in("quiz_id", q.map((x) => x.id));
        const best: Record<string, number> = {};
        (a || []).forEach((x) => {
          const pct = Math.round((x.score / Math.max(1, x.total_questions)) * 100);
          best[x.quiz_id] = Math.max(best[x.quiz_id] || 0, pct);
        });
        setDone(best);
      }
      setLoading(false);
    })();
  }, [subjectId, user]);

  const markRead = (i: number) => {
    const next = { ...read, [i]: true };
    setRead(next);
    localStorage.setItem(`vq-lessons-${subjectId}`, JSON.stringify(next));
  };

  if (loading) return <Layout><div className="flex justify-center py-32"><Spinner /></div></Layout>;
  if (!subject)
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="text-3xl font-bold">Subject not found</h1>
          <Button className="mt-6" onClick={() => navigate("/subjects")}>Back to subjects</Button>
        </div>
      </Layout>
    );

  const lessons = lessonsFor(subject.name);

  return (
    <Layout>
      <PageHeader title={pick(subject.name, subject.name_hi, subject.name_te)} subtitle={subject.description || undefined}>
        <Link to="/subjects" className="mt-4 inline-flex items-center gap-1 text-sm font-bold opacity-90 hover:underline">
          <ArrowLeft className="h-4 w-4" /> All subjects
        </Link>
      </PageHeader>
      <div className="container py-8">
        <div className="mb-6 inline-flex rounded-xl bg-muted p-1">
          {(["learn", "quiz"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={cn("rounded-lg px-5 py-2 font-bold", tab === k ? "bg-card shadow-soft" : "text-muted-foreground")}>
              {k === "learn" ? `📖 Sessions (${lessons.length})` : `🎯 Quizzes (${quizzes.length})`}
            </button>
          ))}
        </div>

        {tab === "learn" ? (
          <div className="grid gap-5 md:grid-cols-2">
            {lessons.map((l, i) => (
              <Card key={l.title} className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-primary">Session {i + 1}</p>
                    <h3 className="text-xl font-bold">{l.title}</h3>
                  </div>
                  <Badge><Clock className="h-3 w-3" /> {l.minutes} min</Badge>
                </div>
                <ul className="mt-4 space-y-2">
                  {l.points.map((p) => (
                    <li key={p} className="flex gap-2"><BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {p}</li>
                  ))}
                </ul>
                <Button variant={read[i] ? "outline" : "primary"} size="sm" className="mt-5" onClick={() => markRead(i)}>
                  {read[i] ? <><CheckCircle2 className="h-4 w-4" /> Completed</> : "Mark as done"}
                </Button>
              </Card>
            ))}
            <Card className="flex flex-col items-center justify-center p-6 text-center md:col-span-2">
              <p className="font-bold">Finished the sessions? Test what you learned!</p>
              <Button className="mt-3" onClick={() => setTab("quiz")}>Go to quizzes</Button>
            </Card>
          </div>
        ) : quizzes.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">No quizzes yet for this subject. Check back soon!</Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((q) => (
              <Card key={q.id} className="flex flex-col p-6">
                <div className="flex flex-wrap gap-2">
                  <Badge className={difficultyTone(q.difficulty)}>{q.difficulty || "easy"}</Badge>
                  <Badge><Zap className="h-3 w-3" /> {q.xp_reward || 50} XP</Badge>
                  {done[q.id] !== undefined && <Badge className="bg-primary/15 text-primary">Best {done[q.id]}%</Badge>}
                </div>
                <h3 className="mt-3 text-lg font-bold">{pick(q.title, q.title_hi, q.title_te)}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{q.description}</p>
                <Button className="mt-5" onClick={() => navigate(`/quiz/${q.id}`)}>
                  <Play className="h-4 w-4" /> {done[q.id] !== undefined ? "Play again" : "Play now"}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubjectQuizzes;
