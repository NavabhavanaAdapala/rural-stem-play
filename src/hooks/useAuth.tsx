import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string, grade?: number) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message.includes("Invalid login") ? "Wrong email or password." : error.message);
      return false;
    }
    toast.success("Welcome back! 🎉");
    return true;
  };

  const signUp = async (email: string, password: string, fullName: string, grade?: number) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: fullName, grade } },
    });
    if (error) {
      toast.error(error.message.includes("already") ? "This email is already registered. Please sign in." : error.message);
      return false;
    }
    if (data.user && grade) {
      await supabase.from("profiles").update({ grade, full_name: fullName }).eq("user_id", data.user.id);
    }
    toast.success("Account created! Start your learning adventure 🚀");
    return true;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast("Signed out. Come back soon!");
  };

  return (
    <Ctx.Provider value={{ user: session?.user ?? null, session, loading, signIn, signUp, signOut }}>{children}</Ctx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
};
