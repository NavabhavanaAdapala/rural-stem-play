import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Flame, Target, Trophy, Download, Printer, Award, Lock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";
import Layout from "@/components/Layout";
import { Badge, Button, Card, Progress, Spinner, cn } from "@/components/ui";
import { useStudentStats } from "@/hooks/useStudentStats";

const tabs = ["Overview", "Subjects", "Progress Report", "Certificates"] as const;

const Dashboard = () => {
  const s = useStudentStats();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");

  if (s.loading) return <Layout><div className="flex justify-center py-32"><Spinner /></div></Layout>;

  const name = s.profile?.full_name || "Student";

  // XP over last 14 days
  const daily = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toDateString();
    const xp = s.attempts.filter((a) => new Date(a.completed_at).toDateString() === key).reduce((n, a) => n + (a.xp_earned || 0), 0);
    return { day: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }), xp };
  });
  const subj = Object.values(s.bySubject).map((x) => ({ ...x, pct: x.total ? Math.round((x.correct / x.total) * 100) : 0 }));

  const thisMonth = new Date().getMonth();
  const monthAttempts = s.attempts.filter((a) => new Date(a.completed_at).getMonth() === thisMonth);
  const lastMonthAttempts = s.attempts.filter((a) => new Date(a.completed_at).getMonth() === (thisMonth + 11) % 12);
  const monthXp = monthAttempts.reduce((n, a) => n + (a.xp_earned || 0), 0);
  const lastMonthXp = lastMonthAttempts.reduce((n, a) => n + (a.xp_earned || 0), 0);

  const certificates = [
    { id: "first", title: "First Steps", desc: "Completed your first quiz", earned: s.attempts.length >= 1 },
    { id: "five", title: "Quiz Explorer", desc: "Completed 5 quizzes", earned: s.attempts.length >= 5 },
    { id: "ten", title: "Quiz Champion", desc: "Completed 10 quizzes", earned: s.attempts.length >= 10 },
    { id: "perfect", title: "Perfect Score", desc: "Scored 100% in a quiz", earned: s.perfect >= 1 },
    { id: "xp500", title: "Rising Star", desc: "Earned 500 XP", earned: s.totalXp >= 500 },
    { id: "xp2000", title: "STEM Master", desc: "Earned 2,000 XP", earned: s.totalXp >= 2000 },
    { id: "streak3", title: "On Fire", desc: "3-day learning streak", earned: s.streak >= 3 },
    { id: "multi", title: "All-Rounder", desc: "Played quizzes in 3 subjects", earned: Object.keys(s.bySubject).length >= 3 },
  ];

  const printCertificate = (title: string, desc: string) => {
    const w = window.open("", "_blank", "width=1100,height=800");
    if (!w) return;
    const date = new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
    w.document.write(`<!doctype html><html><head><title>${title} – VidyaQuest Certificate</title>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;700&display=swap" rel="stylesheet">
<style>@page{size:A4 landscape;margin:0}body{margin:0;font-family:Nunito,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#fdf8ee}
.c{width:260mm;height:180mm;box-sizing:border-box;border:14px solid #1d8f61;outline:4px solid #f2a516;outline-offset:-26px;padding:24mm;text-align:center;background:#fffdf7;position:relative}
h1{font-family:'Baloo 2';font-size:52px;color:#1d8f61;margin:0}h2{font-family:'Baloo 2';font-size:40px;margin:10px 0;color:#14261f}
.s{letter-spacing:4px;text-transform:uppercase;color:#6b7c74;font-weight:700}.b{display:inline-block;margin-top:14px;padding:8px 22px;border-radius:999px;background:#f2a516;font-weight:800;font-size:20px}
.f{position:absolute;bottom:22mm;left:24mm;right:24mm;display:flex;justify-content:space-between;color:#6b7c74}</style></head>
<body><div class="c"><div class="s">VidyaQuest · Certificate of Achievement</div><h1>🏆 ${title}</h1><p class="s" style="margin-top:20px">Proudly presented to</p>
<h2>${name.replace(/</g, "&lt;")}</h2><p style="font-size:20px">${desc}</p><div class="b">${s.totalXp} XP · Level ${s.level}</div>
<div class="f"><span>Date: ${date}</span><span>VidyaQuest Learning Team</span></div></div>
<script>window.onload=()=>setTimeout(()=>window.print(),400)</script></body></html>`);
    w.document.close();
  };

  const downloadReport = () => {
    const lines = [
      "VIDYAQUEST PROGRESS REPORT",
      `Student: ${name}   Grade: ${s.profile?.grade ?? "-"}   School: ${s.profile?.school_name ?? "-"}`,
      `Date: ${new Date().toLocaleDateString()}`,
      "",
      `Total XP: ${s.totalXp}   Level: ${s.level}   Streak: ${s.streak} days`,
      `Quizzes attempted: ${s.attempts.length}   Accuracy: ${s.accuracy}%   Perfect scores: ${s.perfect}`,
      "",
      "SUBJECT PERFORMANCE",
      ...subj.map((x) => `- ${x.name}: ${x.attempts} quizzes, ${x.pct}% accuracy, ${x.xp} XP`),
      "",
      "RECENT QUIZZES",
      ...s.attempts.slice(-10).reverse().map((a) => `- ${new Date(a.completed_at).toLocaleDateString()} ${s.quizzes[a.quiz_id]?.title ?? "Quiz"}: ${a.score}/${a.total_questions}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `vidyaquest-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const stats = [
    { icon: Zap, label: "Total XP", value: s.totalXp, tone: "bg-secondary text-secondary-foreground" },
    { icon: Flame, label: "Day streak", value: s.streak, tone: "bg-destructive text-destructive-foreground" },
    { icon: Trophy, label: "Quizzes", value: s.attempts.length, tone: "bg-primary text-primary-foreground" },
    { icon: Target, label: "Accuracy", value: `${s.accuracy}%`, tone: "bg-accent text-accent-foreground" },
  ];

  return (
    <Layout>
      <section className="hero-gradient dotted-bg text-primary-foreground">
        <div className="container py-10">
          <p className="font-bold opacity-80">My Progress</p>
          <h1 className="text-4xl font-extrabold md:text-5xl">Hi {name.split(" ")[0]}! 👋</h1>
          <div className="mt-6 max-w-xl rounded-2xl bg-card/15 p-4">
            <div className="flex justify-between text-sm font-bold">
              <span>Level {s.level}</span>
              <span>{s.totalXp % 500}/500 XP</span>
            </div>
            <Progress value={((s.totalXp % 500) / 500) * 100} className="mt-2 bg-card/25" barClassName="sun-gradient" />
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((x) => (
            <Card key={x.label} className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${x.tone}`}><x.icon className="h-6 w-6" /></div>
              <div>
                <p className="font-display text-2xl font-extrabold">{x.value}</p>
                <p className="text-sm text-muted-foreground">{x.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex gap-1 overflow-x-auto rounded-xl bg-muted p-1">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold", tab === t ? "bg-card shadow-soft" : "text-muted-foreground")}>{t}</button>
          ))}
        </div>

        {s.attempts.length === 0 && tab !== "Certificates" ? (
          <Card className="mt-6 p-10 text-center">
            <p className="text-lg font-bold">No quizzes yet!</p>
            <p className="text-muted-foreground">Play your first quiz to see your charts and reports here.</p>
            <Button className="mt-4" onClick={() => navigate("/games")}>Play a quiz</Button>
          </Card>
        ) : tab === "Overview" ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-lg font-bold">XP earned – last 14 days</h3>
              <div className="mt-4 h-64">
                <ResponsiveContainer>
                  <AreaChart data={daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis fontSize={12} allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="xp" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.25)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-bold">Recent activity</h3>
              <ul className="mt-4 space-y-3">
                {s.attempts.slice(-6).reverse().map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-semibold">{s.quizzes[a.quiz_id]?.title ?? "Quiz"}</span>
                    <Badge className="bg-primary/15 text-primary">{a.score}/{a.total_questions}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        ) : tab === "Subjects" ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-bold">Accuracy by subject</h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer>
                  <BarChart data={subj}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis domain={[0, 100]} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="pct" name="Accuracy %" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="space-y-4 p-6">
              <h3 className="text-lg font-bold">Subject breakdown</h3>
              {subj.map((x) => (
                <div key={x.name}>
                  <div className="flex justify-between text-sm font-bold"><span>{x.name}</span><span>{x.pct}% · {x.xp} XP</span></div>
                  <Progress value={x.pct} className="mt-1.5" />
                </div>
              ))}
            </Card>
          </div>
        ) : tab === "Progress Report" ? (
          <Card className="mt-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-bold">Progress Report</h3>
              <Button onClick={downloadReport}><Download className="h-4 w-4" /> Download report</Button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-muted p-4"><p className="text-sm text-muted-foreground">XP this month</p><p className="font-display text-3xl font-extrabold">{monthXp}</p><p className="text-sm">{monthXp >= lastMonthXp ? "▲" : "▼"} vs {lastMonthXp} last month</p></div>
              <div className="rounded-xl bg-muted p-4"><p className="text-sm text-muted-foreground">Quizzes this month</p><p className="font-display text-3xl font-extrabold">{monthAttempts.length}</p><p className="text-sm">{lastMonthAttempts.length} last month</p></div>
              <div className="rounded-xl bg-muted p-4"><p className="text-sm text-muted-foreground">Perfect scores</p><p className="font-display text-3xl font-extrabold">{s.perfect}</p><p className="text-sm">{s.uniqueQuizzes} different quizzes</p></div>
            </div>
            <h4 className="mt-6 font-bold">Strengths & areas to improve</h4>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              {[...subj].sort((a, b) => b.pct - a.pct).map((x) => (
                <li key={x.name}>{x.pct >= 70 ? "💪 Strong in" : x.pct >= 40 ? "📈 Improving in" : "🎯 Practise more"} <b className="text-foreground">{x.name}</b> ({x.pct}%)</li>
              ))}
            </ul>
          </Card>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {certificates.map((c) => (
              <Card key={c.id} className={cn("flex flex-col p-6 text-center", !c.earned && "opacity-60")}>
                <div className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-2xl", c.earned ? "sun-gradient" : "bg-muted")}>
                  {c.earned ? <Award className="h-8 w-8" /> : <Lock className="h-7 w-7 text-muted-foreground" />}
                </div>
                <h3 className="mt-4 font-bold">{c.title}</h3>
                <p className="flex-1 text-sm text-muted-foreground">{c.desc}</p>
                <Button size="sm" className="mt-4" disabled={!c.earned} onClick={() => printCertificate(c.title, c.desc)}>
                  <Printer className="h-4 w-4" /> {c.earned ? "Print / Save PDF" : "Locked"}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
