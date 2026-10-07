import { useState } from "react";
import { Crown, Medal, Share2, Copy } from "lucide-react";
import { toast } from "sonner";
import Layout, { PageHeader } from "@/components/Layout";
import { Button, Card, cn } from "@/components/ui";
import { useStudentStats } from "@/hooks/useStudentStats";

type Row = { name: string; village: string; xp: number };

const boards: Record<string, Row[]> = {
  week: [
    { name: "Priya Sharma", village: "Rampur", xp: 820 }, { name: "Ravi Kumar", village: "Nellore", xp: 760 }, { name: "Anjali Reddy", village: "Warangal", xp: 705 },
    { name: "Arjun Singh", village: "Sitapur", xp: 640 }, { name: "Lakshmi Devi", village: "Guntur", xp: 590 }, { name: "Mohan Das", village: "Bhadrachalam", xp: 520 },
    { name: "Sneha Patil", village: "Satara", xp: 470 }, { name: "Kiran Rao", village: "Khammam", xp: 410 },
  ],
  month: [
    { name: "Ananya Iyer", village: "Tirupati", xp: 3120 }, { name: "Suresh Yadav", village: "Bareilly", xp: 2980 }, { name: "Divya Naidu", village: "Ongole", xp: 2810 },
    { name: "Rahul Verma", village: "Jhansi", xp: 2650 }, { name: "Kavya Menon", village: "Palakkad", xp: 2400 }, { name: "Venkat Raju", village: "Eluru", xp: 2290 },
    { name: "Pooja Kumari", village: "Gaya", xp: 2105 }, { name: "Sai Teja", village: "Karimnagar", xp: 1980 },
  ],
  all: [
    { name: "Harini Prasad", village: "Kurnool", xp: 15400 }, { name: "Aditya Mishra", village: "Varanasi", xp: 14820 }, { name: "Meena Kumari", village: "Nalgonda", xp: 13990 },
    { name: "Vikram Chauhan", village: "Ajmer", xp: 12750 }, { name: "Sravani Goud", village: "Medak", xp: 11980 }, { name: "Rohit Pawar", village: "Nashik", xp: 11240 },
    { name: "Bhavana Rao", village: "Vizianagaram", xp: 10660 }, { name: "Imran Khan", village: "Malda", xp: 9870 },
  ],
};

const tabs = [{ k: "week", l: "This Week" }, { k: "month", l: "This Month" }, { k: "all", l: "All Time" }];

const Leaderboard = () => {
  const [tab, setTab] = useState("week");
  const { profile, totalXp } = useStudentStats();
  const me: Row = { name: `${profile?.full_name || "You"} (You)`, village: profile?.school_name || "Your school", xp: totalXp };
  const rows = [...boards[tab], me].sort((a, b) => b.xp - a.xp);
  const myRank = rows.findIndex((r) => r === me) + 1;

  const shareText = `I'm ranked #${myRank} on VidyaQuest with ${totalXp} XP! Join me and learn STEM the fun way.`;
  const url = window.location.origin;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${url}`);
      toast.success("Link copied!");
    } catch {
      toast.error("Couldn't copy. Please copy the address bar link.");
    }
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "VidyaQuest", text: shareText, url }); } catch { /* cancelled */ }
    } else copy();
  };

  return (
    <Layout>
      <PageHeader title="Leaderboard 🏆" subtitle="See how you rank among learners across rural India." />
      <div className="container max-w-3xl py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl bg-muted p-1">
            {tabs.map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)} className={cn("rounded-lg px-4 py-2 text-sm font-bold", tab === t.k ? "bg-card shadow-soft" : "text-muted-foreground")}>{t.l}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" /> Copy link</Button>
            <Button size="sm" onClick={share}><Share2 className="h-4 w-4" /> Share</Button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {rows.map((r, i) => (
            <Card key={r.name + i} className={cn("flex items-center gap-4 p-4", r === me && "border-2 border-primary bg-primary/5")}>
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl font-display text-lg font-extrabold", i === 0 ? "sun-gradient" : i < 3 ? "bg-accent text-accent-foreground" : "bg-muted")}>
                {i === 0 ? <Crown className="h-5 w-5" /> : i < 3 ? <Medal className="h-5 w-5" /> : i + 1}
              </div>
              <div className="flex-1">
                <p className="font-bold">{r.name}</p>
                <p className="text-sm text-muted-foreground">{r.village}</p>
              </div>
              <p className="font-display text-xl font-extrabold text-primary">{r.xp.toLocaleString()} XP</p>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
