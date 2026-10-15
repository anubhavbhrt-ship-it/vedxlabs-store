import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface SectionHeaderProps {
  overline?: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  badgeVariant?: "yellow" | "black" | "burgundy" | "gray";
}

export function SectionHeader({
  overline,
  title,
  description,
  align = "center",
  className,
  badgeVariant = "yellow",
}: SectionHeaderProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  }[align];

  return (
    <div className={cn("flex flex-col max-w-2xl mb-12 sm:mb-16", alignClass, className)}>
      {overline && (
        <Badge variant={badgeVariant} size="xs" className="mb-3.5">
          {overline}
        </Badge>
      )}

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B0B0E] tracking-[-0.03em] leading-[1.12] text-balance mb-4">
        {title}
      </h2>

      {description && (
        <p className="text-sm sm:text-base text-[#4C4C5B] leading-relaxed max-w-lg font-normal">
          {description}
        </p>
      )}
    </div>
  );
}
