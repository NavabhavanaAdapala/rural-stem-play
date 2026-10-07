import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type Attempt = { id: string; quiz_id: string; score: number; total_questions: number; xp_earned: number | null; completed_at: string; time_taken_seconds: number | null };
export type Profile = { full_name: string | null; grade: number | null; school_name: string | null; total_xp: number | null; current_level: number | null; streak_days: number | null; created_at: string; preferred_language: string | null };
export type QuizMeta = { id: string; title: string; subject_id: string | null };

export const useStudentStats = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [quizzes, setQuizzes] = useState<Record<string, QuizMeta>>({});
  const [subjects, setSubjects] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    if (!user) return;
    const [p, a, q, s] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("quiz_attempts").select("*").eq("user_id", user.id).order("completed_at", { ascending: true }),
      supabase.from("quizzes").select("id,title,subject_id"),
      supabase.from("subjects").select("id,name"),
    ]);
    setProfile(p.data as Profile);
    setAttempts((a.data as Attempt[]) || []);
    setQuizzes(Object.fromEntries(((q.data as QuizMeta[]) || []).map((x) => [x.id, x])));
    setSubjects(Object.fromEntries((s.data || []).map((x) => [x.id, x.name])));
    setLoading(false);
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const totalXp = profile?.total_xp || attempts.reduce((n, a) => n + (a.xp_earned || 0), 0);
  const level = Math.floor(totalXp / 500) + 1;
  const correct = attempts.reduce((n, a) => n + a.score, 0);
  const answered = attempts.reduce((n, a) => n + a.total_questions, 0);
  const accuracy = answered ? Math.round((correct / answered) * 100) : 0;
  const uniqueQuizzes = new Set(attempts.map((a) => a.quiz_id)).size;
  const perfect = attempts.filter((a) => a.score === a.total_questions && a.total_questions > 0).length;

  // Day streak computed from attempt dates (consecutive days up to today/yesterday)
  const days = new Set(attempts.map((a) => new Date(a.completed_at).toDateString()));
  let streak = 0;
  const d = new Date();
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  while (days.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  streak = Math.max(streak, 0);

  const bySubject: Record<string, { name: string; attempts: number; correct: number; total: number; xp: number }> = {};
  attempts.forEach((a) => {
    const sid = quizzes[a.quiz_id]?.subject_id || "other";
    const name = subjects[sid] || "Other";
    bySubject[sid] ??= { name, attempts: 0, correct: 0, total: 0, xp: 0 };
    bySubject[sid].attempts++;
    bySubject[sid].correct += a.score;
    bySubject[sid].total += a.total_questions;
    bySubject[sid].xp += a.xp_earned || 0;
  });

  return { user, profile, attempts, quizzes, subjects, loading, reload, totalXp, level, accuracy, uniqueQuizzes, perfect, streak, bySubject, answered, correct };
};
