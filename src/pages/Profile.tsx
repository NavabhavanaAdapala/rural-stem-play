import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Zap, Flame, Target, Trophy, LogOut } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Button, Card, Input, Label, Modal, Progress, Spinner } from "@/components/ui";
import { useStudentStats } from "@/hooks/useStudentStats";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage, Language, languageNames } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const s = useStudentStats();
  const { signOut } = useAuth();
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ full_name: "", grade: "8", school_name: "", preferred_language: "en" });
  const [saving, setSaving] = useState(false);

  if (s.loading) return <Layout><div className="flex justify-center py-32"><Spinner /></div></Layout>;

  const openEdit = () => {
    setForm({
      full_name: s.profile?.full_name || "",
      grade: String(s.profile?.grade || 8),
      school_name: s.profile?.school_name || "",
      preferred_language: s.profile?.preferred_language || "en",
    });
    setEdit(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.full_name.trim(), grade: Number(form.grade), school_name: form.school_name.trim(), preferred_language: form.preferred_language })
      .eq("user_id", s.user!.id);
    setSaving(false);
    if (error) return toast.error("Couldn't save your profile.");
    setLanguage(form.preferred_language as Language);
    toast.success("Profile updated!");
    setEdit(false);
    s.reload();
  };

  const name = s.profile?.full_name || s.user?.email?.split("@")[0] || "Student";
  const stats = [
    { icon: Zap, label: "Total XP", value: s.totalXp },
    { icon: Flame, label: "Day streak", value: s.streak },
    { icon: Target, label: "Accuracy", value: `${s.accuracy}%` },
    { icon: Trophy, label: "Quizzes done", value: s.attempts.length },
  ];

  return (
    <Layout>
      <div className="hero-gradient dotted-bg">
        <div className="container flex flex-col items-center gap-5 py-12 text-center text-primary-foreground md:flex-row md:text-left">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl sun-gradient font-display text-5xl font-extrabold text-secondary-foreground shadow-soft">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold">{name}</h1>
            <p className="opacity-90">
              Grade {s.profile?.grade || "–"} {s.profile?.school_name ? `· ${s.profile.school_name}` : ""} · {s.user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="light" onClick={openEdit}><Pencil className="h-4 w-4" /> Edit profile</Button>
            <Button variant="secondary" onClick={async () => { await signOut(); navigate("/"); }}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
      <div className="container py-8">
        <Card className="p-6">
          <div className="flex items-center justify-between font-bold">
            <span>Level {s.level}</span>
            <span className="text-muted-foreground">{s.totalXp % 500} / 500 XP to level {s.level + 1}</span>
          </div>
          <Progress value={((s.totalXp % 500) / 500) * 100} className="mt-3 h-4" />
        </Card>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((x) => (
            <Card key={x.label} className="p-5 text-center">
              <x.icon className="mx-auto h-7 w-7 text-primary" />
              <p className="mt-2 font-display text-3xl font-extrabold">{x.value}</p>
              <p className="text-sm text-muted-foreground">{x.label}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>View full progress dashboard</Button>
        </div>
      </div>

      <Modal open={edit} onClose={() => setEdit(false)}>
        <form onSubmit={save} className="space-y-4 p-6">
          <h2 className="text-2xl font-bold">Edit profile</h2>
          <div><Label>Full name</Label><Input required maxLength={80} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
          <div>
            <Label>Grade</Label>
            <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="h-12 w-full rounded-xl border-2 border-input bg-card px-4">
              {[6, 7, 8, 9, 10, 11, 12].map((g) => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </div>
          <div><Label>School name</Label><Input maxLength={120} value={form.school_name} onChange={(e) => setForm({ ...form, school_name: e.target.value })} /></div>
          <div>
            <Label>Preferred language</Label>
            <select value={form.preferred_language} onChange={(e) => setForm({ ...form, preferred_language: e.target.value })} className="h-12 w-full rounded-xl border-2 border-input bg-card px-4">
              {(Object.keys(languageNames) as Language[]).map((l) => <option key={l} value={l}>{languageNames[l]}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setEdit(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Profile;
