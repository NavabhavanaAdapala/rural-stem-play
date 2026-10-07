import { useEffect, useState } from "react";
import { BookOpen, Gamepad2, Trophy, BarChart3, Bot, Zap, ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { Button, Modal, cn } from "@/components/ui";

const slides = [
  { icon: BookOpen, title: "Pick a subject", text: "Choose Maths, Science, English, Hindi and more. Each subject has short lessons and quizzes made for grades 6–12." },
  { icon: Gamepad2, title: "Play quizzes", text: "Answer fun multiple-choice questions. You see the right answer and an explanation right away." },
  { icon: Zap, title: "Earn XP & level up", text: "Every correct answer gives you XP. Collect XP to reach new levels and unlock certificates." },
  { icon: BarChart3, title: "Track your progress", text: "Your dashboard shows XP, streaks, scores per subject and a printable progress report." },
  { icon: Trophy, title: "Climb the leaderboard", text: "Compete with friends this week, this month and all time." },
  { icon: Bot, title: "Ask the AI Tutor", text: "Stuck? Ask doubts by typing or speaking. The tutor explains, makes practice quizzes and plans your study." },
];

const DELAY = 4000;

const DemoModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (open) {
      setI(0);
      setPlaying(true);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !playing) return;
    const id = setTimeout(() => setI((p) => (p + 1) % slides.length), DELAY);
    return () => clearTimeout(id);
  }, [i, open, playing]);

  const go = (n: number) => {
    setI((n + slides.length) % slides.length);
    setPlaying(false);
  };

  const S = slides[i];
  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative hero-gradient dotted-bg p-8 text-center text-primary-foreground">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 hover:bg-card/20" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        <p className="text-sm font-bold opacity-80">Step {i + 1} of {slides.length}</p>
        <div key={i} className="animate-rise">
          <div className="mx-auto mt-4 flex h-20 w-20 animate-float items-center justify-center rounded-3xl bg-card/20">
            <S.icon className="h-10 w-10" />
          </div>
          <h3 className="mt-5 text-3xl font-extrabold">{S.title}</h3>
        </div>
      </div>
      <div className="p-6">
        <p key={i} className="min-h-[72px] animate-rise text-center text-muted-foreground">{S.text}</p>
        <div className="mt-5 flex gap-1.5">
          {slides.map((_, n) => (
            <button key={n} onClick={() => go(n)} className="h-2 flex-1 overflow-hidden rounded-full bg-muted" aria-label={`Slide ${n + 1}`}>
              <div
                key={`${n}-${i}-${playing}`}
                className={cn("h-full origin-left bg-primary", n < i && "w-full", n > i && "w-0", n === i && (playing ? "w-full animate-fill" : "w-full"))}
                style={n === i && playing ? { animationDuration: `${DELAY}ms` } : undefined}
              />
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={() => go(i - 1)} aria-label="Previous"><ChevronLeft /></Button>
          <Button variant="ghost" size="sm" onClick={() => setPlaying(!playing)}>
            {playing ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Auto-play</>}
          </Button>
          <Button variant="outline" size="icon" onClick={() => go(i + 1)} aria-label="Next"><ChevronRight /></Button>
        </div>
      </div>
    </Modal>
  );
};

export default DemoModal;
