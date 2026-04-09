type BadgeVariant = "green" | "red" | "yellow" | "blue" | "indigo" | "zinc";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  green:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  red:    "bg-red-500/10 text-red-400 border-red-500/20",
  yellow: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  blue:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  zinc:   "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export default function Badge({ children, variant = "zinc", dot = false, className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5
        text-[11px] font-semibold tracking-wide
        ${VARIANT_STYLES[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${
          variant === "green" ? "bg-emerald-400" :
          variant === "red"   ? "bg-red-400" :
          variant === "yellow"? "bg-amber-400" :
          variant === "blue"  ? "bg-blue-400" :
          variant === "indigo"? "bg-indigo-400" :
          "bg-zinc-400"
        }`} />
      )}
      {children}
    </span>
  );
}
