import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-600 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full px-3 py-2 rounded-lg border bg-white text-slate-800 text-sm",
            "placeholder:text-slate-400 transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400",
            error ? "border-red-300 focus:ring-red-500/30 focus:border-red-400" : "border-slate-200",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;