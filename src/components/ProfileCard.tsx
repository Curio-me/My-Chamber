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
  ArrowLeft,
  MoreVertical,
  QrCode,
} from "lucide-react";
import { useState } from "react";

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
function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .replace(/^Adv\.\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#1e2330] to-[#11141c] border-4 border-[#18191c] flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#e3e3e3] shadow-lg">
      {initials}
    </div>
  );
}

export default function ProfileCard({ advocate }: ProfileCardProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

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
    <div className="min-h-screen w-full bg-[#0e0e10] flex justify-center py-4 sm:py-8 px-2 sm:px-4">
      {/* ── Main Google Creator-Style Container (Wider: max-w-[660px]) ── */}
      <div className="w-full max-w-[660px] bg-[#18191c] rounded-3xl overflow-hidden border border-[#2d3139]/60 shadow-2xl flex flex-col">
        
        {/* ── Top Cover Banner with Top Bar ───────────────────────────────── */}
        <div
          className="relative h-36 sm:h-44 w-full bg-gradient-to-r from-[#192233] via-[#121622] to-[#1c182a] bg-cover bg-center overflow-hidden"
          style={advocate.bannerUrl ? { backgroundImage: `url(${advocate.bannerUrl})` } : undefined}
        >
          {advocate.bannerUrl ? (
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#18191c]" />
          ) : (
            <>
              {/* Subtle geometric pattern overlay */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8ab4f8_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute -right-8 -bottom-10 w-44 h-44 rounded-full bg-[#8ab4f8]/10 blur-2xl" />
            </>
          )}

          {/* Top navigation actions */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-5 pt-3 sm:pt-4">
            <div className="flex items-center gap-2 bg-[#18191c]/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Scale className="w-4 h-4 text-[#8ab4f8]" />
              <span className="text-xs font-semibold text-[#f1f3f4] tracking-wide">
                Virtual Chamber
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQr(!showQr)}
                title="Show QR Code"
                className="w-9 h-9 rounded-full bg-[#18191c]/80 hover:bg-[#282a2e] backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-colors"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <button
                onClick={handleShare}
                title="Share Profile"
                className="w-9 h-9 rounded-full bg-[#18191c]/80 hover:bg-[#282a2e] backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
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
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#18191c] shadow-lg"
              />
            ) : (
              <InitialsAvatar name={advocate.fullName} />
            )}
            {advocate.isVerified && (
              <div
                className="absolute bottom-1 right-1 bg-[#1a73e8] text-white p-1 rounded-full border-2 border-[#18191c]"
                title="Verified Bar Advocate"
              >
                <BadgeCheck className="w-3.5 h-3.5 fill-white text-[#1a73e8]" />
              </div>
            )}
          </div>

          {/* Name & Title (Google creator font sizing) */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-[26px] font-bold text-[#f1f3f4] tracking-tight">
                {advocate.fullName}
              </h1>
              {advocate.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8ab4f8] bg-[#1f293d] px-2.5 py-0.5 rounded-full border border-[#8ab4f8]/20">
                  Advocate
                </span>
              )}
            </div>

            {/* Handle, Bar No. and Experience Line */}
            <p className="text-[13px] sm:text-sm text-[#9aa0a6] flex items-center flex-wrap gap-x-2 gap-y-1">
              <span>@{advocate.slug}</span>
              <span>•</span>
              <span>Bar: {advocate.enrollmentNo}</span>
              <span>•</span>
              <span className="text-[#c4c7c5] font-medium">{advocate.yearsExp}+ Years Experience</span>
            </p>
          </div>

          {/* ── Primary Action Pill (Like Google's "+ Follow on Google") ───── */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#283244] hover:bg-[#323d52] active:bg-[#202937] text-[#d3e3fd] font-semibold text-sm py-2.5 px-5 rounded-full flex items-center justify-center gap-2 transition-colors border border-[#8ab4f8]/20 shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
              <span>Connect on WhatsApp</span>
            </a>

            <a
              href={`tel:${cleanMobile}`}
              className="bg-[#24272c] hover:bg-[#2d3137] text-[#e3e3e3] font-semibold text-sm py-2.5 px-6 rounded-full flex items-center justify-center gap-2 transition-colors border border-[#343840]"
            >
              <Phone className="w-4 h-4 text-[#8ab4f8]" />
              <span>Call Chamber</span>
            </a>
          </div>

          {/* ── Quick Link Tiles (Exact 3-Card Grid from Google Creator Profile) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
            {advocate.instagramUrl && (
              <a
                href={advocate.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#24272c] hover:bg-[#2c3036] rounded-2xl p-3 flex items-center gap-3 border border-[#343840]/60 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0">
                  <InstagramIcon className="w-4 h-4 text-pink-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#f1f3f4] group-hover:text-white truncate">
                    Instagram
                  </p>
                  <p className="text-[11px] text-[#9aa0a6] truncate">
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
                className="bg-[#24272c] hover:bg-[#2c3036] rounded-2xl p-3 flex items-center gap-3 border border-[#343840]/60 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#0077b5]/20 flex items-center justify-center shrink-0">
                  <LinkedinIcon className="w-4 h-4 text-[#38a0dc]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#f1f3f4] group-hover:text-white truncate">
                    LinkedIn
                  </p>
                  <p className="text-[11px] text-[#9aa0a6] truncate">Professional Profile</p>
                </div>
              </a>
            )}

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#24272c] hover:bg-[#2c3036] rounded-2xl p-3 flex items-center gap-3 border border-[#343840]/60 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#ea4335]/20 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#f28b82]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#f1f3f4] group-hover:text-white truncate">
                  Directions
                </p>
                <p className="text-[11px] text-[#9aa0a6] truncate">Google Maps</p>
              </div>
            </a>
          </div>
        </div>

        {/* ── Main Content Cards ───────────────────────────────────────────── */}
        <div className="px-5 sm:px-7 pb-8 space-y-4">
          
          {/* ── QR Drawer Modal (Expandable) ──────────────────────────────── */}
          {showQr && (
            <div className="bg-[#202227] rounded-2xl p-4 border border-[#343840] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left transition-all">
              <img
                src={`https://chart.googleapis.com/chart?chs=130x130&cht=qr&chl=${encodeURIComponent(profileUrl)}&choe=UTF-8`}
                alt="QR Code"
                className="w-24 h-24 rounded-xl bg-white p-1.5"
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-white">Scan Virtual Chamber Card</p>
                <p className="text-xs text-[#9aa0a6]">
                  Print this QR code on visiting cards, court documents, or chamber letterheads for instant client access.
                </p>
                <button
                  onClick={() => setShowQr(false)}
                  className="text-xs text-[#8ab4f8] hover:underline pt-1"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* ── About Card (Directly like Google Creator Profile) ─────────── */}
          <div className="bg-[#202227] rounded-2xl p-5 border border-[#343840]/50 space-y-2">
            <h2 className="text-sm font-semibold text-[#f1f3f4] tracking-wide">
              About
            </h2>
            <p className="text-sm text-[#c4c7c5] leading-relaxed">
              {advocate.bio}
            </p>
          </div>

          {/* ── Specializations & Practice Areas ──────────────────────────── */}
          <div className="bg-[#202227] rounded-2xl p-5 border border-[#343840]/50 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#f1f3f4] tracking-wide">
                Specialized in Law
              </h2>
              <span className="text-xs text-[#9aa0a6]">{advocate.specializations.length} Areas</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {advocate.specializations.map((spec) => (
                <span
                  key={spec}
                  className="text-xs font-medium text-[#e3e3e3] bg-[#292c33] border border-[#3b404a] px-3 py-1.5 rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Courts list inside card */}
            <div className="pt-3 border-t border-[#2d3138] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-[#9aa0a6] font-medium">Courts of Practice:</span>
              <div className="flex flex-wrap gap-1.5">
                {advocate.courts.map((court) => (
                  <span
                    key={court}
                    className="text-[11px] text-[#c4c7c5] bg-[#18191c] px-2.5 py-1 rounded-md border border-[#2d3138]"
                  >
                    {court}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Direct Chamber Contact Card ───────────────────────────────── */}
          <div className="bg-[#202227] rounded-2xl p-5 border border-[#343840]/50 space-y-3">
            <h2 className="text-sm font-semibold text-[#f1f3f4] tracking-wide">
              Chamber Contacts
            </h2>

            <div className="space-y-2">
              {/* Phone */}
              <a
                href={`tel:${cleanMobile}`}
                className="flex items-center justify-between p-3 rounded-xl bg-[#282a30] hover:bg-[#30333a] border border-[#343840]/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#18191c] flex items-center justify-center text-[#8ab4f8]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9aa0a6]">Direct Mobile / WhatsApp</p>
                    <p className="text-sm font-medium text-[#f1f3f4]">{advocate.mobile}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9aa0a6] group-hover:text-white" />
              </a>

              {/* Email */}
              <a
                href={`mailto:${advocate.email}`}
                className="flex items-center justify-between p-3 rounded-xl bg-[#282a30] hover:bg-[#30333a] border border-[#343840]/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#18191c] flex items-center justify-center text-[#8ab4f8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9aa0a6]">Office Email</p>
                    <p className="text-sm font-medium text-[#f1f3f4]">{advocate.email}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9aa0a6] group-hover:text-white" />
              </a>

              {/* Office Phone if available */}
              {advocate.officePhone && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#282a30] border border-[#343840]/40">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#18191c] flex items-center justify-center text-[#9aa0a6]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-[#9aa0a6]">Landline Chamber Phone</p>
                      <p className="text-sm font-medium text-[#f1f3f4]">{advocate.officePhone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Office Location & Google Map ──────────────────────────────── */}
          <div className="bg-[#202227] rounded-2xl p-5 border border-[#343840]/50 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[#f1f3f4] tracking-wide">
                  Office Location
                </h2>
                <p className="text-xs text-[#c4c7c5] mt-1 leading-relaxed">
                  {advocate.officeAddress}
                </p>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#8ab4f8] hover:text-[#aecbfa] bg-[#1a2333] border border-[#8ab4f8]/30 px-3 py-1.5 rounded-full transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                Navigate
              </a>
            </div>

            {/* Embedded map card */}
            <div className="rounded-xl overflow-hidden border border-[#343840]/60 h-48 bg-[#121316]">
              <iframe
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
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
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[#202227] hover:bg-[#282a30] border border-[#343840]/50 text-xs font-medium text-[#c4c7c5] hover:text-white transition-colors"
                >
                  <TwitterIcon className="w-4 h-4 text-white" />
                  <span>Twitter / X</span>
                </a>
              )}
              {advocate.websiteUrl && (
                <a
                  href={advocate.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[#202227] hover:bg-[#282a30] border border-[#343840]/50 text-xs font-medium text-[#c4c7c5] hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4 text-[#8ab4f8]" />
                  <span>Official Website</span>
                </a>
              )}
            </div>
          )}

          {/* ── Custom Link Cards (Articles, Judgments, Publications) ─────── */}
          {advocate.customLinks && advocate.customLinks.length > 0 && (
            <div className="bg-[#202227] rounded-2xl p-5 border border-[#343840]/50 space-y-3">
              <h2 className="text-sm font-semibold text-[#f1f3f4] tracking-wide">
                Key Links & Publications
              </h2>
              <div className="space-y-2">
                {advocate.customLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#282a30] hover:bg-[#30333a] border border-[#343840]/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#18191c] flex items-center justify-center text-[#8ab4f8] shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-[#f1f3f4] truncate">
                        {link.title}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9aa0a6] group-hover:text-white shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── Minimal Google-Style Chamber Footer ───────────────────────── */}
          <div className="pt-6 pb-2 text-center space-y-3">
            <a
              href="/login"
              className="inline-flex items-center gap-2 bg-[#202227] hover:bg-[#282a30] text-[#c4c7c5] hover:text-white text-xs font-medium px-4 py-2 rounded-full border border-[#343840] transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-[#8ab4f8]" />
              <span>Create your Virtual Chamber profile</span>
            </a>

            <p className="text-[11px] text-[#606368]">
              Virtual Chamber • Free digital profiles for advocates in India
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
