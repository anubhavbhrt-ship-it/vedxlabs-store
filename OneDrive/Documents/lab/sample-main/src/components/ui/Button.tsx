import * as React from "react";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────────────────────
// BUTTON COMPONENT
// ──────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "ghost" | "burgundy" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#F59E0B] text-[#0B0B0E] font-bold hover:bg-[#E08D03] active:bg-[#C87A02] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_14px_rgba(245,158,11,0.25)] border border-[#E08D03]/40",
  secondary:
    "bg-[#0B0B0E] text-[#FFFFFF] font-semibold hover:bg-[#181820] active:bg-black shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-[#1E1E26]",
  ghost:
    "bg-transparent text-[#121217] hover:bg-[#F2F2F5] active:bg-[#E5E5EB]",
  outline:
    "border border-[#E5E5EB] bg-white text-[#121217] font-semibold hover:border-[#D1D1DB] hover:bg-[#FAFAFC] shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
  burgundy:
    "bg-[#7F1D1D] text-white font-semibold hover:bg-[#991B1B] active:bg-[#5C1221] shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-[#991B1B]/30",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs rounded-xl tracking-tight",
  md: "px-5 py-2.5 text-xs sm:text-sm rounded-xl tracking-tight",
  lg: "px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl tracking-tight font-bold",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 select-none transition-all duration-200 ease-out cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          iconPosition === "left" && icon
        )}
        {children}
        {!loading && iconPosition === "right" && icon}
      </button>
    );
  }
);
Button.displayName = "Button";
