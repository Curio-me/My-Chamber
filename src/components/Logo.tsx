import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  theme?: "dark" | "light" | "auto";
  variant?: "shield-filled" | "shield-outline";
}

/**
 * Official My Chamber Logo Component
 * Concept 3: The Verified Legal Shield
 * Combines a modern heraldic protection shield with precision Scales of Justice
 * Colors: Imperial Forest Green (#163826) and Champagne Gold (#D4AF37 / #E6D5B8)
 */
export function ShieldIcon({
  size = 28,
  className = "",
  goldAccent = "#D4AF37",
  primaryColor = "#163826",
}: {
  size?: number;
  className?: string;
  goldAccent?: string;
  primaryColor?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="My Chamber Verified Legal Shield"
    >
      <defs>
        {/* Subtle gold gradient for metallic luster */}
        <linearGradient id="mcShieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E5C9" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA820A" />
        </linearGradient>

        {/* Deep forest green gradient */}
        <linearGradient id="mcShieldGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E4A33" />
          <stop offset="100%" stopColor="#10281B" />
        </linearGradient>
      </defs>

      {/* Outer Heraldic Shield Body */}
      <path
        d="M24 3L40 7.5V20.5C40 31.8 33.2 41.5 24 45C14.8 41.5 8 31.8 8 20.5V7.5L24 3Z"
        fill="url(#mcShieldGreen)"
        stroke="url(#mcShieldGold)"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />

      {/* Inner Inset Verification Border */}
      <path
        d="M24 6.5L37 10.2V20C37 29.5 31.5 38 24 41.2C16.5 38 11 29.5 11 20V10.2L24 6.5Z"
        stroke="url(#mcShieldGold)"
        strokeWidth="0.75"
        strokeOpacity="0.6"
        fill="none"
      />

      {/* ── Central Balance Scales of Justice ── */}
      {/* Central Plinth / Pedestal */}
      <path
        d="M21 34H27M22.5 32H25.5V16.5H22.5"
        stroke="url(#mcShieldGold)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Top Finial / Four-Point Star */}
      <circle cx="24" cy="14" r="1.5" fill="url(#mcShieldGold)" />
      <path
        d="M24 10.5V13.5M22.5 12H25.5"
        stroke="url(#mcShieldGold)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Horizontal Crossbeam */}
      <path
        d="M14 17.5L24 16.5L34 17.5"
        stroke="url(#mcShieldGold)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Left Scale Suspension Strings */}
      <path
        d="M14 17.5L10.5 24M14 17.5L17.5 24"
        stroke="url(#mcShieldGold)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      {/* Left Pan */}
      <path
        d="M9.5 24C9.5 26.2 11.5 28 14 28C16.5 28 18.5 26.2 18.5 24H9.5Z"
        fill="url(#mcShieldGold)"
      />

      {/* Right Scale Suspension Strings */}
      <path
        d="M34 17.5L30.5 24M34 17.5L37.5 24"
        stroke="url(#mcShieldGold)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      {/* Right Pan */}
      <path
        d="M29.5 24C29.5 26.2 31.5 28 34 28C36.5 28 38.5 26.2 38.5 24H29.5Z"
        fill="url(#mcShieldGold)"
      />
    </svg>
  );
}

export default function Logo({
  size = "md",
  showWordmark = true,
  theme = "dark",
  className = "",
}: LogoProps) {
  const pixelSize =
    size === "sm" ? 28 : size === "md" ? 36 : size === "lg" ? 44 : 56;
  const textSize =
    size === "sm"
      ? "text-base"
      : size === "md"
      ? "text-lg"
      : size === "lg"
      ? "text-xl"
      : "text-2xl";

  const isLight = theme === "light";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Emblem */}
      <div className="shrink-0 transition-transform hover:scale-105 duration-200">
        <ShieldIcon size={pixelSize} />
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span
              className={`font-black tracking-tight ${textSize} ${
                isLight ? "text-white" : "text-[#14231C]"
              }`}
            >
              My Chamber
            </span>
            <span className="text-[#D4AF37] text-xs font-normal">✦</span>
          </div>
          <span
            className={`text-[9px] uppercase tracking-[0.2em] font-semibold mt-0.5 ${
              isLight ? "text-[#D4AF37]/80" : "text-[#163826]/75"
            }`}
          >
            Digital Chamber
          </span>
        </div>
      )}
    </div>
  );
}
