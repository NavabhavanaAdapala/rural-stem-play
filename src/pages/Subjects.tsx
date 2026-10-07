import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout, { PageHeader } from "@/components/Layout";
import { Button, Card, Spinner } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Subject, subjectIcon, subjectTone } from "@/lib/subjects";

const Subjects = () => {
  const { t, pick } = useLanguage();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<(Subject & { quizCount: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: q }] = await Promise.all([
        supabase.from("subjects").select("*").order("created_at"),
        supabase.from("quizzes").select("subject_id"),
      ]);
      const counts: Record<string, number> = {};
      (q || []).forEach((x) => x.subject_id && (counts[x.subject_id] = (counts[x.subject_id] || 0) + 1));
      setSubjects(((s as Subject[]) || []).map((x) => ({ ...x, quizCount: counts[x.id] || 0 })));
      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <PageHeader title={t("subjectsTitle")} subtitle="Pick a subject, read the short lessons, then test yourself with quizzes." />
      <div className="container py-10">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s, n) => {
              const Icon = subjectIcon(s.icon);
              const tone = subjectTone(n);
              return (
                <Card key={s.id} className="flex flex-col p-6 transition hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone.bg} ${tone.text}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{pick(s.name, s.name_hi, s.name_te)}</h3>
                      <p className="text-sm text-muted-foreground">{s.quizCount} quizzes</p>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-muted-foreground">{s.description}</p>
                  <Button className="mt-5 w-full" onClick={() => navigate(`/subjects/${s.id}/quizzes`)}>{t("continueLearning")}</Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Subjects;
