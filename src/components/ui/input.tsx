import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 sm:h-12 w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-base font-semibold text-[#172033] shadow-2xs transition-all duration-200 hover:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50 font-mono placeholder:text-slate-400 placeholder:font-normal",
          error && "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/50 text-rose-900",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
