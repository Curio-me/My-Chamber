"use client";

import { Advocate } from "@/lib/types";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  BadgeCheck,
  Scale,
  Calendar,
  Share2,
  Check,
  ExternalLink,
  ChevronRight,
  Navigation,
  QrCode,
  Sun,
  Moon,
  Box,
  RotateCw,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ProfileCardProps {
  advocate: Advocate;
}

// ── Brand SVGs ─────────────────────────────────────────────────────────────
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Initials Avatar ────────────────────────────────────────────────────────
function InitialsAvatar({ name, isDark }: { name: string; isDark: boolean }) {
  const initials = name
    .replace(/^Adv\.\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg transition-colors ${
        isDark
          ? "bg-gradient-to-br from-[#1e2330] to-[#11141c] border-[#18191c] text-[#e3e3e3]"
          : "bg-gradient-to-br from-[#e2e8f0] to-[#cbd5e1] border-white text-[#1e293b]"
      }`}
    >
      {initials}
    </div>
  );
}

export default function ProfileCard({ advocate }: ProfileCardProps) {
  // Theme state: defaults to advocate preference or dark
  const [isDark, setIsDark] = useState<boolean>(
    advocate.themePreference !== "light"
  );

  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // ── 3D Card Rotation State ────────────────────────────────────────────────
  const cardRef = useRef<HTMLDivElement>(null);
  const [is3DActive, setIs3DActive] = useState(advocate.enable3d ?? true);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  // Update theme if prop changes
  useEffect(() => {
    if (advocate.themePreference) {
      setIsDark(advocate.themePreference === "dark");
    }
  }, [advocate.themePreference]);

  const profileUrl =
    typeof window !== "undefined" ? window.location.href : "https://virtualchamber.in";

  const cleanMobile = advocate.mobile.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanMobile}`;
  const mapsUrl =
    advocate.mapUrl?.trim() ||
    (advocate.latitude && advocate.longitude
      ? `https://www.google.com/maps?q=${advocate.latitude},${advocate.longitude}`
      : `https://www.google.com/maps/search/${encodeURIComponent(advocate.officeAddress)}`);
  const mapsEmbedUrl =
    `https://www.google.com/maps?q=${encodeURIComponent(advocate.officeAddress || "Delhi, India")}&output=embed`;

  // 3D Parallax Mouse Tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is3DActive || isAutoSpinning || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth tilt: max 9 degrees for elegant professional depth
    const rotateX = -((y - centerY) / centerY) * 8.5;
    const rotateY = ((x - centerX) / centerX) * 8.5;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    if (isAutoSpinning) return;
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  // Toggle 360 degree showcase spin
  const trigger3DShowcase = () => {
    if (isAutoSpinning) {
      setIsAutoSpinning(false);
      setRotate({ x: 0, y: 0 });
      return;
    }
    setIsAutoSpinning(true);
    let angle = 0;
    const interval = setInterval(() => {
      angle += 4;
      setRotate({
        x: Math.sin((angle * Math.PI) / 180) * 8,
        y: Math.sin((angle * 2 * Math.PI) / 180) * 14,
      });
      if (angle >= 360) {
        clearInterval(interval);
        setIsAutoSpinning(false);
        setRotate({ x: 0, y: 0 });
      }
    }, 20);
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: advocate.fullName,
          text: `Virtual Chamber profile of ${advocate.fullName} (${advocate.enrollmentNo})`,
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user closed share dialog
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-start py-4 sm:py-8 px-2 sm:px-4 transition-colors duration-300 ${
        isDark ? "bg-[#0e0e10] text-[#f1f3f4]" : "bg-[#edf0f4] text-[#1e293b]"
      }`}
      style={{ perspective: "1400px" }}
    >
      {/* ── Floating 3D Controls Bar ────────────────────────────────────────── */}
      <div className="w-full max-w-[660px] flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#9aa0a6]">
          <span>Virtual Chamber</span>
          <span>•</span>
          <span className="text-[11px] font-mono">
            {is3DActive ? "3D Parallax Active" : "2D Flat View"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* 3D Spin Showcase Button */}
          <button
            onClick={trigger3DShowcase}
            title={isAutoSpinning ? "Stop 3D Showcase" : "3D Chamber Showcase Orbit"}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all ${
              isAutoSpinning
                ? "bg-[#8ab4f8] text-[#0e0e10] font-semibold border-[#8ab4f8]"
                : isDark
                ? "bg-[#18191c] hover:bg-[#24272c] text-[#c4c7c5] border-[#2d3139]"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
            }`}
          >
            <RotateCw className={`w-3 h-3 ${isAutoSpinning ? "animate-spin" : ""}`} />
            <span>3D Showcase</span>
          </button>

          {/* 3D Tilt On/Off Toggle */}
          <button
            onClick={() => setIs3DActive(!is3DActive)}
            title={is3DActive ? "Disable 3D tilt on hover" : "Enable 3D tilt on hover"}
            className={`p-1.5 rounded-full border transition-colors ${
              is3DActive
                ? isDark
                  ? "bg-[#1f293d] border-[#8ab4f8]/40 text-[#8ab4f8]"
                  : "bg-blue-50 border-blue-300 text-blue-600 shadow-sm"
                : isDark
                ? "bg-[#18191c] border-[#2d3139] text-[#9aa0a6]"
                : "bg-white border-slate-300 text-slate-400"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
          </button>

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={() => setIsDark(!isDark)}
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            className={`p-1.5 rounded-full border transition-colors ${
              isDark
                ? "bg-[#18191c] hover:bg-[#24272c] text-amber-400 border-[#2d3139]"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
            }`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Main Google Creator-Style Container with 3D Rotation ─────────── */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: is3DActive
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(0)`
            : "none",
          transition: isAutoSpinning
            ? "none"
            : "transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease",
          transformStyle: "preserve-3d",
        }}
        className={`relative w-full max-w-[660px] rounded-3xl overflow-hidden border shadow-2xl flex flex-col transition-colors duration-200 select-none ${
          isDark
            ? "bg-[#18191c] border-[#2d3139]/70 shadow-black/70"
            : "bg-white border-slate-200/90 shadow-slate-300/60"
        }`}
      >
        {/* ── Dynamic 3D Specular Light Glare Overlay ─────────────────────── */}
        {is3DActive && (
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-3xl"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, ${
                isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.35)"
              }, transparent 65%)`,
            }}
          />
        )}

        {/* ── Top Cover Banner with Top Bar ───────────────────────────────── */}
        <div
          className="relative h-36 sm:h-44 w-full bg-cover bg-center overflow-hidden transition-all duration-300"
          style={
            advocate.bannerUrl
              ? { backgroundImage: `url(${advocate.bannerUrl})` }
              : undefined
          }
        >
          {advocate.bannerUrl ? (
            <div
              className={`absolute inset-0 bg-gradient-to-b ${
                isDark
                  ? "from-black/60 via-black/30 to-[#18191c]"
                  : "from-black/40 via-black/20 to-white"
              }`}
            />
          ) : (
            <div
              className={`absolute inset-0 ${
                isDark
                  ? "bg-gradient-to-r from-[#192233] via-[#121622] to-[#1c182a]"
                  : "bg-gradient-to-r from-[#dbeafe] via-[#eff6ff] to-[#f1f5f9]"
              }`}
            >
              <div
                className={`absolute inset-0 opacity-20 ${
                  isDark
                    ? "bg-[radial-gradient(#8ab4f8_1px,transparent_1px)]"
                    : "bg-[radial-gradient(#3b82f6_1px,transparent_1px)]"
                } [background-size:16px_16px]`}
              />
              <div
                className={`absolute -right-8 -bottom-10 w-44 h-44 rounded-full blur-2xl ${
                  isDark ? "bg-[#8ab4f8]/10" : "bg-blue-300/30"
                }`}
              />
            </div>
          )}

          {/* Top navigation actions */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-5 pt-3 sm:pt-4">
            <div
              className={`flex items-center gap-2 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm ${
                isDark
                  ? "bg-[#18191c]/80 border-white/10 text-[#f1f3f4]"
                  : "bg-white/90 border-slate-200 text-slate-800"
              }`}
            >
              <Scale className={`w-4 h-4 ${isDark ? "text-[#8ab4f8]" : "text-blue-600"}`} />
              <span className="text-xs font-semibold tracking-wide">
                Virtual Chamber
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* QR Button */}
              <button
                onClick={() => setShowQr(!showQr)}
                title="Show QR Code"
                className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors shadow-sm ${
                  isDark
                    ? "bg-[#18191c]/80 hover:bg-[#282a2e] text-white border-white/10"
                    : "bg-white/90 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <QrCode className="w-4 h-4" />
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                title="Share Profile"
                className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors shadow-sm ${
                  isDark
                    ? "bg-[#18191c]/80 hover:bg-[#282a2e] text-white border-white/10"
                    : "bg-white/90 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Profile Header Section ───────────────────────────────────────── */}
        <div className="px-5 sm:px-7 pt-0 pb-5">
          {/* Avatar with offset overlapping banner */}
          <div className="relative -mt-10 sm:-mt-12 mb-3 inline-block">
            {advocate.photoUrl ? (
              <img
                src={advocate.photoUrl}
                alt={advocate.fullName}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 shadow-lg ${
                  isDark ? "border-[#18191c]" : "border-white"
                }`}
              />
            ) : (
              <InitialsAvatar name={advocate.fullName} isDark={isDark} />
            )}
            {advocate.isVerified && (
              <div
                className={`absolute bottom-1 right-1 p-1 rounded-full border-2 text-white shadow-sm ${
                  isDark
                    ? "bg-[#1a73e8] border-[#18191c]"
                    : "bg-blue-600 border-white"
                }`}
                title="Verified Bar Advocate"
              >
                <BadgeCheck className="w-3.5 h-3.5 fill-white text-blue-600" />
              </div>
            )}
          </div>

          {/* Name & Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1
                className={`text-2xl sm:text-[26px] font-bold tracking-tight ${
                  isDark ? "text-[#f1f3f4]" : "text-slate-900"
                }`}
              >
                {advocate.fullName}
              </h1>
              {advocate.isVerified && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    isDark
                      ? "text-[#8ab4f8] bg-[#1f293d] border-[#8ab4f8]/20"
                      : "text-blue-700 bg-blue-50 border-blue-200"
                  }`}
                >
                  Advocate
                </span>
              )}
            </div>

            {/* Handle, Bar No. and Experience Line */}
            <p
              className={`text-[13px] sm:text-sm flex items-center flex-wrap gap-x-2 gap-y-1 ${
                isDark ? "text-[#9aa0a6]" : "text-slate-500"
              }`}
            >
              <span>@{advocate.slug}</span>
              <span>•</span>
              <span>Bar: {advocate.enrollmentNo}</span>
              <span>•</span>
              <span
                className={`font-medium ${
                  isDark ? "text-[#c4c7c5]" : "text-slate-700"
                }`}
              >
                {advocate.yearsExp}+ Years Experience
              </span>
            </p>
          </div>

          {/* ── Primary Action Pill ────────────────────────────────────────── */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 font-semibold text-sm py-2.5 px-5 rounded-full flex items-center justify-center gap-2 transition-colors border shadow-sm ${
                isDark
                  ? "bg-[#283244] hover:bg-[#323d52] text-[#d3e3fd] border-[#8ab4f8]/20"
                  : "bg-blue-600 hover:bg-blue-700 text-white border-blue-700"
              }`}
            >
              <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
              <span>Connect on WhatsApp</span>
            </a>

            <a
              href={`tel:${cleanMobile}`}
              className={`font-semibold text-sm py-2.5 px-6 rounded-full flex items-center justify-center gap-2 transition-colors border ${
                isDark
                  ? "bg-[#24272c] hover:bg-[#2d3137] text-[#e3e3e3] border-[#343840]"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
              }`}
            >
              <Phone
                className={`w-4 h-4 ${isDark ? "text-[#8ab4f8]" : "text-blue-600"}`}
              />
              <span>Call Chamber</span>
            </a>
          </div>

          {/* ── Quick Link Tiles (Instagram, LinkedIn, Directions) ─────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
            {advocate.instagramUrl && (
              <a
                href={advocate.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-2xl p-3 flex items-center gap-3 border transition-all group shadow-sm ${
                  isDark
                    ? "bg-[#24272c] hover:bg-[#2c3036] border-[#343840]/60"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0">
                  <InstagramIcon className="w-4 h-4 text-pink-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-semibold truncate ${
                      isDark ? "text-[#f1f3f4]" : "text-slate-800"
                    }`}
                  >
                    Instagram
                  </p>
                  <p
                    className={`text-[11px] truncate ${
                      isDark ? "text-[#9aa0a6]" : "text-slate-500"
                    }`}
                  >
                    {advocate.instagramUrl.replace("https://instagram.com/", "@")}
                  </p>
                </div>
              </a>
            )}

            {advocate.linkedinUrl && (
              <a
                href={advocate.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-2xl p-3 flex items-center gap-3 border transition-all group shadow-sm ${
                  isDark
                    ? "bg-[#24272c] hover:bg-[#2c3036] border-[#343840]/60"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#0077b5]/20 flex items-center justify-center shrink-0">
                  <LinkedinIcon className="w-4 h-4 text-[#0077b5]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-semibold truncate ${
                      isDark ? "text-[#f1f3f4]" : "text-slate-800"
                    }`}
                  >
                    LinkedIn
                  </p>
                  <p
                    className={`text-[11px] truncate ${
                      isDark ? "text-[#9aa0a6]" : "text-slate-500"
                    }`}
                  >
                    Professional Profile
                  </p>
                </div>
              </a>
            )}

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-2xl p-3 flex items-center gap-3 border transition-all group shadow-sm ${
                isDark
                  ? "bg-[#24272c] hover:bg-[#2c3036] border-[#343840]/60"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#ea4335]/20 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#ea4335]" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-semibold truncate ${
                    isDark ? "text-[#f1f3f4]" : "text-slate-800"
                  }`}
                >
                  Directions
                </p>
                <p
                  className={`text-[11px] truncate ${
                    isDark ? "text-[#9aa0a6]" : "text-slate-500"
                  }`}
                >
                  Google Maps
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* ── Main Content Cards ───────────────────────────────────────────── */}
        <div className="px-5 sm:px-7 pb-8 space-y-4">
          
          {/* ── QR Drawer Modal ───────────────────────────────────────────── */}
          {showQr && (
            <div
              className={`rounded-2xl p-4 border flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left transition-all ${
                isDark
                  ? "bg-[#202227] border-[#343840]"
                  : "bg-slate-50 border-slate-300 shadow-sm"
              }`}
            >
              <img
                src={`https://chart.googleapis.com/chart?chs=130x130&cht=qr&chl=${encodeURIComponent(
                  profileUrl
                )}&choe=UTF-8`}
                alt="QR Code"
                className="w-24 h-24 rounded-xl bg-white p-1.5 shadow"
              />
              <div className="flex-1 space-y-1">
                <p
                  className={`text-sm font-semibold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Scan Virtual Chamber Card
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-[#9aa0a6]" : "text-slate-500"
                  }`}
                >
                  Print this QR code on visiting cards, court documents, or
                  chamber letterheads for instant client access.
                </p>
                <button
                  onClick={() => setShowQr(false)}
                  className={`text-xs hover:underline pt-1 ${
                    isDark ? "text-[#8ab4f8]" : "text-blue-600"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* ── About Card ────────────────────────────────────────────────── */}
          <div
            className={`rounded-2xl p-5 border space-y-2 shadow-sm ${
              isDark
                ? "bg-[#202227] border-[#343840]/50"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <h2
              className={`text-sm font-semibold tracking-wide ${
                isDark ? "text-[#f1f3f4]" : "text-slate-900"
              }`}
            >
              About
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-[#c4c7c5]" : "text-slate-600"
              }`}
            >
              {advocate.bio}
            </p>
          </div>

          {/* ── Specializations & Practice Areas ──────────────────────────── */}
          <div
            className={`rounded-2xl p-5 border space-y-3 shadow-sm ${
              isDark
                ? "bg-[#202227] border-[#343840]/50"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2
                className={`text-sm font-semibold tracking-wide ${
                  isDark ? "text-[#f1f3f4]" : "text-slate-900"
                }`}
              >
                Specialized in Law
              </h2>
              <span
                className={`text-xs ${
                  isDark ? "text-[#9aa0a6]" : "text-slate-500"
                }`}
              >
                {advocate.specializations.length} Areas
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {advocate.specializations.map((spec) => (
                <span
                  key={spec}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border shadow-sm ${
                    isDark
                      ? "text-[#e3e3e3] bg-[#292c33] border-[#3b404a]"
                      : "text-slate-700 bg-white border-slate-300"
                  }`}
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Courts list inside card */}
            <div
              className={`pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                isDark ? "border-[#2d3138]" : "border-slate-200"
              }`}
            >
              <span
                className={`font-medium ${
                  isDark ? "text-[#9aa0a6]" : "text-slate-500"
                }`}
              >
                Courts of Practice:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {advocate.courts.map((court) => (
                  <span
                    key={court}
                    className={`text-[11px] px-2.5 py-1 rounded-md border ${
                      isDark
                        ? "text-[#c4c7c5] bg-[#18191c] border-[#2d3138]"
                        : "text-slate-700 bg-white border-slate-300 shadow-sm"
                    }`}
                  >
                    {court}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Direct Chamber Contact Card ───────────────────────────────── */}
          <div
            className={`rounded-2xl p-5 border space-y-3 shadow-sm ${
              isDark
                ? "bg-[#202227] border-[#343840]/50"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <h2
              className={`text-sm font-semibold tracking-wide ${
                isDark ? "text-[#f1f3f4]" : "text-slate-900"
              }`}
            >
              Chamber Contacts
            </h2>

            <div className="space-y-2">
              {/* Phone */}
              <a
                href={`tel:${cleanMobile}`}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors group shadow-sm ${
                  isDark
                    ? "bg-[#282a30] hover:bg-[#30333a] border-[#343840]/40"
                    : "bg-white hover:bg-slate-100 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isDark
                        ? "bg-[#18191c] text-[#8ab4f8]"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className={`text-xs ${
                        isDark ? "text-[#9aa0a6]" : "text-slate-400"
                      }`}
                    >
                      Direct Mobile / WhatsApp
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-[#f1f3f4]" : "text-slate-900"
                      }`}
                    >
                      {advocate.mobile}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-colors ${
                    isDark
                      ? "text-[#9aa0a6] group-hover:text-white"
                      : "text-slate-400 group-hover:text-slate-700"
                  }`}
                />
              </a>

              {/* Email */}
              <a
                href={`mailto:${advocate.email}`}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors group shadow-sm ${
                  isDark
                    ? "bg-[#282a30] hover:bg-[#30333a] border-[#343840]/40"
                    : "bg-white hover:bg-slate-100 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isDark
                        ? "bg-[#18191c] text-[#8ab4f8]"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className={`text-xs ${
                        isDark ? "text-[#9aa0a6]" : "text-slate-400"
                      }`}
                    >
                      Office Email
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-[#f1f3f4]" : "text-slate-900"
                      }`}
                    >
                      {advocate.email}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-colors ${
                    isDark
                      ? "text-[#9aa0a6] group-hover:text-white"
                      : "text-slate-400 group-hover:text-slate-700"
                  }`}
                />
              </a>

              {/* Office Phone if available */}
              {advocate.officePhone && (
                <div
                  className={`flex items-center justify-between p-3 rounded-xl border shadow-sm ${
                    isDark
                      ? "bg-[#282a30] border-[#343840]/40"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDark
                          ? "bg-[#18191c] text-[#9aa0a6]"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p
                        className={`text-xs ${
                          isDark ? "text-[#9aa0a6]" : "text-slate-400"
                        }`}
                      >
                        Landline Chamber Phone
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-[#f1f3f4]" : "text-slate-900"
                        }`}
                      >
                        {advocate.officePhone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Office Location & Google Map ──────────────────────────────── */}
          <div
            className={`rounded-2xl p-5 border space-y-3 shadow-sm ${
              isDark
                ? "bg-[#202227] border-[#343840]/50"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  className={`text-sm font-semibold tracking-wide ${
                    isDark ? "text-[#f1f3f4]" : "text-slate-900"
                  }`}
                >
                  Office Location
                </h2>
                <p
                  className={`text-xs mt-1 leading-relaxed ${
                    isDark ? "text-[#c4c7c5]" : "text-slate-600"
                  }`}
                >
                  {advocate.officeAddress}
                </p>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors shadow-sm ${
                  isDark
                    ? "text-[#8ab4f8] hover:text-[#aecbfa] bg-[#1a2333] border-[#8ab4f8]/30"
                    : "text-blue-600 hover:text-blue-700 bg-white border-blue-200"
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                Navigate
              </a>
            </div>

            {/* Embedded map card */}
            <div
              className={`rounded-xl overflow-hidden border h-48 shadow-inner ${
                isDark
                  ? "border-[#343840]/60 bg-[#121316]"
                  : "border-slate-200 bg-slate-100"
              }`}
            >
              <iframe
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: isDark ? "invert(90%) hue-rotate(180deg)" : "none",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
              />
            </div>
          </div>

          {/* ── Additional Socials (Twitter / Website) ─────────────────────── */}
          {(advocate.twitterUrl || advocate.websiteUrl) && (
            <div className="flex items-center gap-2 pt-1">
              {advocate.twitterUrl && (
                <a
                  href={advocate.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-colors shadow-sm ${
                    isDark
                      ? "bg-[#202227] hover:bg-[#282a30] border-[#343840]/50 text-[#c4c7c5] hover:text-white"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
                  }`}
                >
                  <TwitterIcon
                    className={`w-4 h-4 ${isDark ? "text-white" : "text-slate-900"}`}
                  />
                  <span>Twitter / X</span>
                </a>
              )}
              {advocate.websiteUrl && (
                <a
                  href={advocate.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-colors shadow-sm ${
                    isDark
                      ? "bg-[#202227] hover:bg-[#282a30] border-[#343840]/50 text-[#c4c7c5] hover:text-white"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
                  }`}
                >
                  <Globe
                    className={`w-4 h-4 ${isDark ? "text-[#8ab4f8]" : "text-blue-600"}`}
                  />
                  <span>Official Website</span>
                </a>
              )}
            </div>
          )}

          {/* ── Custom Link Cards (Articles, Judgments, Publications) ─────── */}
          {advocate.customLinks && advocate.customLinks.length > 0 && (
            <div
              className={`rounded-2xl p-5 border space-y-3 shadow-sm ${
                isDark
                  ? "bg-[#202227] border-[#343840]/50"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <h2
                className={`text-sm font-semibold tracking-wide ${
                  isDark ? "text-[#f1f3f4]" : "text-slate-900"
                }`}
              >
                Key Links & Publications
              </h2>
              <div className="space-y-2">
                {advocate.customLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3 rounded-xl border transition-colors group shadow-sm ${
                      isDark
                        ? "bg-[#282a30] hover:bg-[#30333a] border-[#343840]/40"
                        : "bg-white hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isDark
                            ? "bg-[#18191c] text-[#8ab4f8]"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-sm font-medium truncate ${
                          isDark ? "text-[#f1f3f4]" : "text-slate-900"
                        }`}
                      >
                        {link.title}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ml-2 transition-colors ${
                        isDark
                          ? "text-[#9aa0a6] group-hover:text-white"
                          : "text-slate-400 group-hover:text-slate-700"
                      }`}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── Minimal Google-Style Chamber Footer ───────────────────────── */}
          <div className="pt-6 pb-2 text-center space-y-3">
            <a
              href="/dashboard"
              className={`inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border transition-colors shadow-sm ${
                isDark
                  ? "bg-[#202227] hover:bg-[#282a30] text-[#c4c7c5] hover:text-white border-[#343840]"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
              }`}
            >
              <Scale
                className={`w-3.5 h-3.5 ${
                  isDark ? "text-[#8ab4f8]" : "text-blue-600"
                }`}
              />
              <span>Manage Virtual Chamber Studio</span>
            </a>

            <p
              className={`text-[11px] ${
                isDark ? "text-[#606368]" : "text-slate-400"
              }`}
            >
              Virtual Chamber • Free digital profiles for advocates in India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
