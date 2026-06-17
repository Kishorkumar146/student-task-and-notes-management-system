import { clsx } from "clsx";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Loader({ size = "md", className }: LoaderProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-[3px]",
  };

  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <div
        className={clsx(
          "rounded-full border-slate-200 border-t-indigo-600 animate-spin",
          sizes[size]
        )}
      />
    </div>
  );
}