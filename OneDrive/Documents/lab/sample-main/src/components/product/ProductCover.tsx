"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProductCoverProps {
  title?: string;
  className?: string;
  compact?: boolean;
}

export function ProductCover({
  title = "Master AI in 28 Days",
  className,
  compact = false,
}: ProductCoverProps) {
  // 4 rows of 7 days
  const week1 = [1, 2, 3, 4, 5, 6, 7];
  const week2 = [8, 9, 10, 11, 12, 13, 14];
  const week3 = [15, 16, 17, 18, 19, 20, 21];
  const week4 = [22, 23, 24, 25, 26, 27, 28];

  return (
    <div
      className={cn(
        "relative select-none overflow-hidden rounded-2xl bg-[#0B0B0E] text-white p-6 sm:p-8 flex flex-col justify-between",
        "border border-[#1E1E26] shadow-[0_12px_40px_rgba(0,0,0,0.25)]",
        compact ? "p-5" : "min-h-[350px] sm:min-h-[420px]",
        className
      )}
    >
      {/* Subtle architectural ambient highlight - no loud gradient */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#F59E0B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7F1D1D]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Editorial Tag & Edition */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A22] border border-[#2D2D3A] text-[11px] font-bold text-[#F59E0B] tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          A Daily Guide for Beginners
        </div>

        <span className="text-[11px] font-mono font-medium tracking-wider text-[#A2A2B0] px-2.5 py-0.5 rounded-md bg-[#141419] border border-[#24242F]">
          CURRICULUM 2026
        </span>
      </div>

      {/* Center Layout: Editorial Typography & Calendar Matrix */}
      <div className="relative z-10 my-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Column: Typography */}
        <div className={compact ? "md:col-span-12" : "md:col-span-7"}>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#A2A2B0] mb-1.5">
            Structured Digital Blueprint
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] text-white">
            {title === "Master AI in 28 Days" ? (
              <>
                AI in <br />
                <span className="text-[#F59E0B]">28 Days</span>
              </>
            ) : (
              <span className="text-white">{title}</span>
            )}
          </h2>
          <p className="mt-2.5 text-[#D4D4DE] text-xs sm:text-sm font-medium tracking-tight">
            From Zero to Confident
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-[#141419] border border-[#24242F] text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full">
            <span>Learn it.</span>
            <span className="text-[#F59E0B] font-bold">•</span>
            <span>Use it.</span>
            <span className="text-[#F59E0B] font-bold">•</span>
            <span>Earn with it.</span>
          </div>
        </div>

        {/* Right Column: Architectural Calendar Grid */}
        {!compact && (
          <div className="md:col-span-5 bg-[#121217] border border-[#1E1E26] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#A2A2B0] mb-3 pb-2 border-b border-[#1E1E26]">
              <span>28-Day Plan</span>
              <span className="text-[#F59E0B] font-bold">1 Lesson / Day</span>
            </div>

            <div className="space-y-1.5 text-center">
              {/* Row 1: Warm Yellow (Foundations) */}
              <div className="grid grid-cols-7 gap-1">
                {week1.map((day) => (
                  <div
                    key={day}
                    className="aspect-square flex items-center justify-center rounded bg-[#F59E0B] text-[#0B0B0E] font-bold text-[10px] sm:text-xs"
                    title={`Day ${day}: AI Foundations`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Row 2: Near-Black with Yellow borders (Productivity) */}
              <div className="grid grid-cols-7 gap-1">
                {week2.map((day) => (
                  <div
                    key={day}
                    className="aspect-square flex items-center justify-center rounded bg-[#1A1A22] border border-[#2D2D3A] text-white font-medium text-[10px] sm:text-xs hover:border-[#F59E0B] transition-colors"
                    title={`Day ${day}: Productivity`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Row 3: Building & Coding (Deep Burgundy Accent row) */}
              <div className="grid grid-cols-7 gap-1">
                {week3.map((day) => (
                  <div
                    key={day}
                    className="aspect-square flex items-center justify-center rounded bg-[#2D1217] border border-[#4C1D24] text-[#FECDD3] font-medium text-[10px] sm:text-xs"
                    title={`Day ${day}: Building & Coding`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Row 4: Monetisation & Growth */}
              <div className="grid grid-cols-7 gap-1">
                {week4.map((day) => (
                  <div
                    key={day}
                    className="aspect-square flex items-center justify-center rounded bg-[#1A1A22] border border-[#2D2D3A] text-white font-medium text-[10px] sm:text-xs"
                    title={`Day ${day}: Monetisation`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-[#707082] px-1">
              <span>W1: Foundations</span>
              <span>W4: Monetise</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Creator Brand & Description */}
      <div className="relative z-10 pt-4 border-t border-[#1E1E26] flex items-center justify-between text-xs">
        <p className="text-[11px] sm:text-xs text-[#A2A2B0] font-normal">
          Designed for students, professionals &amp; developers.
        </p>
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-white">
          ANUBHAV BHARTI
        </span>
      </div>
    </div>
  );
}
