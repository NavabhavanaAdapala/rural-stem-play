import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, RotateCcw, WifiOff, XCircle, Trophy } from "lucide-react";
import Layout from "@/components/Layout";
import { Button, Card, Progress, Spinner, cn } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Q = { id: string; question: string; question_hi: string | null; question_te: string | null; options: string[] };
type Check = { is_correct: boolean; correct_answer: number; explanation?: string; explanation_hi?: string; explanation_te?: string };
type QuizInfo = { id: string; title: string; title_hi: string | null; title_te: string | null; xp_reward: number | null; subject_id: string | null };
type LoadError = { kind: "notfound" | "noquestions" | "network" | "unknown"; message: string };

const Quiz = () => {
  const { quizId } = useParams();
  const { pick } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizInfo | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<LoadError | null>(null);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [check, setCheck] = useState<Check | null>(null);
  const [checking, setChecking] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [start] = useState(Date.now());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!navigator.onLine) throw Object.assign(new Error("offline"), { offline: true });
      const { data: qz, error: e1 } = await supabase.from("quizzes").select("id,title,title_hi,title_te,xp_reward,subject_id").eq("id", quizId!).maybeSingle();
      if (e1) throw e1;
      if (!qz) return setError({ kind: "notfound", message: "This quiz doesn't exist or was removed." });
      setQuiz(qz as QuizInfo);
      const { data: qs, error: e2 } = await supabase.rpc("get_quiz_questions_for_student", { _quiz_id: quizId! });
      if (e2) throw e2;
      const list = (qs || [])
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
        .map((x) => ({ ...x, options: Array.isArray(x.options) ? (x.options as string[]) : [] }));
      if (!list.length) return setError({ kind: "noquestions", message: "This quiz has no questions yet." });
      setQuestions(list);
    } catch (e: any) {
      if (e?.offline || e?.message?.includes("Failed to fetch"))
        setError({ kind: "network", message: "You seem to be offline. Connect to the internet and try again." });
      else setError({ kind: "unknown", message: e?.message || "Something went wrong while loading the quiz." });
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    load();
  }, [load]);

  const current = questions[idx];

  const choose = async (i: number) => {
    if (check || checking || !current) return;
    setSelected(i);
    setChecking(true);
    const { data, error } = await supabase.rpc("check_quiz_answer", { _question_id: current.id, _selected_answer: i });
    setChecking(false);
    if (error || !data) {
      setSelected(null);
      return setError({ kind: "network", message: "Couldn't check your answer. Please check your connection." });
    }
    const r = data as unknown as Check;
    setCheck(r);
    if (r.is_correct) setScore((s) => s + 1);
  };

  const next = async () => {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setSelected(null);
      setCheck(null);
      return;
    }
    setFinished(true);
    if (!user || !quiz) return;
    const finalScore = score;
    const xp = Math.round(((quiz.xp_reward || 50) * finalScore) / questions.length);
    await supabase.from("quiz_attempts").insert({
      user_id: user.id,
      quiz_id: quiz.id,
      score: finalScore,
      total_questions: questions.length,
      xp_earned: xp,
      time_taken_seconds: Math.round((Date.now() - start) / 1000),
    });
    const { data: p } = await supabase.from("profiles").select("total_xp,streak_days,updated_at").eq("user_id", user.id).maybeSingle();
    const total = (p?.total_xp || 0) + xp;
    const lastDay = p?.updated_at ? new Date(p.updated_at).toDateString() : "";
    const yesterday = new Date(Date.now() - 864e5).toDateString();
    const today = new Date().toDateString();
    const streak = lastDay === today ? p?.streak_days || 1 : lastDay === yesterday ? (p?.streak_days || 0) + 1 : 1;
    await supabase.from("profiles").update({ total_xp: total, current_level: Math.floor(total / 500) + 1, streak_days: streak }).eq("user_id", user.id);
  };

  if (loading) return <Layout footer={false}><div className="flex justify-center py-32"><Spinner /></div></Layout>;

  if (error)
    return (
      <Layout footer={false}>
        <div className="container max-w-lg py-20">
          <Card className="p-8 text-center">
            {error.kind === "network" ? <WifiOff className="mx-auto h-12 w-12 text-secondary" /> : <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />}
            <h1 className="mt-4 text-2xl font-bold">
              {error.kind === "notfound" ? "Quiz not found" : error.kind === "noquestions" ? "No questions found" : error.kind === "network" ? "Connection problem" : "Couldn't load quiz"}
            </h1>
            <p className="mt-2 text-muted-foreground">{error.message}</p>
            <div className="mt-6 flex justify-center gap-3">
              {(error.kind === "network" || error.kind === "unknown") && <Button onClick={load}><RotateCcw className="h-4 w-4" /> Try again</Button>}
              <Button variant="outline" onClick={() => navigate(quiz?.subject_id ? `/subjects/${quiz.subject_id}/quizzes` : "/subjects")}>Back</Button>
            </div>
          </Card>
        </div>
      </Layout>
    );

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const xp = Math.round(((quiz?.xp_reward || 50) * score) / questions.length);
    return (
      <Layout footer={false}>
        <div className="container max-w-lg py-16">
          <Card className="animate-rise overflow-hidden text-center">
            <div className="hero-gradient p-8 text-primary-foreground">
              <Trophy className="mx-auto h-16 w-16 animate-float" />
              <h1 className="mt-3 text-4xl font-extrabold">{pct >= 80 ? "Superstar! 🌟" : pct >= 50 ? "Well done! 👏" : "Keep trying! 💪"}</h1>
            </div>
            <div className="p-8">
              <p className="font-display text-5xl font-extrabold">{score}/{questions.length}</p>
              <p className="mt-1 text-muted-foreground">{pct}% correct</p>
              <p className="mt-4 inline-block rounded-full bg-secondary/25 px-4 py-2 font-bold">+{xp} XP earned</p>
              <div className="mt-6 flex justify-center gap-3">
                <Button onClick={() => window.location.reload()}><RotateCcw className="h-4 w-4" /> Play again</Button>
                <Button variant="outline" onClick={() => navigate(quiz?.subject_id ? `/subjects/${quiz.subject_id}/quizzes` : "/games")}>More quizzes</Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!current) return null;

  return (
    <Layout footer={false}>
      <div className="container max-w-2xl py-10">
        <div className="mb-2 flex items-center justify-between text-sm font-bold">
          <span className="truncate">{quiz && pick(quiz.title, quiz.title_hi, quiz.title_te)}</span>
          <span className="text-muted-foreground">{idx + 1} / {questions.length}</span>
        </div>
        <Progress value={((idx + (check ? 1 : 0)) / questions.length) * 100} />
        <Card key={current.id} className="mt-6 animate-rise p-6 md:p-8">
          <h2 className="text-2xl font-bold">{pick(current.question, current.question_hi, current.question_te)}</h2>
          <div className="mt-6 grid gap-3">
            {current.options.map((o, i) => {
              const isCorrect = check && i === check.correct_answer;
              const isWrong = check && i === selected && !check.is_correct;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={!!check || checking}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border-2 p-4 text-left font-semibold transition",
                    !check && "hover:border-primary hover:bg-primary/5",
                    selected === i && !check && "border-primary",
                    isCorrect && "border-success bg-success/10",
                    isWrong && "border-destructive bg-destructive/10"
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted font-bold">{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1">{o}</span>
                  {isCorrect && <CheckCircle2 className="text-success" />}
                  {isWrong && <XCircle className="text-destructive" />}
                </button>
              );
            })}
          </div>
          {check && (
            <div className={cn("mt-6 rounded-xl p-4", check.is_correct ? "bg-success/10" : "bg-destructive/10")}>
              <p className="font-bold">{check.is_correct ? "Correct! 🎉" : "Not quite."}</p>
              {check.explanation && <p className="mt-1 text-muted-foreground">{pick(check.explanation, check.explanation_hi, check.explanation_te)}</p>}
            </div>
          )}
          {check && (
            <Button className="mt-6 w-full" size="lg" onClick={next}>
              {idx + 1 < questions.length ? "Next question" : "See results"}
            </Button>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Quiz;
