"use client";

import { Advocate, NewsMediaItem, DEFAULT_BOX_ORDER } from "@/lib/types";
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
  ChevronLeft,
  Navigation,
  QrCode,
  Sun,
  Moon,
  Box,
  RotateCw,
  Newspaper,
  Image as ImageIcon,
  Pin,
  Download,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Landmark,
  Briefcase,
  GraduationCap,
  Clock,
  UserPlus,
  X,
  Printer,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import LegalSchema from "./LegalSchema";

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

function NewsCarousel({
  items,
  isDark,
}: {
  items: NewsMediaItem[];
  isDark: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 220;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 320);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div
      className={`rounded-3xl p-5 border shadow-sm transition-colors ${
        isDark
          ? "bg-[#202227] border-[#343840]/60"
          : "bg-slate-50 border-slate-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 px-0.5">
        <div className="flex items-center gap-2">
          <Newspaper className={`w-4 h-4 ${isDark ? "text-[#8ab4f8]" : "text-blue-600"}`} />
          <h2
            className={`text-base font-bold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Newspaper & Press Coverage
          </h2>
        </div>

        <span
          className={`text-xs ${
            isDark ? "text-[#9aa0a6]" : "text-slate-500"
          }`}
        >
          {items.length} {items.length === 1 ? "story" : "stories"}
        </span>
      </div>

      {/* Relative wrapper for horizontal scroll + floating circular arrows */}
      <div className="relative group/carousel">
        {/* Left Floating Circular Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            type="button"
            aria-label="Scroll left"
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-gray-900 shadow-xl border border-gray-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Right Floating Circular Button */}
        {canScrollRight && items.length > 2 && (
          <button
            onClick={() => scroll("right")}
            type="button"
            aria-label="Scroll right"
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-gray-900 shadow-xl border border-gray-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Horizontal Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto scrollbar-none scroll-smooth pb-1 pt-1 -mx-1 px-1 snap-x snap-mandatory"
        >
          {items.map((item, idx) => (
            <a
              key={item.id || idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`snap-start shrink-0 w-[160px] sm:w-[175px] h-[245px] sm:h-[265px] rounded-[22px] overflow-hidden relative flex flex-col justify-between p-3.5 border transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl group select-none ${
                isDark
                  ? "bg-[#16171b] border-[#343840]/80 hover:border-[#8ab4f8]/60 shadow-black/50"
                  : "bg-slate-900 border-slate-700/60 hover:border-blue-400 shadow-slate-400/30"
              }`}
            >
              {/* Background Art / Image with Google Creator ambient dark styling */}
              {item.imageUrl ? (
                <>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/35" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1b2238] via-[#10141f] to-[#241a30]">
                  <div className="absolute top-2 right-2 w-24 h-24 rounded-full bg-[#8ab4f8]/20 blur-xl group-hover:bg-[#8ab4f8]/30 transition-all" />
                  <div className="absolute bottom-6 left-2 w-28 h-28 rounded-full bg-[#c9a84c]/20 blur-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                </div>
              )}

              {/* Top Row: Play / News Tag & External Indicator */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1 shadow-sm">
                  <span>📰</span>
                  <span className="truncate max-w-[85px]">
                    {item.date || "Order"}
                  </span>
                </span>

                <div className="w-5 h-5 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              {/* Middle / Center: Headline Title */}
              <div className="relative z-10 my-auto py-2">
                <h3 className="text-white text-[13px] sm:text-sm font-bold leading-snug line-clamp-4 drop-shadow group-hover:text-[#aecbfa] transition-colors">
                  {item.title}
                </h3>
              </div>

              {/* Bottom Row: Source Favicon + Publication Name + Pin Icon */}
              <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between gap-1 text-white">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shrink-0 shadow text-[8px] font-extrabold text-white">
                    {item.publication ? item.publication[0].toUpperCase() : "T"}
                  </div>
                  <span className="text-[11px] font-medium truncate text-white/90">
                    {item.publication || "The Tribune"}
                  </span>
                </div>

                <Pin className="w-3.5 h-3.5 text-white/80 shrink-0 transform rotate-45 group-hover:text-amber-400 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFloatingDismissed, setIsFloatingDismissed] = useState(false);

  // ── Option C: 3D Holographic / Prismatic Foil Sheen State ──────────
  const [is3DActive, setIs3DActive] = useState(false); // Default: strictly OFF (rock-solid 2D)
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const isTouchActive = useRef(false);

  // Update theme if prop changes
  useEffect(() => {
    if (advocate.themePreference) {
      setIsDark(advocate.themePreference === "dark");
    }
  }, [advocate.themePreference]);

  // Desktop Mouse tracking with Holographic Foil Sheen
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is3DActive || isAutoSpinning || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 8.5;
    const rotateY = ((x - centerX) / centerX) * 8.5;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.85,
    });
  };

  const handleMouseLeave = () => {
    if (isAutoSpinning) return;
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  // Mobile Touch tracking (allows dragging thumb on phone screen to shift foil sheen)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!is3DActive || isAutoSpinning || !cardRef.current || e.touches.length !== 1) return;
    isTouchActive.current = true;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -Math.min(Math.max(((y - centerY) / centerY) * 8.5, -12), 12);
    const rotateY = Math.min(Math.max(((x - centerX) / centerX) * 8.5, -12), 12);

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: Math.min(Math.max((x / rect.width) * 100, 10), 90),
      y: Math.min(Math.max((y / rect.height) * 100, 10), 90),
      opacity: 0.85,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!is3DActive || isAutoSpinning || !cardRef.current || e.touches.length !== 1) return;
    isTouchActive.current = true;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -Math.min(Math.max(((y - centerY) / centerY) * 8.5, -12), 12);
    const rotateY = Math.min(Math.max(((x - centerX) / centerX) * 11, -14), 14);

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: Math.min(Math.max((x / rect.width) * 100, 10), 90),
      y: Math.min(Math.max((y / rect.height) * 100, 10), 90),
      opacity: 0.85,
    });
  };

  const handleTouchEnd = () => {
    isTouchActive.current = false;
    if (!isAutoSpinning) {
      setRotate({ x: 0, y: 0 });
      setGlare((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  // Toggle 360 degree showcase spin
  const trigger3DShowcase = () => {
    if (isAutoSpinning) {
      setIsAutoSpinning(false);
      setRotate({ x: 0, y: 0 });
      setGlare((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    // Turn 3D foil ON when showcase is triggered
    setIs3DActive(true);
    setIsAutoSpinning(true);
    let angle = 0;
    const interval = setInterval(() => {
      angle += 3.5;
      setRotate({
        x: Math.sin((angle * Math.PI) / 180) * 8.5,
        y: Math.sin((angle * 2 * Math.PI) / 180) * 14,
      });
      setGlare({
        x: 50 + Math.sin((angle * 2 * Math.PI) / 180) * 40,
        y: 50 + Math.cos((angle * Math.PI) / 180) * 40,
        opacity: 0.85,
      });
      if (angle >= 360) {
        clearInterval(interval);
        setIsAutoSpinning(false);
        setRotate({ x: 0, y: 0 });
        setGlare((prev) => ({ ...prev, opacity: 0 }));
      }
    }, 20);
  };

  const cardRef = useRef<HTMLDivElement>(null);

  const [profileUrl, setProfileUrl] = useState(
    `https://mychamber.me/${advocate.slug || ""}`
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProfileUrl(window.location.href);
    }
  }, []);

  const cleanMobile = advocate.mobile.replace(/[^0-9]/g, "");
  const defaultWhatsAppMsg =
    advocate.whatsappGreeting?.trim() ||
    `Hello ${advocate.fullName}, I found your chamber profile on Virtual Chamber and would like to consult regarding a legal matter.`;
  const whatsappUrl = cleanMobile
    ? `https://wa.me/${cleanMobile}?text=${encodeURIComponent(defaultWhatsAppMsg)}`
    : "#";

  const mapsUrl =
    advocate.mapUrl?.trim() ||
    (advocate.latitude && advocate.longitude
      ? `https://www.google.com/maps?q=${advocate.latitude},${advocate.longitude}`
      : `https://www.google.com/maps/search/${encodeURIComponent(advocate.officeAddress)}`);
  const mapsEmbedUrl =
    `https://www.google.com/maps?q=${encodeURIComponent(advocate.officeAddress || "Delhi, India")}&output=embed`;

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
        setToastMessage("✓ Chamber profile link copied to clipboard!");
        setTimeout(() => {
          setCopied(false);
          setToastMessage(null);
        }, 2500);
      }
    } catch {
      // user closed share dialog
    }
  };

  const downloadVCard = () => {
    const cleanMobileNum = advocate.mobile.replace(/[^0-9+]/g, "");
    const cleanOfficeNum = advocate.officePhone ? advocate.officePhone.replace(/[^0-9+]/g, "") : "";
    const nameParts = advocate.fullName.replace(/^Adv\.\s*/i, "").trim().split(/\s+/);
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0] || "Advocate";

    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${lastName};${firstName};;;Adv.`,
      `FN:${advocate.fullName}`,
      `TITLE:Advocate`,
      `ORG:${advocate.courts?.[0] || "Advocate Chamber"}`,
      cleanMobileNum ? `TEL;TYPE=CELL,VOICE:${cleanMobileNum}` : "",
      cleanOfficeNum ? `TEL;TYPE=WORK,VOICE:${cleanOfficeNum}` : "",
      advocate.email ? `EMAIL;TYPE=INTERNET,WORK:${advocate.email}` : "",
      advocate.officeAddress
        ? `ADR;TYPE=WORK:;;${advocate.officeAddress.replace(/,/g, ";")};;;;`
        : "",
      `URL:${profileUrl}`,
      `NOTE:Virtual Chamber: ${profileUrl}\\nBar Registration: ${advocate.enrollmentNo || "Registered"}${
        advocate.barAssociations?.length ? `\\nEnrolled Bar: ${advocate.barAssociations.join(", ")}` : ""
      }${advocate.almaMater ? `\\nAlma Mater: ${advocate.almaMater}` : ""}${
        advocate.chamberHours ? `\\nChamber Timings: ${advocate.chamberHours}` : ""
      }`,
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${advocate.fullName.replace(/[^a-zA-Z0-9]/g, "_")}_Chamber.vcf`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage("✓ Chamber Contact (.vcf) downloaded! Tap file to save in Contacts.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const downloadQrPng = () => {
    const svg = document.getElementById("profile-qr-svg") as SVGGraphicsElement | null;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1200;

      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1000, 1200);

      // Outer border
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 14;
      ctx.strokeRect(35, 35, 930, 1130);

      // Gold / Blue double border accent
      ctx.strokeStyle = "#1a73e8";
      ctx.lineWidth = 4;
      ctx.strokeRect(52, 52, 896, 1096);

      // Header Title
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 44px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(advocate.fullName, 500, 140);

      // Bar council subtitle
      ctx.fillStyle = "#475569";
      ctx.font = "24px sans-serif";
      ctx.fillText(`Advocate • Bar Council: ${advocate.enrollmentNo || "Registered"}`, 500, 190);

      // Court name
      if (advocate.courts?.[0]) {
        ctx.fillStyle = "#1a73e8";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(advocate.courts[0], 500, 230);
      }

      // Draw QR Code in center
      ctx.drawImage(img, 175, 290, 650, 650);

      // Footer
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("SCAN TO CONNECT • VIRTUAL CHAMBER", 500, 1020);

      ctx.fillStyle = "#64748b";
      ctx.font = "20px sans-serif";
      ctx.fillText(profileUrl, 500, 1060);

      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `${advocate.fullName.replace(/[^a-zA-Z0-9]/g, "_")}_Chamber_QR.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();

      setToastMessage("✓ Chamber QR Code PNG downloaded (1000x1200px print ready)!");
      setTimeout(() => setToastMessage(null), 3500);
    };
    img.src = url;
  };

  return (
    <>
      <LegalSchema advocate={advocate} />
      <div
      className={`min-h-screen w-full flex flex-col items-center justify-start py-4 sm:py-8 px-2 sm:px-4 transition-colors duration-300 ${
        isDark ? "bg-[#0e0e10] text-[#f1f3f4]" : "bg-[#edf0f4] text-[#1e293b]"
      }`}
      style={{ perspective: "1500px" }}
    >
      {/* ── Floating 3D Controls Bar ────────────────────────────────────────── */}
      <div className="w-full max-w-[660px] flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#9aa0a6]">
          <span>Virtual Chamber</span>
          <span>•</span>
          <span className="text-[11px] font-mono text-[#8ab4f8]">
            {is3DActive ? "✦ Holographic Foil Active" : "2D Flat View"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Holographic Showcase Orbit Button */}
          <button
            onClick={trigger3DShowcase}
            title={
              isAutoSpinning
                ? "Stop 3D Showcase"
                : "3D Holographic Foil Showcase Orbit"
            }
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all font-semibold shadow-sm ${
              isAutoSpinning
                ? "bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 text-black font-extrabold border-transparent shadow-md shadow-pink-500/20"
                : isDark
                ? "bg-[#18191c] hover:bg-[#24272c] text-[#f1f3f4] border-[#2d3139]"
                : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300"
            }`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 ${
                isAutoSpinning ? "animate-spin text-black" : "text-amber-400"
              }`}
            />
            <span>{isAutoSpinning ? "Showcase Running" : "✦ Foil Showcase"}</span>
          </button>

          {/* 3D Foil Toggle (Off by default) */}
          <button
            onClick={() => setIs3DActive(!is3DActive)}
            title={
              is3DActive ? "Turn Holographic Foil off" : "Turn Holographic Foil on"
            }
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
              is3DActive
                ? isDark
                  ? "bg-[#1f293d] border-[#8ab4f8]/40 text-[#8ab4f8] shadow-sm shadow-[#8ab4f8]/10 font-medium"
                  : "bg-blue-50 border-blue-300 text-blue-600 shadow-sm font-medium"
                : isDark
                ? "bg-[#18191c] border-[#2d3139] text-[#9aa0a6]"
                : "bg-white border-slate-300 text-slate-400"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">
              {is3DActive ? "Foil ON" : "Foil OFF"}
            </span>
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

      {/* ── Main Google Creator-Style Container with Holographic Foil ──────── */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: is3DActive
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(0)`
            : "none",
          transition:
            isAutoSpinning || isTouchActive.current
              ? "none"
              : "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease",
          touchAction: "pan-y",
        }}
        className={`relative w-full max-w-[660px] rounded-3xl overflow-hidden border shadow-2xl flex flex-col transition-all duration-300 select-none ${
          is3DActive
            ? isDark
              ? "bg-[#16171b] border-[#8ab4f8]/50 shadow-[0_20px_60px_rgba(0,0,0,0.85)] ring-1 ring-[#8ab4f8]/30"
              : "bg-white border-blue-400/50 shadow-[0_20px_50px_rgba(59,130,246,0.2)] ring-1 ring-blue-300/40"
            : isDark
            ? "bg-[#18191c] border-[#2d3139]/70 shadow-black/70"
            : "bg-white border-slate-200/90 shadow-slate-300/60"
        }`}
      >
        {/* ── Option C: Apple Card Style Holographic Foil Sheen Overlays ──── */}
        {is3DActive && (
          <>
            {/* 1. Dynamic Iridescent Prismatic Foil Spectrum */}
            <div
              className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-3xl"
              style={{
                opacity: isDark ? 0.55 : 0.4,
                background: `linear-gradient(
                  ${115 + rotate.y * 3.5}deg,
                  transparent 10%,
                  rgba(255, 215, 0, 0.16) 22%,
                  rgba(56, 189, 248, 0.22) 35%,
                  rgba(236, 72, 153, 0.25) 48%,
                  rgba(168, 85, 247, 0.22) 62%,
                  rgba(52, 211, 153, 0.18) 75%,
                  rgba(251, 191, 36, 0.16) 88%,
                  transparent 98%
                )`,
                mixBlendMode: isDark ? "screen" : "color-dodge",
              }}
            />

            {/* 2. Apple Card Titanium Glare Sweep */}
            <div
              className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-3xl"
              style={{
                opacity: 0.5,
                background: `linear-gradient(
                  ${-40 + rotate.x * 2.8}deg,
                  transparent 25%,
                  rgba(255, 255, 255, 0.12) 46%,
                  rgba(255, 255, 255, 0.4) 50%,
                  rgba(255, 255, 255, 0.12) 54%,
                  transparent 75%
                )`,
                mixBlendMode: "overlay",
              }}
            />

            {/* 3. Dynamic Specular Light Follower */}
            <div
              className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-3xl"
              style={{
                opacity: glare.opacity * 0.9,
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, ${
                  isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.5)"
                }, transparent 55%)`,
                mixBlendMode: "overlay",
              }}
            />

            {/* 4. Luxury Holographic Edge / Prismatic Border Glow */}
            <div
              className="pointer-events-none absolute inset-0 z-20 rounded-3xl transition-all duration-300"
              style={{
                boxShadow: isDark
                  ? "inset 0 0 25px rgba(138, 180, 248, 0.2), 0 0 40px rgba(138, 180, 248, 0.25)"
                  : "inset 0 0 25px rgba(59, 130, 246, 0.15), 0 0 35px rgba(59, 130, 246, 0.2)",
              }}
            />
          </>
        )}

        {/* ── Top Header Navigation Bar ───────────────────────────────────── */}
        <div className="relative px-5 sm:px-7 pt-5 sm:pt-6 pb-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#2d3139]/40">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${
                isDark
                  ? "bg-[#202227] border-[#343840] text-[#f1f3f4]"
                  : "bg-slate-100 border-slate-200 text-slate-800"
              }`}
            >
              <Scale
                className={`w-4 h-4 ${isDark ? "text-[#8ab4f8]" : "text-blue-600"}`}
              />
              <span className="text-xs font-semibold tracking-wide">
                Virtual Chamber
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Save Contact vCard */}
              <button
                onClick={downloadVCard}
                title="Save Chamber Contact to Phone (.vcf)"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors shadow-sm ${
                  isDark
                    ? "bg-[#202227] hover:bg-[#282a2e] text-[#8ab4f8] border-[#343840]"
                    : "bg-slate-100 hover:bg-slate-200 text-blue-600 border-slate-200"
                }`}
              >
                <UserPlus className="w-4 h-4" />
              </button>

              {/* QR Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQr(true);
                }}
                title="Show QR Code"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all shadow-sm cursor-pointer active:scale-95 ${
                  isDark
                    ? "bg-[#202227] hover:bg-[#282a2e] text-white border-[#343840]"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                }`}
              >
                <QrCode className="w-4 h-4" />
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                title="Share Profile"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors shadow-sm ${
                  isDark
                    ? "bg-[#202227] hover:bg-[#282a2e] text-white border-[#343840]"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
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
          {/* Avatar with Verified Badge */}
          <div className="relative mb-3.5 inline-block group">
            {advocate.photoUrl ? (
              <img
                src={advocate.photoUrl}
                alt={advocate.fullName}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 transition-all duration-300 ${
                  is3DActive
                    ? isDark
                      ? "border-[#8ab4f8]/70 shadow-xl ring-2 ring-[#8ab4f8]/30"
                      : "border-blue-500/50 shadow-xl ring-2 ring-blue-400/30"
                    : isDark
                    ? "border-[#202227] shadow-lg"
                    : "border-slate-100 shadow-lg"
                }`}
              />
            ) : (
              <InitialsAvatar name={advocate.fullName} isDark={isDark} />
            )}
            {advocate.isVerified && (
              <div
                className={`absolute bottom-0 right-0 p-1.5 rounded-full border-2 text-white shadow-md ${
                  isDark
                    ? "bg-[#1a73e8] border-[#18191c]"
                    : "bg-blue-600 border-white"
                }`}
                title="Verified Bar Advocate"
              >
                <BadgeCheck className="w-4 h-4 fill-white text-blue-600" />
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

            {/* Chamber Hours badge */}
            {advocate.chamberHours && (
              <div className="pt-1">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${
                    isDark
                      ? "bg-[#18202e] border-[#8ab4f8]/25 text-[#aecbfa]"
                      : "bg-blue-50 border-blue-200 text-blue-900"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-medium">{advocate.chamberHours}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Primary Action Pill ────────────────────────────────────────── */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-full flex items-center justify-center gap-2 transition-colors border shadow-sm ${
                isDark
                  ? "bg-[#283244] hover:bg-[#323d52] text-[#d3e3fd] border-[#8ab4f8]/20"
                  : "bg-blue-600 hover:bg-blue-700 text-white border-blue-700"
              }`}
            >
              <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
              <span className="truncate">WhatsApp</span>
            </a>

            <a
              href={`tel:${cleanMobile}`}
              className={`font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-full flex items-center justify-center gap-2 transition-colors border ${
                isDark
                  ? "bg-[#24272c] hover:bg-[#2d3137] text-[#e3e3e3] border-[#343840]"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
              }`}
            >
              <Phone
                className={`w-4 h-4 ${isDark ? "text-[#8ab4f8]" : "text-blue-600"}`}
              />
              <span className="truncate">Call Chamber</span>
            </a>

            <button
              type="button"
              onClick={downloadVCard}
              title="Save Chamber Contact to Phone (.vcf)"
              className={`font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-full flex items-center justify-center gap-2 transition-colors border shadow-sm ${
                isDark
                  ? "bg-[#1f293d] hover:bg-[#28354f] text-[#8ab4f8] border-[#8ab4f8]/30"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span className="truncate">Save Contact</span>
            </button>
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
          
          {/* ── Dynamic Reorderable Profile Boxes (Box Mover) ─────────────── */}
          {(() => {
            const customOrder =
              advocate.boxOrder && advocate.boxOrder.length > 0
                ? advocate.boxOrder
                : DEFAULT_BOX_ORDER;
            const orderedBoxIds = Array.from(
              new Set([...customOrder, ...DEFAULT_BOX_ORDER])
            );

            const renderBox = (boxId: string) => {
              switch (boxId) {
                case "about":
                  if (!advocate.bio) return null;
                  return (
                    <div
                      key="box-about"
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
                  );

                case "specializations":
                  if (!advocate.specializations || advocate.specializations.length === 0)
                    return null;
                  return (
                    <div
                      key="box-specializations"
                      className={`rounded-2xl p-5 border space-y-3 shadow-sm ${
                        isDark
                          ? "bg-[#202227] border-[#343840]/50"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h2
                          className={`text-sm font-semibold tracking-wide flex items-center gap-2 ${
                            isDark ? "text-[#f1f3f4]" : "text-slate-900"
                          }`}
                        >
                          <Briefcase
                            className={`w-4 h-4 ${
                              isDark ? "text-[#8ab4f8]" : "text-blue-600"
                            }`}
                          />
                          <span>Specialized in Law</span>
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
                    </div>
                  );

                case "courts":
                  if (!advocate.courts || advocate.courts.length === 0) return null;
                  return (
                    <div
                      key="box-courts"
                      className={`rounded-2xl p-5 border space-y-3 shadow-sm ${
                        isDark
                          ? "bg-[#202227] border-[#343840]/50"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h2
                          className={`text-sm font-semibold tracking-wide flex items-center gap-2 ${
                            isDark ? "text-[#f1f3f4]" : "text-slate-900"
                          }`}
                        >
                          <Scale
                            className={`w-4 h-4 ${
                              isDark ? "text-[#8ab4f8]" : "text-blue-600"
                            }`}
                          />
                          <span>Courts of Practice</span>
                        </h2>
                        <span
                          className={`text-xs ${
                            isDark ? "text-[#9aa0a6]" : "text-slate-500"
                          }`}
                        >
                          {advocate.courts.length}{" "}
                          {advocate.courts.length === 1 ? "Court" : "Courts"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {advocate.courts.map((court) => (
                          <span
                            key={court}
                            className={`text-xs font-medium px-3 py-1.5 rounded-xl border shadow-sm ${
                              isDark
                                ? "text-[#e3e3e3] bg-[#18191c] border-[#343840]"
                                : "text-slate-800 bg-white border-slate-300"
                            }`}
                          >
                            {court}
                          </span>
                        ))}
                      </div>
                    </div>
                  );

                case "bar_associations":
                  if (!advocate.barAssociations || advocate.barAssociations.length === 0)
                    return null;
                  return (
                    <div
                      key="box-bar-associations"
                      className={`rounded-2xl p-5 border space-y-3 shadow-sm ${
                        isDark
                          ? "bg-[#202227] border-amber-500/20"
                          : "bg-amber-50/50 border-amber-200/80"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h2
                          className={`text-sm font-semibold tracking-wide flex items-center gap-2 ${
                            isDark ? "text-amber-400" : "text-amber-900"
                          }`}
                        >
                          <Landmark className="w-4 h-4 text-amber-400" />
                          <span>Enrolled Bar Associations</span>
                        </h2>
                        <span
                          className={`text-xs ${
                            isDark ? "text-amber-300/80" : "text-amber-800/80"
                          }`}
                        >
                          {advocate.barAssociations.length}{" "}
                          {advocate.barAssociations.length === 1
                            ? "Membership"
                            : "Memberships"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {advocate.barAssociations.map((assoc) => (
                          <span
                            key={assoc}
                            className={`text-xs font-medium px-3 py-1.5 rounded-xl border shadow-sm flex items-center gap-1.5 ${
                              isDark
                                ? "text-amber-200 bg-[#1c1f26] border-amber-400/25"
                                : "text-amber-950 bg-white border-amber-300 shadow-sm"
                            }`}
                          >
                            <Landmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{assoc}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );

                case "qualifications":
                  if (
                    (!advocate.qualifications || advocate.qualifications.length === 0) &&
                    !advocate.almaMater
                  )
                    return null;
                  return (
                    <div
                      key="box-qualifications"
                      className={`rounded-2xl p-5 border space-y-3 shadow-sm ${
                        isDark
                          ? "bg-[#202227] border-indigo-500/20"
                          : "bg-indigo-50/40 border-indigo-200/70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h2
                          className={`text-sm font-semibold tracking-wide flex items-center gap-2 ${
                            isDark ? "text-indigo-300" : "text-indigo-900"
                          }`}
                        >
                          <GraduationCap className="w-4 h-4 text-indigo-400" />
                          <span>Academic Qualifications & Alma Mater</span>
                        </h2>
                        {advocate.qualifications && advocate.qualifications.length > 0 && (
                          <span
                            className={`text-xs ${
                              isDark ? "text-indigo-300/80" : "text-indigo-800/80"
                            }`}
                          >
                            {advocate.qualifications.length}{" "}
                            {advocate.qualifications.length === 1 ? "Degree" : "Degrees"}
                          </span>
                        )}
                      </div>

                      {advocate.almaMater && (
                        <div
                          className={`text-xs px-3.5 py-2.5 rounded-xl border flex items-center gap-2 ${
                            isDark
                              ? "bg-[#1c1d29] border-indigo-500/25 text-indigo-200"
                              : "bg-white border-indigo-200 text-indigo-950 shadow-sm"
                          }`}
                        >
                          <span className="font-semibold text-indigo-400 shrink-0">
                            Alma Mater:
                          </span>
                          <span className="font-medium">{advocate.almaMater}</span>
                        </div>
                      )}

                      {advocate.qualifications && advocate.qualifications.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {advocate.qualifications.map((degree) => (
                            <span
                              key={degree}
                              className={`text-xs font-medium px-3 py-1.5 rounded-xl border shadow-sm flex items-center gap-1.5 ${
                                isDark
                                  ? "text-indigo-200 bg-[#191b24] border-indigo-400/20"
                                  : "text-indigo-950 bg-white border-indigo-300 shadow-sm"
                              }`}
                            >
                              <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>{degree}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );

                case "contact":
                  return (
                    <div
                      key="box-contact"
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
                                Direct Mobile
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
                  );

                case "location":
                  return (
                    <div
                      key="box-location"
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
                            filter: isDark
                              ? "invert(90%) hue-rotate(180deg)"
                              : "none",
                          }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Office Location Map"
                        />
                      </div>

                      {/* 1-Tap Google Maps Directions Action */}
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all shadow-sm ${
                          isDark
                            ? "bg-[#1f293d] hover:bg-[#28354f] text-[#8ab4f8] border-[#8ab4f8]/30"
                            : "bg-blue-600 hover:bg-blue-700 text-white border-blue-700"
                        }`}
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Get 1-Tap Directions in Google Maps</span>
                      </a>

                      {/* Additional Socials (Twitter / Website) */}
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
                                className={`w-4 h-4 ${
                                  isDark ? "text-white" : "text-slate-900"
                                }`}
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
                                className={`w-4 h-4 ${
                                  isDark ? "text-[#8ab4f8]" : "text-blue-600"
                                }`}
                              />
                              <span>Official Website</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );

                case "news_media":
                  if (!advocate.newsMedia || advocate.newsMedia.length === 0)
                    return null;
                  return (
                    <NewsCarousel
                      key="box-news-media"
                      items={advocate.newsMedia}
                      isDark={isDark}
                    />
                  );

                case "custom_links": {
                  if (!advocate.customLinks || advocate.customLinks.length === 0)
                    return null;

                  // Filter out empty or unconfigured dummy links
                  const validLinks = advocate.customLinks.filter(
                    (link) =>
                      link &&
                      link.title &&
                      link.title.trim().length > 0 &&
                      link.url &&
                      link.url.trim().length > 0 &&
                      link.url.trim() !== "https://"
                  );

                  if (validLinks.length === 0) return null;

                  return (
                    <div
                      key="box-custom-links"
                      className={`rounded-2xl p-5 border space-y-3 shadow-sm ${
                        isDark
                          ? "bg-[#202227] border-[#343840]/50"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h2
                          className={`text-sm font-semibold tracking-wide flex items-center gap-2 ${
                            isDark ? "text-[#f1f3f4]" : "text-slate-900"
                          }`}
                        >
                          <ExternalLink
                            className={`w-4 h-4 ${
                              isDark ? "text-[#8ab4f8]" : "text-blue-600"
                            }`}
                          />
                          <span>Additional Links & Judgments</span>
                        </h2>
                        <span
                          className={`text-xs ${
                            isDark ? "text-[#9aa0a6]" : "text-slate-500"
                          }`}
                        >
                          {validLinks.length}{" "}
                          {validLinks.length === 1
                            ? "Citation / Link"
                            : "Citations / Links"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {validLinks.map((link) => (
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
                  );
                }

                default:
                  return null;
              }
            };

            return orderedBoxIds.map((boxId) => renderBox(boxId));
          })()}

          {/* ── Minimal Google-Style Chamber Footer ───────────────────────── */}
          <div className="pt-6 pb-2 text-center space-y-3">
            <a
              href="/dashboard"
              className={`inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full border transition-all shadow-sm hover:scale-[1.02] ${
                isDark
                  ? "bg-[#202227] hover:bg-[#282a30] text-[#f1f3f4] border-[#343840] hover:border-[#8ab4f8]/50"
                  : "bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-sm"
              }`}
            >
              <Scale
                className={`w-3.5 h-3.5 ${
                  isDark ? "text-[#8ab4f8]" : "text-blue-600"
                }`}
              />
              <span>Create Your Own Chamber</span>
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

      {/* ── Floating Instant Consultation CTA Bar ────────────────────────────── */}
      {!isFloatingDismissed && (cleanMobile || advocate.email) && (
        <aside
          aria-label="Instant Consultation Bar"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-[480px] animate-in slide-in-from-bottom-5 duration-300"
        >
          <div
            className={`p-2 rounded-full border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-1.5 transition-colors ${
              isDark
                ? "bg-[#16171b]/92 border-[#343840] text-white shadow-black/80"
                : "bg-white/95 border-slate-300 text-slate-900 shadow-slate-400/50"
            }`}
          >
            {/* 1-Tap WhatsApp Consultation */}
            {cleanMobile ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-white shrink-0" />
                <span className="truncate">WhatsApp Consult</span>
              </a>
            ) : null}

            {/* 1-Tap Direct Call */}
            {cleanMobile ? (
              <a
                href={`tel:${cleanMobile}`}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full border text-xs font-semibold transition-colors shrink-0 active:scale-95 ${
                  isDark
                    ? "bg-[#24272c] hover:bg-[#2d3137] text-white border-[#343840]"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                }`}
                title="Call Chamber"
              >
                <Phone className="w-3.5 h-3.5 text-[#8ab4f8] shrink-0" />
                <span className="hidden sm:inline">Call</span>
              </a>
            ) : null}

            {/* Save Contact vCard */}
            <button
              onClick={downloadVCard}
              title="Save Chamber Contact to Phone (.vcf)"
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full border text-xs font-semibold transition-colors shrink-0 active:scale-95 ${
                isDark
                  ? "bg-[#1f293d] hover:bg-[#28354f] text-[#8ab4f8] border-[#8ab4f8]/30"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Save</span>
            </button>

            {/* Dismiss floating bar */}
            <button
              onClick={() => setIsFloatingDismissed(true)}
              title="Dismiss quick consultation bar"
              className={`p-1.5 rounded-full transition-colors shrink-0 ${
                isDark
                  ? "hover:bg-white/10 text-gray-400 hover:text-white"
                  : "hover:bg-slate-200 text-slate-400 hover:text-slate-700"
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* ── Official Chamber QR Code Modal (Rendered at root for true full-viewport overlay) ────── */}
      {showQr && (
        <div
          onClick={() => setShowQr(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-sm sm:max-w-md rounded-3xl p-6 border shadow-2xl transition-all ${
              isDark
                ? "bg-[#16171b] border-[#343840] text-[#f1f3f4]"
                : "bg-white border-[#E7E0D5] text-[#14231C]"
            }`}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowQr(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer ${
                isDark
                  ? "hover:bg-white/10 text-gray-400 hover:text-white"
                  : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
              }`}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-4">
              <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-[#163826] flex items-center justify-center text-[#E6D5B8] shadow-md">
                <QrCode className="w-5 h-5 font-bold" />
              </div>
              <h3 className="text-base sm:text-lg font-bold">Chamber QR Code</h3>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? "text-[#9aa0a6]" : "text-[#526057]"
                }`}
              >
                Print for visiting cards, letterheads & acrylic desk standees
              </p>
            </div>

            {/* High-Contrast Print Preview Card Frame */}
            <div className="bg-white p-5 rounded-2xl shadow-inner border border-slate-200 flex flex-col items-center text-center text-slate-900 mb-5">
              <p className="text-sm sm:text-base font-bold tracking-tight text-slate-900 mb-0.5">
                {advocate.fullName}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mb-3">
                Advocate • {advocate.enrollmentNo || "Bar Council Registered"}
              </p>

              <div suppressHydrationWarning className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                <QRCodeSVG
                  id="profile-qr-svg"
                  value={profileUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                  className="w-40 h-40 sm:w-48 sm:h-48"
                />
              </div>

              <p className="text-[10px] font-mono tracking-wider text-slate-400 mt-3 uppercase">
                Scan to Connect • My Chamber
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={downloadQrPng}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#E6D5B8]" />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-colors active:scale-95 cursor-pointer ${
                  isDark
                    ? "bg-[#202227] hover:bg-[#282a30] border-[#343840] text-white"
                    : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
                }`}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                <span>{copied ? "Link Copied!" : "Copy Link"}</span>
              </button>
            </div>

            <p
              className={`text-[11px] text-center mt-3 ${
                isDark ? "text-[#9aa0a6]" : "text-slate-500"
              }`}
            >
              PNG renders at 1000×1200 high-res, print-ready for printing presses.
            </p>
          </div>
        </div>
      )}

      {/* ── Toast Notification ──────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#16171b] text-[#f1f3f4] text-xs font-semibold px-4 py-2.5 rounded-full border border-[#8ab4f8]/50 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
    </>
  );
}
