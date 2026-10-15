import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "yellow" | "black" | "burgundy" | "red" | "gray" | "green" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "xs" | "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  yellow:   "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]",
  black:    "bg-[#0B0B0E] text-white border border-[#1E1E26]",
  burgundy: "bg-[#FFF1F2] text-[#7F1D1D] border border-[#FECDD3]",
  red:      "bg-[#FFF1F2] text-[#7F1D1D] border border-[#FECDD3]",
  gray:     "bg-[#F4F4F7] text-[#4B4B5A] border border-[#E5E5EB]",
  green:    "bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]",
  outline:  "bg-white border border-[#E5E5EB] text-[#707082]",
};

const sizeStyles = {
  xs: "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
  sm: "text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full",
  md: "text-xs font-semibold tracking-normal px-3 py-1 rounded-full",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "gray", size = "sm", className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 transition-colors duration-150",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
