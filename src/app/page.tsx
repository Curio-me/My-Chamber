"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scale,
  QrCode,
  UserPlus,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Globe,
  Landmark,
  Newspaper,
  Gavel,
  Check,
  Search,
  BookOpen,
  Clock,
  MapPin,
  ChevronRight,
  Share2,
  Layers,
  BadgeCheck,
  Award,
  FileText,
  Copy,
} from "lucide-react";
import Navbar from "@/components/Navbar";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [handleInput, setHandleInput] = useState("");

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handleInput.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (clean) {
      router.push(`/dashboard?slug=${encodeURIComponent(clean)}`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-[#f1f3f4] selection:bg-[#8ab4f8]/30 selection:text-white font-sans overflow-x-hidden">
      <Navbar />

      {/* ── 1. Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-28 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#1a73e8]/15 via-[#8ab4f8]/10 to-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Official Bar Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18191c] border border-[#2d3139] shadow-sm text-xs text-[#c4c7c5] animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Scale className="w-3.5 h-3.5 text-[#8ab4f8]" />
            <span className="font-semibold text-white">Virtual Chamber</span>
            <span className="text-[#9aa0a6]">•</span>
            <span className="text-[#8ab4f8]">Digital Profiles for Indian Advocates</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.12]">
            Every Advocate Deserves <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-[#d3e3fd] to-[#8ab4f8] bg-clip-text text-transparent">
              A Distinguished Virtual Chamber
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#9aa0a6] max-w-2xl leading-relaxed">
            Not every lawyer has a physical chamber. We empower India&apos;s advocates with a{" "}
            <strong className="text-white font-semibold">free, verified digital profile</strong>. Showcase your Bar Council credentials, courts of practice, landmark judgments, and let clients connect in 1-tap.
          </p>

          {/* Interactive "Claim Your Chamber Link" Input */}
          <form
            onSubmit={handleClaim}
            className="w-full max-w-md pt-2 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative w-full flex items-center bg-[#18191c] border border-[#343840] hover:border-[#8ab4f8]/60 focus-within:border-[#8ab4f8] rounded-2xl px-3.5 py-3 shadow-inner transition-colors">
              <span className="text-xs font-mono text-[#9aa0a6] select-none shrink-0">
                my-chamber.vercel.app/
              </span>
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                placeholder="your-name"
                className="w-full bg-transparent text-sm text-white font-mono placeholder-[#5f6368] focus:outline-none pl-1"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-[#8ab4f8] hover:bg-[#aecbfa] active:scale-95 text-[#0e0e10] font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-[#1a73e8]/20 transition-all"
            >
              <span>Claim Chamber</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Trust Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#9aa0a6]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-[#8ab4f8]" />
              <span>Bar Council Verified Integrity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Visiting Card Print-Ready</span>
            </div>
          </div>
        </div>

        {/* ── 2. Live Chamber Card Mockup ─────────────────────────────────────── */}
        <div className="mt-16 sm:mt-20 max-w-sm sm:max-w-md mx-auto relative group">
          {/* Subtle Frame Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#1a73e8]/30 via-purple-500/20 to-amber-500/25 rounded-[36px] blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />

          {/* Profile Card Mockup Frame */}
          <div className="relative bg-[#18191c] border border-[#343840] rounded-[32px] p-6 shadow-2xl space-y-5">
            {/* Top Bar inside card */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#202227] border border-[#343840] text-xs font-semibold text-white">
                <Scale className="w-3.5 h-3.5 text-[#8ab4f8]" />
                <span>Virtual Chamber</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Verified Bar Advocate
                </span>
              </div>
            </div>

            {/* Advocate Identity Info */}
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1e2330] to-[#11141c] border-2 border-[#8ab4f8]/50 flex items-center justify-center text-xl font-bold text-white shadow-md">
                RS
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-white">Adv. RajaVikrant Sharma</h3>
                  <BadgeCheck className="w-4 h-4 fill-[#1a73e8] text-white" />
                </div>
                <p className="text-xs text-[#9aa0a6] mt-0.5">
                  @rajavikrant • Bar: <span className="text-[#8ab4f8] font-mono font-medium">PH/7797/2025</span>
                </p>
                <p className="text-[11px] text-[#c4c7c5] font-medium mt-0.5">
                  Punjab and Haryana High Court
                </p>
              </div>
            </div>

            {/* Quick Consultation CTAs */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs shadow-sm">
                <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                <span className="truncate">WhatsApp</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#202227] border border-[#343840] text-white font-semibold text-xs">
                <Phone className="w-3.5 h-3.5 text-[#8ab4f8]" />
                <span>Call</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#1f293d] border border-[#8ab4f8]/30 text-[#8ab4f8] font-semibold text-xs">
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save .vcf</span>
              </div>
            </div>

            {/* Specialization Tags */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#9aa0a6] uppercase tracking-wider">
                Practice Areas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["Constitutional Law", "Civil Law", "Cyber Law", "Consumer Law"].map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#202227] border border-[#343840] text-[#dadce0]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Citation Card */}
            <div className="p-3 rounded-2xl bg-[#202227] border border-[#343840] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#18191c] flex items-center justify-center text-[#8ab4f8] shrink-0 border border-[#343840]">
                  <Gavel className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    Swiggy told to pay Rs 2,000 short delivery...
                  </p>
                  <p className="text-[10px] text-[#9aa0a6]">The Tribune India • Consumer Ruling</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#9aa0a6] shrink-0 ml-2" />
            </div>

            {/* Direct Link to Live Demo */}
            <div className="pt-1 text-center">
              <Link
                href="/rajavikrant"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs text-[#8ab4f8] hover:text-[#aecbfa] font-semibold transition-colors"
              >
                <span>View Full Live Chamber Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Feature Bento Grid ───────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 border-t border-[#2d3139]/60 bg-[#121316]">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-mono font-bold tracking-widest text-[#8ab4f8] uppercase">
              Everything An Advocate Needs
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built Specifically for the Indian Legal Profession
            </h3>
            <p className="text-sm sm:text-base text-[#9aa0a6]">
              A complete digital suite tailored for courtroom advocacy, visiting card integration, and legal pedigree.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Bento Card 1: Printable QR Code Studio */}
            <div className="bg-[#18191c] border border-[#2d3139] rounded-3xl p-6 sm:p-7 space-y-4 hover:border-[#8ab4f8]/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold shadow-md">
                <QrCode className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-[#8ab4f8] transition-colors">
                Printable QR Code Studio
              </h4>
              <p className="text-xs sm:text-sm text-[#9aa0a6] leading-relaxed">
                Download high-resolution 1000×1200 print-ready PNG badges. Hand them straight to your visiting card printing press, letterhead printers, or display in an acrylic desk standee.
              </p>
              <div className="pt-2 text-xs font-semibold text-amber-400 flex items-center gap-1">
                <span>Print-Ready for Acrylic Stands</span>
                <span>→</span>
              </div>
            </div>

            {/* Bento Card 2: 1-Tap Save Contact (.vcf) */}
            <div className="bg-[#18191c] border border-[#2d3139] rounded-3xl p-6 sm:p-7 space-y-4 hover:border-[#8ab4f8]/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-bold shadow-md">
                <UserPlus className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-[#8ab4f8] transition-colors">
                1-Tap &quot;Save Contact&quot; (.vcf)
              </h4>
              <p className="text-xs sm:text-sm text-[#9aa0a6] leading-relaxed">
                Clients tap once and your full contact card is saved to their phone contacts — including mobile number, chamber address, email, and Bar Council registration note.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>Compatible with iOS & Android</span>
                <span>→</span>
              </div>
            </div>

            {/* Bento Card 3: Floating WhatsApp Consultation */}
            <div className="bg-[#18191c] border border-[#2d3139] rounded-3xl p-6 sm:p-7 space-y-4 hover:border-[#8ab4f8]/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                <WhatsAppIcon className="w-6 h-6 fill-white" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-[#8ab4f8] transition-colors">
                WhatsApp Consultation CTA
              </h4>
              <p className="text-xs sm:text-sm text-[#9aa0a6] leading-relaxed">
                Persistent glassmorphic bottom bar as clients scroll judgments. Pre-fills a professional inquiry message so clients can consult regarding cases in 1 tap.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>Pre-filled Professional Messages</span>
                <span>→</span>
              </div>
            </div>

            {/* Bento Card 4: Google Knowledge Panel SEO */}
            <div className="bg-[#18191c] border border-[#2d3139] rounded-3xl p-6 sm:p-7 space-y-4 hover:border-[#8ab4f8]/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8ab4f8] to-[#1a73e8] flex items-center justify-center text-black font-bold shadow-md">
                <Search className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-[#8ab4f8] transition-colors">
                Google Knowledge Panel SEO
              </h4>
              <p className="text-xs sm:text-sm text-[#9aa0a6] leading-relaxed">
                Pre-configured Schema.org <code className="text-[#8ab4f8]">LegalService</code> structured data. Helps search engines index your bar enrollment, courts of practice, and sitelinks on Google.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#8ab4f8] flex items-center gap-1">
                <span>Structured Schema.org JSON-LD</span>
                <span>→</span>
              </div>
            </div>

            {/* Bento Card 5: Chamber Box Mover */}
            <div className="bg-[#18191c] border border-[#2d3139] rounded-3xl p-6 sm:p-7 space-y-4 hover:border-[#8ab4f8]/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-[#8ab4f8] transition-colors">
                Chamber Box Mover
              </h4>
              <p className="text-xs sm:text-sm text-[#9aa0a6] leading-relaxed">
                Total freedom over your profile layout. Position your Academic Qualifications above About, feature Judgment Citations at the top, or customize sequence in seconds.
              </p>
              <div className="pt-2 text-xs font-semibold text-indigo-300 flex items-center gap-1">
                <span>Drag & Drop Reordering</span>
                <span>→</span>
              </div>
            </div>

            {/* Bento Card 6: Anti-Duplicate Bar Protection */}
            <div className="bg-[#18191c] border border-[#2d3139] rounded-3xl p-6 sm:p-7 space-y-4 hover:border-[#8ab4f8]/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold shadow-md">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-[#8ab4f8] transition-colors">
                1 Profile Per Bar Council ID
              </h4>
              <p className="text-xs sm:text-sm text-[#9aa0a6] leading-relaxed">
                Mandatory & duplicate-proof enrollment numbers. Includes official Bar Council Certificate ID verification and instant claim dispute desk to protect legitimate advocates.
              </p>
              <div className="pt-2 text-xs font-semibold text-rose-300 flex items-center gap-1">
                <span>Dispute & Verification Desk</span>
                <span>→</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. How It Works Section ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs font-mono font-bold tracking-widest text-[#8ab4f8] uppercase">
            Simple 3-Step Setup
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Open Your Chamber In Under 2 Minutes
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-[#18191c] border border-[#2d3139] rounded-3xl p-6 sm:p-8 space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-[#8ab4f8]/20 text-[#8ab4f8] font-mono font-bold flex items-center justify-center text-sm border border-[#8ab4f8]/30">
              01
            </div>
            <h4 className="text-base font-bold text-white">Sign In & Claim Handle</h4>
            <p className="text-xs sm:text-sm text-[#9aa0a6] leading-relaxed">
              Use 1-click &quot;Continue with Google&quot;, Passwordless Magic Link, or your Bar Council ID to sign in.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#18191c] border border-[#2d3139] rounded-3xl p-6 sm:p-8 space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-400/30">
              02
            </div>
            <h4 className="text-base font-bold text-white">Add Courts & Credentials</h4>
            <p className="text-xs sm:text-sm text-[#9aa0a6] leading-relaxed">
              Select your practicing High Courts, District Courts, Bar Associations, academic degrees, and judgment citations.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#18191c] border border-[#2d3139] rounded-3xl p-6 sm:p-8 space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm border border-emerald-400/30">
              03
            </div>
            <h4 className="text-base font-bold text-white">Print QR or Share Link</h4>
            <p className="text-xs sm:text-sm text-[#9aa0a6] leading-relaxed">
              Download your 1000×1200 print-ready QR code for your visiting card and acrylic desk stand, or share your URL on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Call To Action (Bottom Banner) ────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-[36px] bg-gradient-to-br from-[#16171b] via-[#1a2030] to-[#16171b] border border-[#343840] p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8ab4f8] to-[#1a73e8] flex items-center justify-center text-black font-bold mx-auto shadow-xl">
            <Scale className="w-7 h-7" />
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Claim Your Official Virtual Chamber Today
          </h3>

          <p className="text-sm sm:text-base text-[#9aa0a6] max-w-xl mx-auto">
            Join advocates practicing across the Supreme Court, High Courts, and District Courts of India. Free forever. No technical skills required.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#0e0e10] font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-95"
            >
              <span>Create My Free Chamber</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/rajavikrant"
              target="_blank"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#202227] hover:bg-[#282a30] text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-[#343840] transition-colors"
            >
              <span>View Sample Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#9aa0a6]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. Minimal Legal Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-[#2d3139] py-10 px-4 sm:px-6 bg-[#0c0c0e] text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-white">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#8ab4f8] to-[#1a73e8] flex items-center justify-center text-black">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <span>Virtual Chamber</span>
        </div>

        <p className="text-xs text-[#9aa0a6] max-w-md mx-auto leading-relaxed">
          The distinguished digital profile infrastructure for advocates in India. Bar Council compliant, mobile-first, and duplicate-proof.
        </p>

        <p className="text-[11px] text-[#5f6368] pt-2">
          © {new Date().getFullYear()} Virtual Chamber • न्याय सबके लिए
        </p>
      </footer>
    </div>
  );
}
