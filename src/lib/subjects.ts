import {
  Calculator, Atom, Laptop, Wrench, Globe, Languages, BookText, Palette, Dumbbell, Leaf, Landmark, BookOpen, Code, LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Calculator, Atom, Laptop, Wrench, Globe, Languages, BookText, Palette, Dumbbell, Leaf, Landmark, BookOpen, Code,
};

export const subjectIcon = (name?: string | null): LucideIcon => (name && icons[name]) || BookOpen;

// Each subject colour token maps to a background utility built from design tokens.
const tones = ["bg-primary", "bg-accent", "bg-secondary", "bg-success", "bg-destructive", "bg-ink"];
const toneText = ["text-primary-foreground", "text-accent-foreground", "text-secondary-foreground", "text-success-foreground", "text-destructive-foreground", "text-ink-foreground"];

export const subjectTone = (index: number) => ({ bg: tones[index % tones.length], text: toneText[index % toneText.length] });

export type Subject = {
  id: string;
  name: string;
  name_hi: string | null;
  name_te: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
};
