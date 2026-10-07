import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Label } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthShell } from "./SignIn";

const SignUp = () => {
  const { signUp, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", grade: "8" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user) navigate("/subjects", { replace: true });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await signUp(form.email.trim(), form.password, form.name.trim(), Number(form.grade));
    setBusy(false);
    if (ok) setSent(true);
  };

  if (sent && !user)
    return (
      <AuthShell title="Check your email 📬">
        <p className="text-center text-muted-foreground">
          We sent a confirmation link to <b>{form.email}</b>. Open it to activate your account, then sign in.
        </p>
        <Button className="mt-6 w-full" onClick={() => navigate("/signin")}>{t("signIn")}</Button>
      </AuthShell>
    );

  return (
    <AuthShell title={t("createAccount")}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="name">{t("fullName")}</Label>
          <Input id="name" required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="grade">{t("grade")}</Label>
          <select
            id="grade"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            className="h-12 w-full rounded-xl border-2 border-input bg-card px-4 outline-none focus:border-primary"
          >
            {[6, 7, 8, 9, 10, 11, 12].map((g) => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "…" : t("signUp")}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/signin" className="font-bold text-primary">{t("signIn")}</Link>
      </p>
    </AuthShell>
  );
};

export default SignUp;
