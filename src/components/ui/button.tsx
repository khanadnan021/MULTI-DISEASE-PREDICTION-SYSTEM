import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "clinical";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none";

    const variantStyles = {
      default: "bg-[#166534] text-white shadow-xs hover:bg-[#14532D]",
      destructive: "bg-rose-600 text-white shadow-xs hover:bg-rose-700",
      outline: "border border-[#E2E8F0] bg-white text-[#172033] shadow-2xs hover:bg-[#F7FAF9] hover:border-emerald-400 hover:text-[#166534]",
      secondary: "bg-[#F7FAF9] text-[#172033] border border-[#E2E8F0] hover:bg-emerald-50 hover:text-[#166534]",
      ghost: "text-[#64748B] hover:bg-emerald-50 hover:text-[#166534]",
      link: "text-[#16A34A] underline-offset-4 hover:underline",
      clinical: "bg-[#166534] text-white shadow-xs hover:bg-[#14532D] active:scale-[0.99]",
    };

    const sizeStyles = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-lg px-6 text-sm font-semibold",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
