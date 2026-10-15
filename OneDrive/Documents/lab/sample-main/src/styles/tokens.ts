/**
 * VEDXLABS DESIGN SYSTEM TOKENS
 * ─────────────────────────────────────────────────────────────────
 * Personality: Minimal · Premium · Trustworthy · Modern · Creator-led
 * Color System: Near-Black · Crisp White · Warm Yellow · Deep Red Accent
 * ─────────────────────────────────────────────────────────────────
 */

export const tokens = {
  colors: {
    // Primary Foundation
    nearBlack: "#0B0B0E",
    nearBlackSurface: "#141419",
    white: "#FFFFFF",
    offWhite: "#FAFAFA",
    ground: "#F8F8FA",

    // Grays & Neutrals
    gray50: "#F9F9FB",
    gray100: "#F2F2F5",
    gray200: "#E5E5EB",
    gray300: "#D4D4DE",
    gray400: "#A2A2B0",
    gray500: "#707082",
    gray600: "#4B4B5A",
    gray700: "#32323D",
    gray800: "#1D1D24",
    gray900: "#121217",

    // Warm Yellow Accent
    accentYellow: "#F59E0B",
    accentYellowLight: "#FDE68A",
    accentYellowSoft: "#FEF3C7",
    accentYellowDark: "#B45309",

    // Secondary Burgundy / Deep Red (Restrained / Spared)
    burgundy: "#7F1D1D",
    burgundySoft: "#FFF1F2",
    burgundyBorder: "#FECDD3",
    burgundyMuted: "#991B1B",

    // Semantic Accents
    success: "#15803D",
    successSoft: "#F0FDF4",
    successBorder: "#BBF7D0",
  },

  radii: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "18px",
    xl: "24px",
    full: "9999px",
  },

  shadows: {
    subtle: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
    card: "0 2px 10px rgba(11, 11, 14, 0.03), 0 1px 3px rgba(11, 11, 14, 0.02)",
    elevated: "0 12px 36px rgba(11, 11, 14, 0.07), 0 2px 8px rgba(11, 11, 14, 0.03)",
    yellowGlow: "0 4px 20px rgba(245, 158, 11, 0.22)",
    darkCard: "0 4px 24px rgba(0, 0, 0, 0.35)",
  },

  typography: {
    hero: "font-black tracking-[-0.035em] leading-[1.08] text-balance",
    sectionHeading: "font-extrabold tracking-[-0.025em] leading-tight text-balance",
    subheading: "font-semibold tracking-[-0.015em] leading-snug",
    body: "text-base text-neutral-600 leading-relaxed font-normal",
    bodySmall: "text-sm text-neutral-500 leading-relaxed",
    overline: "text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500",
  },

  transitions: {
    fast: "transition-all duration-150 ease-out",
    default: "transition-all duration-200 ease-out",
    smooth: "transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export type DesignTokens = typeof tokens;
