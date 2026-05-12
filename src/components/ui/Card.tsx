interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function Card({ children, className = "", hover = false, glow = false }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border border-zinc-800/60 bg-zinc-900/50
        ${hover ? "hover-lift cursor-pointer" : ""}
        ${glow ? "animate-glow" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
