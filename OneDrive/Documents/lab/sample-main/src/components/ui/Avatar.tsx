import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "hero";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  withRing?: boolean;
  withGlow?: boolean;
}

const sizeConfig: Record<AvatarSize, { width: number; height: number; containerClass: string }> = {
  xs: { width: 24, height: 24, containerClass: "w-6 h-6" },
  sm: { width: 36, height: 36, containerClass: "w-9 h-9" },
  md: { width: 48, height: 48, containerClass: "w-12 h-12" },
  lg: { width: 80, height: 80, containerClass: "w-20 h-20" },
  xl: { width: 140, height: 140, containerClass: "w-36 h-36 sm:w-44 sm:h-44" },
  hero: { width: 320, height: 320, containerClass: "w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80" },
};

export function Avatar({
  src = "/images/anubhav.png",
  alt = "Anubhav Bharti",
  size = "md",
  className,
  withRing = true,
  withGlow = false,
}: AvatarProps) {
  const { width, height, containerClass } = sizeConfig[size];

  return (
    <div
      className={cn(
        "relative rounded-full select-none shrink-0 overflow-hidden bg-[#F59E0B]",
        containerClass,
        withRing && "ring-2 ring-white/90 shadow-sm",
        withGlow && "shadow-[0_8px_32px_rgba(245,158,11,0.28)]",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover object-top"
        priority={size === "hero"}
      />
    </div>
  );
}
