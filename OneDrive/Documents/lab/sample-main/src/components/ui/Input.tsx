import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition = "left",
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold text-[#121217] uppercase tracking-wider"
          >
            {label}
            {props.required && (
              <span className="text-[#7F1D1D] ml-1">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A2A2B0] pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-xl border bg-white text-[#0B0B0E] text-sm",
              "px-3.5 py-2.5 leading-normal",
              "transition-all duration-150 ease-out",
              "placeholder:text-[#A2A2B0]",
              "focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]",
              error
                ? "border-[#7F1D1D] focus:ring-[#7F1D1D]/30"
                : "border-[#E5E5EB] hover:border-[#D4D4DE]",
              icon && iconPosition === "left" && "pl-10",
              icon && iconPosition === "right" && "pr-10",
              className
            )}
            {...props}
          />

          {icon && iconPosition === "right" && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A2A2B0] pointer-events-none">
              {icon}
            </div>
          )}
        </div>

        {(error || hint) && (
          <p
            className={cn(
              "text-[11px] leading-tight",
              error ? "text-[#7F1D1D] font-medium" : "text-[#707082]"
            )}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
