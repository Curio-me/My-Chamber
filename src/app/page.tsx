"use client";

import { useState, useEffect } from "react";
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
  BadgeCheck,
  Award,
  FileText,
  Copy,
  Menu,
  X,
  Mail,
  Download,
  MessageCircle,
  Briefcase,
  Layers,
  Sparkle,
} from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handleInput.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (clean) {
      router.push(`/dashboard?slug=${encodeURIComponent(clean)}`);
    } else {
      router.push("/dashboard");
    }
  };

  const copySampleLink = () => {
    navigator.clipboard.writeText("https://my-chamber.vercel.app/rajavikrant");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#14231C] selection:bg-[#1C4532] selection:text-white">
      {/* ── 1. Floating Capsule / Pill Navbar ────────────────────────────────── */}
      <header className="sticky top-4 z-50 px-4 sm:px-6 max-w-6xl mx-auto">
        <nav className="bg-white/95 backdrop-blur-md border border-[#E7E0D5] rounded-full px-5 py-3 shadow-sm flex items-center justify-between transition-all">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#163826] text-[#F3EFE6] flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
              <Scale className="w-4 h-4 text-[#E6D5B8]" />
            </div>
            <span className="font-extrabold text-[#14231C] text-lg tracking-tight">
              My Chamber<span className="text-[#163826] font-normal">✦</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-[13.5px] font-semibold text-[#526057]">
            <a href="#showcase" className="hover:text-[#14231C] transition-colors">
              Chambers 3D
            </a>
            <a href="#features" className="hover:text-[#14231C] transition-colors">
              Features
            </a>
            <a href="#qr-studio" className="hover:text-[#14231C] transition-colors">
              QR Studio
            </a>
            <Link href="/find" className="hover:text-[#14231C] transition-colors">
              Find Advocate
            </Link>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF3ED] text-[#163826] text-[11px] font-bold">
              100% Free
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-[#3F4D45] hover:text-[#14231C] text-sm font-semibold px-3 py-2 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] text-sm font-bold px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all hover:-translate-y-0.5 active:scale-95"
            >
              Sign up free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-[#F3EFE6] text-[#14231C]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white border border-[#E7E0D5] rounded-3xl p-5 shadow-xl flex flex-col gap-3">
            <a
              href="#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#3F4D45] py-2 border-b border-[#F0ECE4]"
            >
              Chambers 3D
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#3F4D45] py-2 border-b border-[#F0ECE4]"
            >
              Features
            </a>
            <a
              href="#qr-studio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#3F4D45] py-2 border-b border-[#F0ECE4]"
            >
              QR Code Studio
            </a>
            <Link
              href="/find"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#3F4D45] py-2 border-b border-[#F0ECE4]"
            >
              Find Advocate
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#3F4D45] py-2 border-b border-[#F0ECE4]"
            >
              Advocate Log In
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center bg-[#163826] text-white font-bold py-3 rounded-full shadow-sm text-sm"
            >
              Sign up free
            </Link>
          </div>
        )}
      </header>

      {/* ── 2. Split Hero Section (Linktree Signature Layout) ────────────────── */}
      <section className="pt-10 sm:pt-16 pb-14 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBF3ED] border border-[#D5E5DA] text-xs font-bold text-[#163826]">
              <Sparkles className="w-3.5 h-3.5 text-[#163826]" />
              <span>The Link in Bio for India&apos;s Legal Fraternity</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-[68px] font-black tracking-tight text-[#14231C] leading-[1.06]">
              A digital chamber built for you.
            </h1>

            <p className="text-base sm:text-lg text-[#526057] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Join advocates practicing in the Supreme Court, High Courts, and District Courts using My Chamber. One verified link for your visiting card QR code, 1-tap phonebook vCard, Bar Council credentials, and client consultations.
            </p>

            {/* Interactive Handle Claim Form */}
            <form
              onSubmit={handleClaim}
              className="max-w-md mx-auto lg:mx-0 flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 bg-white rounded-2xl sm:rounded-full border border-[#DCD5C9] shadow-sm focus-within:border-[#163826] focus-within:ring-2 focus-within:ring-[#163826]/15 transition-all"
            >
              <div className="flex items-center px-4 py-2 sm:py-0 flex-1">
                <span className="text-xs sm:text-sm font-semibold text-[#8C9890] select-none">
                  mychamber.in/
                </span>
                <input
                  type="text"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  placeholder="yourname"
                  className="w-full bg-transparent text-sm font-bold text-[#14231C] placeholder-[#AAB4AD] focus:outline-none ml-0.5"
                />
              </div>

              <button
                type="submit"
                className="bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold text-sm px-6 py-3.5 rounded-xl sm:rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Claim Chamber</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs font-semibold text-[#66756B]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#163826]" />
                <span>1 Advocate = 1 Profile</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-[#163826]" />
                <span>Bar Council Enrollment Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#163826]" />
                <span>100% Free Forever</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Luxury Phone Screen Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
              
              {/* Outer Phone Shell */}
              <div className="relative rounded-[44px] bg-[#0E1511] p-3 shadow-2xl border-4 border-[#253229]">
                
                {/* Screen Glass */}
                <div className="rounded-[36px] bg-[#FAF8F5] overflow-hidden border border-[#E3DDD2] p-5 space-y-4">
                  
                  {/* Phone Speaker & Camera Notch */}
                  <div className="flex justify-center mb-1">
                    <div className="w-20 h-4 bg-[#0E1511] rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1B2921]" />
                    </div>
                  </div>

                  {/* Profile Header */}
                  <div className="text-center space-y-2 pt-1">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-[#163826] to-[#2E6B4A] p-0.5 shadow-md">
                        <div className="w-full h-full rounded-full bg-[#1A2E23] flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                          <span className="tracking-wider">VS</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-[#163826] text-[#FAF7F2] rounded-full p-1 border-2 border-white shadow">
                        <BadgeCheck className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1.5">
                        <h2 className="font-extrabold text-[#14231C] text-lg">
                          Adv. Vikrant Sharma
                        </h2>
                      </div>
                      <p className="text-xs font-semibold text-[#163826]">
                        Supreme Court & Delhi High Court
                      </p>
                      <p className="text-[11px] text-[#707D75] font-mono mt-0.5">
                        Enrollment: D/1245/2018
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1 pt-1">
                      <span className="text-[10px] font-semibold bg-[#EBF3ED] text-[#163826] px-2 py-0.5 rounded-full">
                        Criminal Defense
                      </span>
                      <span className="text-[10px] font-semibold bg-[#EBF3ED] text-[#163826] px-2 py-0.5 rounded-full">
                        Corporate Writs
                      </span>
                      <span className="text-[10px] font-semibold bg-[#EBF3ED] text-[#163826] px-2 py-0.5 rounded-full">
                        NCLT
                      </span>
                    </div>
                  </div>

                  {/* Linktree-Style Action Links Stack */}
                  <div className="space-y-2 pt-2">
                    
                    {/* Action 1: Save Contact (vCard) */}
                    <div className="w-full bg-[#163826] text-white rounded-2xl py-3 px-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-[#1E4A33] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <UserPlus className="w-4 h-4 text-[#D8C7A5]" />
                        <span className="text-xs font-bold">Save Contact to Phone (.vcf)</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#A6BAAE]" />
                    </div>

                    {/* Action 2: WhatsApp Consultation */}
                    <div className="w-full bg-white border border-[#DED7CB] text-[#14231C] rounded-2xl py-3 px-4 flex items-center justify-between shadow-sm cursor-pointer hover:border-[#163826] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                        <span className="text-xs font-bold">WhatsApp Consultation</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#9DA9A1]" />
                    </div>

                    {/* Action 3: Chamber Office & Map */}
                    <div className="w-full bg-white border border-[#DED7CB] text-[#14231C] rounded-2xl py-3 px-4 flex items-center justify-between shadow-sm cursor-pointer hover:border-[#163826] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-[#163826]" />
                        <span className="text-xs font-bold">Chamber Office & Direction</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#9DA9A1]" />
                    </div>

                    {/* Action 4: Visiting Card QR Code */}
                    <div className="w-full bg-white border border-[#DED7CB] text-[#14231C] rounded-2xl py-3 px-4 flex items-center justify-between shadow-sm cursor-pointer hover:border-[#163826] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <QrCode className="w-4 h-4 text-[#163826]" />
                        <span className="text-xs font-bold">Scan Digital Visiting Card</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#9DA9A1]" />
                    </div>
                  </div>

                  {/* Micro Footer inside Phone */}
                  <div className="pt-2 text-center">
                    <p className="text-[10px] text-[#8C9890] font-medium flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#163826]" />
                      <span>Verified Bar Council Profile</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Pill on Card side */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-[#E0D8CB] rounded-2xl p-3 shadow-lg flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EBF3ED] flex items-center justify-center text-[#163826]">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#14231C]">Printable QR Studio</div>
                  <div className="text-[10px] text-[#6E7B72]">1000×1200 Acrylic Desk Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Quick Stats / Authority Strip ───────────────────────────────── */}
      <section className="border-y border-[#EAE3D6] bg-white py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#163826]">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-[#66756B] mt-0.5">
              Bar Verified Standards
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#163826]">1-Tap</div>
            <div className="text-xs sm:text-sm font-semibold text-[#66756B] mt-0.5">
              Direct vCard Save
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#163826]">High-Res</div>
            <div className="text-xs sm:text-sm font-semibold text-[#66756B] mt-0.5">
              Desk & Visiting Card QR
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#163826]">₹0</div>
            <div className="text-xs sm:text-sm font-semibold text-[#66756B] mt-0.5">
              Free For All Advocates
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Signature 3D Rotating Cards Section (Linktree Showcase) ──────── */}
      <section id="showcase" className="py-20 px-4 sm:px-6 bg-[#1746B3] text-white relative overflow-hidden">
        {/* Ambient background glow & decorative blur */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#2B60DD]/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#0F2E78]/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Section Indicator */}
          <div className="flex items-center justify-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0D2970]/80 border border-white/20 backdrop-blur-md shadow-lg text-xs font-bold text-[#D2E823]">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>360° Dynamic Chamber Showcase • Continuous Orbit</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
            
            {/* ── LEFT COLUMN: BOTH Advocate Cards Visible Simultaneously (Rotating 360°) ── */}
            <div className="lg:col-span-7 flex justify-center items-center py-6">
              <div className="relative w-full max-w-[620px] min-h-[580px] flex flex-row items-center justify-center gap-3 sm:gap-6 carousel-3d-stage">
                
                {/* Decorative 3D Floating Legal Prop (Gavel & Stand) */}
                <div className="hidden sm:block absolute -top-5 -left-4 z-0 opacity-80 pointer-events-none drop-shadow-2xl">
                  <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#E6D5B8] to-[#8C734B] flex items-center justify-center text-[#1C160C] font-black shadow-2xl rotate-[-18deg] border-2 border-white/40">
                    <Gavel className="w-8 h-8 text-[#2B1F11]" />
                  </div>
                </div>

                {/* ═════════════════════════════════════════════════════════════
                    CARD 1: ADV. VIKRANT SHARMA (SUPREME COURT • FOREST GREEN)
                    ═════════════════════════════════════════════════════════════ */}
                <div className="relative w-[165px] sm:w-[260px] md:w-[275px] h-[510px] sm:h-[550px] animate-card-spin-1">
                  
                  {/* FRONT FACE: Profile & Contact */}
                  <div className="absolute inset-0 card-face-front-side">
                    <div className="relative w-full h-full rounded-[36px] sm:rounded-[42px] p-3.5 sm:p-5 text-white shadow-2xl border-2 bg-gradient-to-b from-[#132B1F] via-[#0E2017] to-[#08140E] border-[#2C6246]/70 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden">
                      <div>
                        {/* Top Court Badge */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                          <div className="flex items-center gap-1">
                            <Scale className="w-3 h-3 text-[#D2E823]" />
                            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-white/90 truncate">
                              Supreme Court
                            </span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded-full bg-white/15 text-[8px] sm:text-[9px] font-mono font-bold text-white">
                            D/1245/18
                          </span>
                        </div>

                        {/* Headshot & Typographic Name */}
                        <div className="pt-3 text-center space-y-1.5">
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
                            <div className="w-full h-full rounded-2xl sm:rounded-3xl p-1 shadow-xl flex items-center justify-center bg-gradient-to-tr from-[#D2E823] to-[#163826]">
                              <div className="w-full h-full rounded-xl sm:rounded-[20px] bg-[#0A0D0B] flex flex-col items-center justify-center text-white overflow-hidden relative">
                                <div className="absolute top-1 w-4 h-2 bg-white rounded-b-sm border-t-2 border-black" />
                                <span className="font-black text-lg sm:text-xl tracking-wider pt-1">VS</span>
                              </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-[#D2E823] text-black font-extrabold p-0.5 sm:p-1 rounded-full shadow-lg border border-white">
                              <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-none drop-shadow-md">
                              VIKRANT
                            </h3>
                            <p className="text-[10px] sm:text-[11px] font-semibold text-white/80 mt-0.5">
                              Adv. Vikrant Sharma
                            </p>
                          </div>
                        </div>

                        {/* Tight Button Stack (6px gap) */}
                        <div className="space-y-1.5 pt-2.5">
                          <div className="w-full bg-white/15 backdrop-blur-md rounded-full py-1.5 px-2.5 text-center text-[9.5px] sm:text-[11px] font-bold hover:bg-white/20 transition-all border border-white/15 shadow-sm truncate">
                            ⚖️ Criminal Writs & Bail
                          </div>
                          <div className="w-full bg-white/15 backdrop-blur-md rounded-full py-1.5 px-2.5 text-center text-[9.5px] sm:text-[11px] font-bold hover:bg-white/20 transition-all border border-white/15 shadow-sm truncate">
                            🏛️ Chamber 402, Supreme Court
                          </div>
                          <div className="w-full bg-[#D2E823] text-[#0E1B13] rounded-full py-1.5 px-2.5 text-center text-[9.5px] sm:text-[11px] font-black shadow-md truncate">
                            📇 Save Direct Contact (.vcf)
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 text-center text-[9px] text-white/60 font-medium">
                        Verified Bar Council ID
                      </div>
                    </div>

                    {/* Popout Milestone Badge */}
                    <div className="hidden sm:block absolute -bottom-6 -left-6 w-[180px] z-30 animate-pop-card">
                      <div className="rounded-2xl bg-white text-[#14231C] p-2.5 shadow-xl border-2 border-white/80 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#163826]" />
                          <span className="text-[8px] font-black uppercase text-[#163826]">Milestone</span>
                        </div>
                        <p className="text-[9px] font-bold text-[#14231C] leading-tight">
                          Supreme Court SLP Brief
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE: Visiting Card QR & Chamber Details */}
                  <div className="absolute inset-0 card-face-back-side">
                    <div className="relative w-full h-full rounded-[36px] sm:rounded-[42px] p-4 sm:p-5 text-white shadow-2xl border-2 bg-gradient-to-b from-[#0E2017] via-[#091710] to-[#050C08] border-[#D2E823]/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col justify-between text-center overflow-hidden">
                      <div className="pt-2 space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-[#D2E823] font-bold">
                          Visiting Card QR
                        </span>
                        <h4 className="text-sm sm:text-base font-extrabold text-white">
                          Adv. Vikrant Sharma
                        </h4>
                      </div>

                      <div className="my-auto p-3 bg-white rounded-2xl w-32 sm:w-36 h-32 sm:h-36 mx-auto flex flex-col items-center justify-center text-[#14231C] shadow-lg">
                        <QrCode className="w-20 h-20 text-[#14231C]" />
                        <span className="text-[7.5px] font-mono font-bold text-gray-500 mt-1">
                          SCAN FOR VCARD
                        </span>
                      </div>

                      <div className="space-y-1 text-[9px] sm:text-[10px] text-white/80">
                        <p className="font-semibold">Chamber 402, Supreme Court</p>
                        <p className="font-mono text-[#D2E823]">D/1245/2018</p>
                      </div>
                    </div>
                  </div>
                </div>


                {/* ═════════════════════════════════════════════════════════════
                    CARD 2: ADV. ANANYA DESHMUKH (HIGH COURT • WINE CRIMSON)
                    ═════════════════════════════════════════════════════════════ */}
                <div className="relative w-[165px] sm:w-[260px] md:w-[275px] h-[510px] sm:h-[550px] animate-card-spin-2">
                  
                  {/* FRONT FACE: Profile & Contact */}
                  <div className="absolute inset-0 card-face-front-side">
                    <div className="relative w-full h-full rounded-[36px] sm:rounded-[42px] p-3.5 sm:p-5 text-white shadow-2xl border-2 bg-gradient-to-b from-[#8C2433] via-[#6B1724] to-[#450C15] border-[#FF8A9B]/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden">
                      <div>
                        {/* Top Court Badge */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-[#FFD2A6]" />
                            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-white/90 truncate">
                              Bombay High Court
                            </span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded-full bg-white/15 text-[8px] sm:text-[9px] font-mono font-bold text-white">
                            MAH/5621
                          </span>
                        </div>

                        {/* Headshot & Typographic Name */}
                        <div className="pt-3 text-center space-y-1.5">
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
                            <div className="w-full h-full rounded-2xl sm:rounded-3xl p-1 shadow-xl flex items-center justify-center bg-gradient-to-tr from-[#FFD2A6] to-[#8C2433]">
                              <div className="w-full h-full rounded-xl sm:rounded-[20px] bg-[#1E0509] flex flex-col items-center justify-center text-white overflow-hidden relative">
                                <div className="absolute top-1 w-4 h-2 bg-white rounded-b-sm border-t-2 border-black" />
                                <span className="font-black text-lg sm:text-xl tracking-wider pt-1">AD</span>
                              </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-[#FFD2A6] text-[#450C15] font-extrabold p-0.5 sm:p-1 rounded-full shadow-lg border border-white">
                              <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-none drop-shadow-md">
                              ANANYA
                            </h3>
                            <p className="text-[10px] sm:text-[11px] font-semibold text-white/80 mt-0.5">
                              Adv. Ananya Deshmukh
                            </p>
                          </div>
                        </div>

                        {/* Tight Button Stack (6px gap) */}
                        <div className="space-y-1.5 pt-2.5">
                          <div className="w-full bg-white/15 backdrop-blur-md rounded-full py-1.5 px-2.5 text-center text-[9.5px] sm:text-[11px] font-bold hover:bg-white/20 transition-all border border-white/15 shadow-sm truncate">
                            📊 IBC Restructuring & NCLT
                          </div>
                          <div className="w-full bg-white/15 backdrop-blur-md rounded-full py-1.5 px-2.5 text-center text-[9.5px] sm:text-[11px] font-bold hover:bg-white/20 transition-all border border-white/15 shadow-sm truncate">
                            🏛️ Chamber 18, High Court Fort
                          </div>
                          <div className="w-full bg-[#FFD2A6] text-[#3B0D14] rounded-full py-1.5 px-2.5 text-center text-[9.5px] sm:text-[11px] font-black shadow-md truncate">
                            📇 Save Direct Contact (.vcf)
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 text-center text-[9px] text-white/60 font-medium">
                        Verified Bar Council ID
                      </div>
                    </div>

                    {/* Popout Advisory Badge */}
                    <div className="hidden sm:block absolute -bottom-6 -left-6 w-[180px] z-30 animate-pop-card">
                      <div className="rounded-2xl bg-white text-[#14231C] p-2.5 shadow-xl border-2 border-white/80 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3 text-[#8C2433]" />
                          <span className="text-[8px] font-black uppercase text-[#8C2433]">Advisory</span>
                        </div>
                        <p className="text-[9px] font-bold text-[#14231C] leading-tight">
                          Commercial Arbitration
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE: Visiting Card QR & Chamber Details */}
                  <div className="absolute inset-0 card-face-back-side">
                    <div className="relative w-full h-full rounded-[36px] sm:rounded-[42px] p-4 sm:p-5 text-white shadow-2xl border-2 bg-gradient-to-b from-[#450C15] via-[#2F060D] to-[#1A0307] border-[#FFD2A6]/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col justify-between text-center overflow-hidden">
                      <div className="pt-2 space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-[#FFD2A6] font-bold">
                          Visiting Card QR
                        </span>
                        <h4 className="text-sm sm:text-base font-extrabold text-white">
                          Adv. Ananya Deshmukh
                        </h4>
                      </div>

                      <div className="my-auto p-3 bg-white rounded-2xl w-32 sm:w-36 h-32 sm:h-36 mx-auto flex flex-col items-center justify-center text-[#14231C] shadow-lg">
                        <QrCode className="w-20 h-20 text-[#14231C]" />
                        <span className="text-[7.5px] font-mono font-bold text-gray-500 mt-1">
                          SCAN FOR VCARD
                        </span>
                      </div>

                      <div className="space-y-1 text-[9px] sm:text-[10px] text-white/80">
                        <p className="font-semibold">Chamber 18, High Court Fort</p>
                        <p className="font-mono text-[#FFD2A6]">MAH/5621/2019</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── RIGHT COLUMN: High-Impact Copy & Actions ── */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <h2 className="text-3xl sm:text-5xl md:text-[54px] font-black tracking-tight leading-[1.06] text-[#D2E823]">
                Create and customize your chamber in minutes
              </h2>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal max-w-lg mx-auto lg:mx-0">
                Connect your Bar Council credentials, court appearances, office chambers, printable QR code, and client consultations in one verified link in bio. Customize every detail to match your practice.
              </p>

              {/* Bullet Features */}
              <div className="space-y-2.5 pt-1 text-left max-w-md mx-auto lg:mx-0">
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#D2E823] text-[#0D2970] flex items-center justify-center font-black mt-0.5 shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white/95">
                    <strong>1-Tap Direct vCard:</strong> Save mobile & chamber office into contact lists.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#D2E823] text-[#0D2970] flex items-center justify-center font-black mt-0.5 shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white/95">
                    <strong>1000×1200 QR Studio:</strong> Print-ready for desk stands and visiting cards.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#D2E823] text-[#0D2970] flex items-center justify-center font-black mt-0.5 shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white/95">
                    <strong>1 Advocate = 1 Profile:</strong> Mandatory Bar Council verified anti-duplicate shield.
                  </span>
                </div>
              </div>

              {/* Big Punchy Action Button */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D2E823] hover:bg-[#b8cc1c] text-[#0D2970] font-black text-sm px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Get started for free</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <Link
                  href="/find"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs px-5 py-3.5 rounded-full border border-white/20 transition-colors"
                >
                  <span>Explore Chambers</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/70" />
                </Link>
              </div>
            </div>

            {/* ── RIGHT COLUMN: High-Impact Typography & Action ── */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <h2 className="text-4xl sm:text-6xl md:text-[64px] font-black tracking-tight leading-[1.05] text-[#D2E823]">
                Create and customize your chamber in minutes
              </h2>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                Connect all your legal credentials across courts, chambers, phonebook vCard, and direct client consultations in one verified link in bio. Customize practice areas, consultation greetings, and visiting card QR codes to match your prestigious practice.
              </p>

              {/* Bullet Features */}
              <div className="space-y-3 pt-2 text-left max-w-md mx-auto lg:mx-0">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D2E823] text-[#0D2970] flex items-center justify-center font-black mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-white/95">
                    <strong>1-Tap Direct vCard:</strong> Clients save your mobile and chamber office straight into their phone contact list.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D2E823] text-[#0D2970] flex items-center justify-center font-black mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-white/95">
                    <strong>High-Resolution QR Studio:</strong> 1000×1200 print-ready QR codes for desk acrylic displays and physical visiting cards.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D2E823] text-[#0D2970] flex items-center justify-center font-black mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-white/95">
                    <strong>Bar Council Anti-Duplicate Guarantee:</strong> Strictly 1 profile per advocate enrollment number with dispute resolution.
                  </span>
                </div>
              </div>

              {/* Big Punchy Action Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D2E823] hover:bg-[#b8cc1c] text-[#0D2970] font-black text-base px-9 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Get started for free</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </Link>

                <Link
                  href="/find"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-6 py-4 rounded-full border border-white/20 transition-colors"
                >
                  <span>Explore Advocate Chambers</span>
                  <ExternalLink className="w-4 h-4 text-white/70" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. Bento Feature Grid ───────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#163826] bg-[#EBF3ED] px-3 py-1 rounded-full">
            Essential Chambers Infrastructure
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#14231C] tracking-tight">
            Everything an advocate needs. In one link.
          </h2>
          <p className="text-sm sm:text-base text-[#526057]">
            Tailored specifically to comply with Bar Council regulations while giving your clients a seamless, modern experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1: QR Code Studio */}
          <div id="qr-studio" className="bg-white rounded-3xl p-7 border border-[#E7E0D5] shadow-sm hover:border-[#163826]/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] flex items-center justify-center text-[#163826]">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#14231C]">
                Printable QR Code Studio
              </h3>
              <p className="text-xs sm:text-sm text-[#526057] leading-relaxed">
                Generate high-resolution (1000×1200) print-ready assets tailored for your physical visiting cards, client briefing folders, and chamber acrylic desk stands.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2EDE4] flex items-center justify-between text-xs font-bold text-[#163826]">
              <span>Includes SVG & PNG</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Feature 2: 1-Tap Direct vCard */}
          <div className="bg-white rounded-3xl p-7 border border-[#E7E0D5] shadow-sm hover:border-[#163826]/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] flex items-center justify-center text-[#163826]">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#14231C]">
                1-Tap vCard Phonebook Save
              </h3>
              <p className="text-xs sm:text-sm text-[#526057] leading-relaxed">
                Clients and instructing solicitors tap once to save your chamber address, phone, email, and bar designation straight into their Apple iPhone or Android contact list.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2EDE4] flex items-center justify-between text-xs font-bold text-[#163826]">
              <span>Zero manual typing</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Feature 3: Floating WhatsApp CTA */}
          <div className="bg-white rounded-3xl p-7 border border-[#E7E0D5] shadow-sm hover:border-[#163826]/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] flex items-center justify-center text-[#163826]">
                <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
              </div>
              <h3 className="text-xl font-bold text-[#14231C]">
                WhatsApp Consultation Greeting
              </h3>
              <p className="text-xs sm:text-sm text-[#526057] leading-relaxed">
                A persistent floating contact button with custom pre-formatted legal enquiry templates. Clients initiate structured consultations without awkward back-and-forth.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2EDE4] flex items-center justify-between text-xs font-bold text-[#163826]">
              <span>Instant client reach</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Feature 4: Single Profile Protection */}
          <div className="bg-white rounded-3xl p-7 border border-[#E7E0D5] shadow-sm hover:border-[#163826]/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] flex items-center justify-center text-[#163826]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#14231C]">
                1 Advocate = 1 Profile
              </h3>
              <p className="text-xs sm:text-sm text-[#526057] leading-relaxed">
                Strict mandatory Bar Council Enrollment verification. No duplicates or impersonation allowed. Built-in ownership claim & dispute queue to protect your reputation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2EDE4] flex items-center justify-between text-xs font-bold text-[#163826]">
              <span>Bar Council ID backed</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Feature 5: Google Knowledge Panel & SEO */}
          <div className="bg-white rounded-3xl p-7 border border-[#E7E0D5] shadow-sm hover:border-[#163826]/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] flex items-center justify-center text-[#163826]">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#14231C]">
                Google Knowledge Panel SEO
              </h3>
              <p className="text-xs sm:text-sm text-[#526057] leading-relaxed">
                Built-in Schema.org `Attorney` & `LegalService` structured data. Enhances your visibility when clients and corporate legal counsels search your name on Google.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2EDE4] flex items-center justify-between text-xs font-bold text-[#163826]">
              <span>Rich search results</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Feature 6: Chambers & Practice Areas */}
          <div className="bg-white rounded-3xl p-7 border border-[#E7E0D5] shadow-sm hover:border-[#163826]/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] flex items-center justify-center text-[#163826]">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#14231C]">
                Courts & Practice Jurisdictions
              </h3>
              <p className="text-xs sm:text-sm text-[#526057] leading-relaxed">
                Highlight your appearances across the Supreme Court of India, High Courts, NCLT, NGT, and District Courts with verified court hall chambers & office locations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2EDE4] flex items-center justify-between text-xs font-bold text-[#163826]">
              <span>Transparent credentials</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* ── 6. How It Works (3 Steps) ───────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 bg-white border-y border-[#EAE3D6]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-[#14231C]">
              Setup in 2 minutes
            </h2>
            <p className="text-sm text-[#526057]">
              No web development, no expensive agency fees, and no coding required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8]">
              <div className="w-10 h-10 rounded-full bg-[#163826] text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                1
              </div>
              <h4 className="text-base font-bold text-[#14231C]">Claim Your Name</h4>
              <p className="text-xs sm:text-sm text-[#526057] leading-relaxed">
                Sign in with Google 1-Tap or your email. Choose your unique profile handle (e.g. `mychamber.in/advocate_name`).
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8]">
              <div className="w-10 h-10 rounded-full bg-[#163826] text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                2
              </div>
              <h4 className="text-base font-bold text-[#14231C]">Enter Bar Enrollment</h4>
              <p className="text-xs sm:text-sm text-[#526057] leading-relaxed">
                Add your mandatory State Bar Council enrollment number to activate anti-impersonation protection and your verified badge.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8]">
              <div className="w-10 h-10 rounded-full bg-[#163826] text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                3
              </div>
              <h4 className="text-base font-bold text-[#14231C]">Download QR & Share</h4>
              <p className="text-xs sm:text-sm text-[#526057] leading-relaxed">
                Download your 1000×1200 print-ready QR code for your desk acrylic stand or visiting card, and add your link to your WhatsApp bio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Bottom Banner CTA (Linktree style) ───────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-[36px] bg-[#163826] p-8 sm:p-14 text-center space-y-6 shadow-xl text-[#FAF7F2]">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mx-auto">
            <Scale className="w-7 h-7 text-[#E6D5B8]" />
          </div>

          <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Claim your digital chamber today.
          </h3>

          <p className="text-sm sm:text-base text-[#D4DFD8] max-w-xl mx-auto leading-relaxed">
            Free forever. No credit card required. Keep your professional identity protected and readily accessible to clients across India.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#163826] font-bold text-sm px-8 py-3.5 rounded-full shadow-md hover:bg-[#F3EFE6] transition-all active:scale-95"
            >
              <span>Get started for free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={copySampleLink}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-6 py-3.5 rounded-full border border-white/20 transition-colors"
            >
              <span>{copiedLink ? "✓ Link Copied!" : "Copy Sample Profile Link"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 8. Clean Luxury Legal Footer ────────────────────────────────────── */}
      <footer className="border-t border-[#EAE3D6] py-10 px-4 sm:px-6 bg-[#F4EFEA] text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#14231C]">
          <div className="w-6 h-6 rounded-full bg-[#163826] flex items-center justify-center text-white">
            <Scale className="w-3.5 h-3.5 text-[#E6D5B8]" />
          </div>
          <span>My Chamber</span>
        </div>

        <p className="text-xs text-[#6B7870] max-w-md mx-auto leading-relaxed">
          The distinguished link in bio & digital chamber infrastructure for advocates in India. Bar Council compliant, mobile-first, and duplicate-proof.
        </p>

        <p className="text-[11px] text-[#8C9890] pt-2">
          © {new Date().getFullYear()} My Chamber • न्याय सबके लिए
        </p>
      </footer>
    </div>
  );
}
