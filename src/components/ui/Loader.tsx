interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "h-4 w-4 border-[2px]",
  md: "h-6 w-6 border-[2px]",
  lg: "h-10 w-10 border-[3px]",
};

export default function Loader({ size = "md", className = "" }: LoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${SIZE_MAP[size]}
          rounded-full border-zinc-700 border-t-indigo-500
          animate-spin
        `}
      />
    </div>
  );
}
