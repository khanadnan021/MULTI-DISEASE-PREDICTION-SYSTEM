import * as React from "react";
import { cn } from "../../lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  unit?: string;
  normalRange?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, unit, normalRange, children, ...props }, ref) => (
    <div className="flex items-center justify-between gap-1.5 mb-2">
      <label
        ref={ref}
        className={cn(
          "text-sm sm:text-base font-bold text-[#172033] leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {unit && <span className="font-semibold text-[#64748B] font-mono text-xs sm:text-sm">({unit})</span>}
      </label>
      {normalRange && (
        <span className="text-xs font-semibold text-[#64748B] font-mono hidden sm:inline bg-[#F7FAF9] px-2 py-0.5 rounded-md border border-[#E2E8F0]" title="Standard clinical reference interval">
          Ref: {normalRange}
        </span>
      )}
    </div>
  )
);
Label.displayName = "Label";
