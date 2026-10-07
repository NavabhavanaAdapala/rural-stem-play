import React from "react";

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

type BtnVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "light";
type BtnSize = "sm" | "md" | "lg" | "icon";

const variants: Record<BtnVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:brightness-110 shadow-pop active:translate-y-[2px] active:shadow-none",
  secondary: "bg-secondary text-secondary-foreground hover:brightness-105",
  outline: "border-2 border-border bg-card hover:border-primary hover:text-primary",
  ghost: "hover:bg-muted",
  destructive: "bg-destructive text-destructive-foreground hover:brightness-110",
  light: "bg-card text-primary hover:bg-card/90",
};
const sizes: Record<BtnSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5",
  lg: "h-14 px-8 text-lg",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize }
>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";

export const Card = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-2xl border border-border bg-card text-card-foreground shadow-soft", className)} {...p} />
);

export const Badge = ({ className, ...p }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-bold", className)} {...p} />
);

export const Progress = ({ value, className, barClassName }: { value: number; className?: string; barClassName?: string }) => (
  <div className={cn("h-3 w-full overflow-hidden rounded-full bg-muted", className)}>
    <div className={cn("h-full rounded-full hero-gradient transition-all duration-500", barClassName)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => (
  <input
    ref={ref}
    className={cn("h-12 w-full rounded-xl border-2 border-input bg-card px-4 outline-none transition focus:border-primary", className)}
    {...p}
  />
));
Input.displayName = "Input";

export const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className={cn("w-full rounded-xl border-2 border-input bg-card p-4 outline-none focus:border-primary", p.className)} />
);

export const Label = (p: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label {...p} className={cn("mb-1.5 block text-sm font-bold", p.className)} />
);

export const Spinner = ({ className }: { className?: string }) => (
  <div className={cn("h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent", className)} />
);

export const Modal = ({ open, onClose, children, className }: { open: boolean; onClose: () => void; children: React.ReactNode; className?: string }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4" onClick={onClose}>
      <div className={cn("w-full max-w-lg animate-rise overflow-hidden rounded-3xl bg-card shadow-soft", className)} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
