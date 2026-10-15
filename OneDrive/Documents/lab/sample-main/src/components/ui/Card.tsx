import * as React from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "elevated" | "bordered" | "dark" | "ghost";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-white border border-[#E5E5EB] shadow-[0_1px_3px_rgba(11,11,14,0.02),0_1px_2px_rgba(11,11,14,0.02)] rounded-2xl",
  elevated:
    "bg-white border border-[#E5E5EB] shadow-[0_8px_30px_rgba(11,11,14,0.04),0_1px_3px_rgba(11,11,14,0.02)] rounded-2xl",
  bordered:
    "bg-white border border-[#E5E5EB] rounded-2xl",
  dark:
    "bg-[#0B0B0E] border border-[#1E1E26] text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] rounded-2xl",
  ghost:
    "bg-transparent rounded-2xl",
};

const paddingStyles = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-6 sm:p-7",
  lg: "p-8 sm:p-9",
  xl: "p-8 sm:p-12",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", hover = false, padding = "md", className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-200 ease-out",
        variantStyles[variant],
        paddingStyles[padding],
        hover && "hover:-translate-y-1 hover:border-[#D5D5DE] hover:shadow-[0_12px_32px_rgba(11,11,14,0.07)] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mb-4", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-bold text-[#0B0B0E] tracking-tight leading-snug", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-[#4C4C5B] text-sm leading-relaxed", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-5 pt-4 border-t border-[#F2F2F5] flex items-center justify-between", className)} {...props} />
));
CardFooter.displayName = "CardFooter";
