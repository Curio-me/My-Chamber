"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, ArrowRight, Check, Scale, QrCode, Smartphone, Home, Search, Edit3 } from "lucide-react";
import Logo, { ShieldIcon } from "@/components/Logo";

interface UnclaimedChamberViewProps {
  slug: string;
}

export default function UnclaimedChamberView({ slug }: UnclaimedChamberViewProps) {
  const cleanSlug = (slug || "").toLowerCase().replace(/[^a-z0-9-_]/g, "");
  const claimUrl = `/login?slug=${encodeURIComponent(cleanSlug)}&tab=signup`;
  const [hasLocalDraft, setHasLocalDraft] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("virtual_chamber_advocate_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.slug && parsed.slug.toLowerCase() === cleanSlug.toLowerCase()) {
          setHasLocalDraft(true);
        }
      }
    } catch {}
  }, [cleanSlug]);

  // Format clean display name if it resembles a name (e.g. rajavikrant -> Adv. Raja Vikrant)
  const formattedName = cleanSlug
    ? cleanSlug
        .split(/[-_]/)
        .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
        .join(" ")
    : "Advocate";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#14231C] selection:bg-[#163826] selection:text-white flex flex-col justify-between font-sans">
      {/* ── 1. Minimal Header ────────────────────────────────────────────── */}
      <header className="px-6 py-5 max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo size="sm" />
        </Link>
        <Link
          href="/login"
          className="text-xs sm:text-sm font-semibold text-[#526057] hover:text-[#14231C] transition-colors"
        >
          Advocate Log In
        </Link>
      </header>

      {/* ── 2. Hero Claim Card ──────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg bg-white border border-[#E7E0D5] rounded-[36px] p-7 sm:p-11 shadow-sm text-center relative overflow-hidden">
          
          {/* Subtle Top Gold Glow Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          {/* Shield Emblem */}
          <div className="w-16 h-16 rounded-2xl bg-[#EBF3ED] text-[#163826] border border-[#163826]/15 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <ShieldIcon size={38} />
          </div>

          {/* Local Draft Notice if edited on this device */}
          {hasLocalDraft && (
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left flex items-center justify-between gap-3 shadow-2xs">
              <div className="min-w-0">
                <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Unpublished Local Draft Detected</span>
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  You have unsaved edits for this chamber on this device.
                </p>
              </div>
              <Link
                href={`/dashboard?slug=${encodeURIComponent(cleanSlug)}`}
                className="text-xs font-bold bg-[#163826] hover:bg-[#1E4A33] text-white px-3.5 py-1.5 rounded-full shrink-0 shadow-sm transition-all"
              >
                Open Studio
              </Link>
            </div>
          )}

          {/* Availability Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBF3ED] border border-[#163826]/20 text-[#163826] text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Digital Chamber Handle Available</span>
          </div>

          {/* Big Handle Headline */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231C] tracking-tight mb-2 break-all">
            mychamber.me/<span className="text-[#163826] underline decoration-[#D4AF37] decoration-2 underline-offset-4">{cleanSlug}</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#526057] leading-relaxed mb-6 max-w-md mx-auto">
            This official digital chamber address has not been registered yet. If you are{" "}
            <span className="font-semibold text-[#14231C]">Adv. {formattedName}</span>, claim this permanent address before another lawyer in your Bar Council registers it.
          </p>

          {/* Value Props Pill List */}
          <div className="bg-[#FAF8F5] border border-[#E7E0D5] rounded-2xl p-4 mb-7 text-left space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-[#3F4D45]">
              <div className="w-4 h-4 rounded-full bg-[#EBF3ED] text-[#163826] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span><strong>100% Free Forever</strong> for practicing Indian advocates</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#3F4D45]">
              <div className="w-4 h-4 rounded-full bg-[#EBF3ED] text-[#163826] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span><strong>Easily Highlight Your Work</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#3F4D45]">
              <div className="w-4 h-4 rounded-full bg-[#EBF3ED] text-[#163826] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span><strong>1-Tap Phonebook vCard</strong> & printable desk QR stand</span>
            </div>
          </div>

          {/* Primary CTA */}
          <Link
            href={claimUrl}
            className="w-full inline-flex items-center justify-center gap-2.5 bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold text-sm sm:text-base py-4 px-6 rounded-full shadow-sm hover:shadow transition-all active:scale-[0.98] group"
          >
            <span>Claim mychamber.me/{cleanSlug}</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Secondary Links */}
          <div className="mt-5 flex items-center justify-center gap-5 text-xs font-semibold text-[#6B7870]">
            <Link href="/" className="hover:text-[#14231C] flex items-center gap-1.5 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Go to Homepage</span>
            </Link>
            <span>•</span>
            <Link href="/demo" className="hover:text-[#14231C] flex items-center gap-1.5 transition-colors">
              <Scale className="w-3.5 h-3.5" />
              <span>View Sample Chamber</span>
            </Link>
          </div>
        </div>
      </main>

      {/* ── 3. Minimal Footer ────────────────────────────────────────────── */}
      <footer className="px-6 py-6 text-center text-xs text-[#8C9890] border-t border-[#E7E0D5]/60 max-w-5xl mx-auto w-full">
        <p>
          My Chamber • Official Digital Infrastructure for Indian Legal Advocates. Strictly compliant with Bar Council of India Rule 36.
        </p>
      </footer>
    </div>
  );
}
