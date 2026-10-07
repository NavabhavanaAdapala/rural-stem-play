import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button, Card, Input, Label } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

export const AuthShell = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex min-h-screen items-center justify-center hero-gradient dotted-bg p-4">
    <Card className="w-full max-w-md animate-rise p-8">
      <Link to="/" className="mb-6 flex items-center justify-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="font-display text-2xl font-extrabold text-gradient">VidyaQuest</span>
      </Link>
      <h1 className="mb-6 text-center text-3xl font-extrabold">{title}</h1>
      {children}
    </Card>
  </div>
);

const SignIn = () => {
  const { signIn, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/subjects";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await signIn(email.trim(), password);
    setBusy(false);
    if (ok) navigate(from, { replace: true });
  };

  return (
    <AuthShell title={t("welcomeBack")}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "…" : t("signIn")}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here? <Link to="/signup" className="font-bold text-primary">{t("signUp")}</Link>
      </p>
    </AuthShell>
  );
};

export default SignIn;
