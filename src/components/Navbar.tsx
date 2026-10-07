import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles, ChevronDown, User, LayoutDashboard, LogOut, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage, languageNames, Language } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button, cn } from "@/components/ui";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [name, setName] = useState("");
  const [xp, setXp] = useState(0);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name,total_xp")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setName(data?.full_name || user.email?.split("@")[0] || "Student");
        setXp(data?.total_xp || 0);
      });
  }, [user]);

  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setMenu(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const links = user
    ? [
        { to: "/", label: t("home") },
        { to: "/subjects", label: t("subjects") },
        { to: "/games", label: t("games") },
        { to: "/leaderboard", label: t("leaderboard") },
        { to: "/ai-tutor", label: t("aiTutor") },
        { to: "/dashboard", label: t("dashboard") },
      ]
    : [{ to: "/", label: t("home") }, { to: "/about", label: t("aboutUs") }, { to: "/help", label: t("helpCenter") }];

  const handleSignOut = async () => {
    await signOut();
    setMenu(false);
    navigate("/");
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn("rounded-lg px-3 py-2 text-sm font-bold transition", isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-extrabold text-gradient">VidyaQuest</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end className={linkCls}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <label className="relative hidden items-center sm:flex">
            <Globe className="pointer-events-none absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <select
              aria-label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="h-10 appearance-none rounded-xl border-2 border-border bg-card pl-8 pr-3 text-sm font-bold outline-none focus:border-primary"
            >
              {(Object.keys(languageNames) as Language[]).map((l) => (
                <option key={l} value={l}>{languageNames[l]}</option>
              ))}
            </select>
          </label>

          {user ? (
            <div className="relative" ref={ref}>
              <button
                onClick={() => setMenu(!menu)}
                className="flex items-center gap-2 rounded-xl border-2 border-border bg-card py-1 pl-1 pr-2 hover:border-primary"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg sun-gradient font-display font-bold text-secondary-foreground">
                  {name.charAt(0).toUpperCase() || "S"}
                </span>
                <span className="hidden max-w-[110px] truncate text-sm font-bold md:block">{name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 animate-rise rounded-2xl border border-border bg-card p-2 shadow-soft">
                  <div className="px-3 py-2">
                    <p className="truncate font-bold">{name}</p>
                    <p className="text-xs font-bold text-primary">⭐ {xp} XP</p>
                  </div>
                  <Link to="/profile" onClick={() => setMenu(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted">
                    <User className="h-4 w-4" /> {t("profile")}
                  </Link>
                  <Link to="/dashboard" onClick={() => setMenu(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted">
                    <LayoutDashboard className="h-4 w-4" /> {t("dashboard")}
                  </Link>
                  <button onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-destructive hover:bg-muted">
                    <LogOut className="h-4 w-4" /> {t("signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm" onClick={() => navigate("/signin")}>{t("signIn")}</Button>
              <Button size="sm" onClick={() => navigate("/signup")}>{t("signUp")}</Button>
            </div>
          )}

          <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container flex flex-col gap-1 py-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end className={linkCls} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            <select
              aria-label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="mt-2 h-10 rounded-xl border-2 border-border bg-card px-3 text-sm font-bold sm:hidden"
            >
              {(Object.keys(languageNames) as Language[]).map((l) => (
                <option key={l} value={l}>{languageNames[l]}</option>
              ))}
            </select>
            {!user && (
              <div className="mt-2 flex gap-2 sm:hidden">
                <Button variant="outline" className="flex-1" onClick={() => navigate("/signin")}>{t("signIn")}</Button>
                <Button className="flex-1" onClick={() => navigate("/signup")}>{t("signUp")}</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
