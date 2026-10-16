"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Advocate, ALL_SPECIALIZATIONS, ALL_COURTS } from "@/lib/types";
import { EMPTY_ADVOCATE, DEMO_ADVOCATE } from "@/lib/demoData";
import ProfileCard from "@/components/ProfileCard";
import {
  Scale,
  Camera,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Edit3,
  Smartphone,
  Monitor,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  FileText,
  BadgeCheck,
  Briefcase,
  Share2,
} from "lucide-react";

const STORAGE_KEY = "virtual_chamber_advocate_profile";

// Curated banner background presets for advocates
const BANNER_PRESETS = [
  {
    name: "Classic Scales (Navy)",
    url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Modern Courtroom (Dark)",
    url: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Law Library Books",
    url: "https://images.unsplash.com/photo-1453733197781-791723bb7e77?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Obsidian Minimalist",
    url: "", // Uses the default geometric code pattern
  },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<Advocate>(EMPTY_ADVOCATE);
  const [savedStatus, setSavedStatus] = useState<"idle" | "saved">("idle");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [customTagInput, setCustomTagInput] = useState("");
  const [customCourtInput, setCustomCourtInput] = useState("");
  const [courtSearch, setCourtSearch] = useState("");
  const [customLangInput, setCustomLangInput] = useState("");

  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  // Load saved profile on mount if author previously created one
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch {
      // remains EMPTY_ADVOCATE
    }
  }, []);

  // Save handler
  const handleSave = async () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setSavedStatus("saved");
      setTimeout(() => setSavedStatus("idle"), 2500);

      // Also sync to server API
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      }).catch(() => {});
    } catch {
      alert("Failed to save to local storage.");
    }
  };

  // Reset to clean blank form
  const handleReset = () => {
    if (confirm("Clear all fields and start fresh with a blank chamber?")) {
      setProfile(EMPTY_ADVOCATE);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Optional: Fill sample template
  const handleLoadSample = () => {
    if (confirm("Load generic sample template to see how a complete profile looks?")) {
      setProfile(DEMO_ADVOCATE);
    }
  };

  // Handle local photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Please select an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile((prev) => ({ ...prev, photoUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local banner upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Please select a banner image smaller than 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile((prev) => ({ ...prev, bannerUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Tag toggles
  const toggleSpecialization = (spec: string) => {
    setProfile((prev) => {
      const exists = prev.specializations.includes(spec);
      return {
        ...prev,
        specializations: exists
          ? prev.specializations.filter((s) => s !== spec)
          : [...prev.specializations, spec],
      };
    });
  };

  const addCustomSpecialization = () => {
    if (!customTagInput.trim()) return;
    if (!profile.specializations.includes(customTagInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        specializations: [...prev.specializations, customTagInput.trim()],
      }));
    }
    setCustomTagInput("");
  };

  const toggleCourt = (court: string) => {
    setProfile((prev) => {
      const exists = prev.courts.includes(court);
      return {
        ...prev,
        courts: exists ? prev.courts.filter((c) => c !== court) : [...prev.courts, court],
      };
    });
  };

  const addCustomCourt = () => {
    if (!customCourtInput.trim()) return;
    if (!profile.courts.includes(customCourtInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        courts: [...prev.courts, customCourtInput.trim()],
      }));
    }
    setCustomCourtInput("");
  };

  const addCustomLanguage = () => {
    if (!customLangInput.trim()) return;
    if (!profile.languages.includes(customLangInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        languages: [...prev.languages, customLangInput.trim()],
      }));
    }
    setCustomLangInput("");
  };

  const removeLanguage = (lang: string) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };

  // Custom Links
  const addCustomLink = () => {
    const newLink = {
      id: Date.now().toString(),
      title: "Landmark Case Order / Article",
      url: "https://",
    };
    setProfile((prev) => ({
      ...prev,
      customLinks: [...(prev.customLinks || []), newLink],
    }));
  };

  const updateCustomLink = (id: string, field: "title" | "url", val: string) => {
    setProfile((prev) => ({
      ...prev,
      customLinks: (prev.customLinks || []).map((l) => (l.id === id ? { ...l, [field]: val } : l)),
    }));
  };

  const removeCustomLink = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      customLinks: (prev.customLinks || []).filter((l) => l.id !== id),
    }));
  };

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/adv/${profile.slug}`
      : `https://virtualchamber.in/adv/${profile.slug}`;

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-[#f1f3f4] flex flex-col font-sans">
      
      {/* ── Top Navigation Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#16171b]/95 backdrop-blur-md border-b border-[#2d3139] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8ab4f8] to-[#1a73e8] flex items-center justify-center text-[#0e0e10]">
                <Scale className="w-4 h-4 font-bold" />
              </div>
              <span className="font-bold text-sm tracking-tight hidden sm:inline">
                Virtual<span className="text-[#8ab4f8]">Chamber</span>
              </span>
            </Link>
            <span className="text-xs text-[#9aa0a6] hidden md:inline">|</span>
            <span className="text-xs font-medium text-[#c4c7c5] bg-[#202227] px-2.5 py-1 rounded-md border border-[#343840] hidden md:inline">
              Advocate Studio
            </span>
          </div>

          {/* Quick URL preview & copy */}
          <div className="hidden lg:flex items-center gap-2 bg-[#202227] px-3 py-1.5 rounded-full border border-[#343840] text-xs">
            <span className="text-[#9aa0a6]">Your Chamber:</span>
            <span className="text-[#8ab4f8] font-mono font-medium max-w-[220px] truncate">
              /{profile.slug}
            </span>
            <button
              onClick={copyPublicLink}
              className="text-[#c4c7c5] hover:text-white transition-colors ml-1"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden bg-[#202227] p-1 rounded-full border border-[#343840]">
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeTab === "edit" ? "bg-[#8ab4f8] text-[#0e0e10]" : "text-[#9aa0a6]"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                Edit
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeTab === "preview" ? "bg-[#8ab4f8] text-[#0e0e10]" : "text-[#9aa0a6]"
                }`}
              >
                <Eye className="w-3.5 h-3.5 inline mr-1" />
                Preview
              </button>
            </div>

            <button
              onClick={handleReset}
              title="Clear all fields and start fresh"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#9aa0a6] hover:text-rose-400 bg-[#202227] hover:bg-[#282a30] px-3 py-2 rounded-xl border border-[#343840] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>

            <button
              onClick={handleLoadSample}
              title="Load generic sample template"
              className="hidden md:flex items-center gap-1.5 text-xs text-[#9aa0a6] hover:text-[#8ab4f8] bg-[#202227] hover:bg-[#282a30] px-3 py-2 rounded-xl border border-[#343840] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sample Template</span>
            </button>

            <Link
              href={`/adv/${profile.slug}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#8ab4f8] hover:text-[#aecbfa] bg-[#1a2333] hover:bg-[#212c40] px-3.5 py-2 rounded-xl border border-[#8ab4f8]/30 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Card</span>
            </Link>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-[#8ab4f8] hover:bg-[#aecbfa] active:bg-[#729ee6] text-[#0e0e10] font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all"
            >
              {savedStatus === "saved" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-900" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ── Main Studio Body (Split View) ─────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── LEFT: Profile Editor Form (Cols 7 on Desktop) ────────────────── */}
        <div className={`space-y-6 lg:col-span-7 ${activeTab === "preview" ? "hidden lg:block" : "block"}`}>
          
          {/* Section 1: Basic Identity & Bar Details */}
          <div className="bg-[#18191c] rounded-2xl p-5 sm:p-6 border border-[#2d3139]/80 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#2d3139]">
              <Scale className="w-4 h-4 text-[#8ab4f8]" />
              <h2 className="text-sm font-semibold text-[#f1f3f4] uppercase tracking-wider">
                Advocate Identity & Enrollment
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
                  Full Name (with Prefix)
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="e.g. Adv. Your Full Name"
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3.5 py-2.5 text-sm text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
                  Chamber URL Slug
                </label>
                <div className="flex items-center bg-[#202227] border border-[#343840] rounded-xl px-3 py-2.5 text-sm focus-within:border-[#8ab4f8]">
                  <span className="text-[#9aa0a6] text-xs">/adv/</span>
                  <input
                    type="text"
                    value={profile.slug}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""),
                      })
                    }
                    placeholder="your-name-slug"
                    className="w-full bg-transparent text-sm text-[#f1f3f4] focus:outline-none pl-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
                  Bar Council Enrollment Number
                </label>
                <input
                  type="text"
                  value={profile.enrollmentNo}
                  onChange={(e) => setProfile({ ...profile, enrollmentNo: e.target.value })}
                  placeholder="e.g. D/1234/2020 or State Bar Number"
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3.5 py-2.5 text-sm text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="70"
                  value={profile.yearsExp}
                  onChange={(e) => setProfile({ ...profile, yearsExp: Number(e.target.value) || 0 })}
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3.5 py-2.5 text-sm text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>
            </div>

            {/* Verified toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#202227] border border-[#343840]/60">
              <div className="flex items-center gap-2.5">
                <BadgeCheck className="w-4 h-4 text-[#8ab4f8]" />
                <div>
                  <p className="text-xs font-semibold text-[#f1f3f4]">Bar Council Verified Badge</p>
                  <p className="text-[11px] text-[#9aa0a6]">Display official advocate verification mark</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profile.isVerified}
                onChange={(e) => setProfile({ ...profile, isVerified: e.target.checked })}
                className="w-4 h-4 accent-[#8ab4f8] rounded cursor-pointer"
              />
            </div>

            {/* Theme & 3D Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#2d3139]/60">
              {/* Default Theme */}
              <div className="p-3 rounded-xl bg-[#202227] border border-[#343840]/60 space-y-2">
                <p className="text-xs font-semibold text-[#f1f3f4]">Default Chamber Theme</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, themePreference: "dark" })}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                      profile.themePreference !== "light"
                        ? "bg-[#283244] border-[#8ab4f8] text-[#d3e3fd]"
                        : "bg-[#18191c] border-[#343840] text-[#9aa0a6]"
                    }`}
                  >
                    🌙 Dark Obsidian
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, themePreference: "light" })}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                      profile.themePreference === "light"
                        ? "bg-slate-100 border-blue-500 text-slate-900"
                        : "bg-[#18191c] border-[#343840] text-[#9aa0a6]"
                    }`}
                  >
                    ☀️ Clean Light
                  </button>
                </div>
              </div>

              {/* 3D Tilt Enable */}
              <div className="p-3 rounded-xl bg-[#202227] border border-[#343840]/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#f1f3f4]">3D Parallax Rotation</p>
                  <p className="text-[11px] text-[#9aa0a6]">3D tilt & specular glare on hover</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.enable3d ?? true}
                  onChange={(e) => setProfile({ ...profile, enable3d: e.target.checked })}
                  className="w-4 h-4 accent-[#8ab4f8] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Visuals (Photo & Cover Banner) */}
          <div className="bg-[#18191c] rounded-2xl p-5 sm:p-6 border border-[#2d3139]/80 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#2d3139]">
              <ImageIcon className="w-4 h-4 text-[#8ab4f8]" />
              <h2 className="text-sm font-semibold text-[#f1f3f4] uppercase tracking-wider">
                Photos & Background Visuals
              </h2>
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-xs font-medium text-[#9aa0a6] mb-2">
                Advocate Profile Photo
              </label>
              <div className="flex items-center gap-4">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt="Advocate Photo"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#8ab4f8] shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#202227] border border-[#343840] flex items-center justify-center text-xs text-[#9aa0a6] font-semibold">
                    Initials
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="file"
                      ref={photoFileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => photoFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#24272c] hover:bg-[#2c3138] text-[#f1f3f4] px-3 py-2 rounded-xl border border-[#343840] transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#8ab4f8]" />
                      Upload from Device
                    </button>
                    {profile.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, photoUrl: undefined })}
                        className="text-xs text-rose-400 hover:text-rose-300 px-2 py-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    value={profile.photoUrl || ""}
                    onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })}
                    placeholder="Or paste image URL (https://...)"
                    className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3 py-2 text-xs text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                  />
                </div>
              </div>
            </div>

            {/* Header Banner Background */}
            <div className="pt-2 border-t border-[#2d3139]/60">
              <label className="block text-xs font-medium text-[#9aa0a6] mb-2">
                Header Cover Banner Image
              </label>

              {/* Banner Preview */}
              <div
                className="w-full h-24 rounded-xl border border-[#343840] bg-gradient-to-r from-[#192233] via-[#121622] to-[#1c182a] bg-cover bg-center flex items-center justify-center relative overflow-hidden mb-3"
                style={profile.bannerUrl ? { backgroundImage: `url(${profile.bannerUrl})` } : undefined}
              >
                {!profile.bannerUrl && (
                  <span className="text-xs text-[#9aa0a6] bg-[#0e0e10]/80 px-3 py-1 rounded-full">
                    Default Obsidian Gradient
                  </span>
                )}
                {profile.bannerUrl && (
                  <button
                    onClick={() => setProfile({ ...profile, bannerUrl: undefined })}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-xs px-2.5 py-1 rounded-md"
                  >
                    Clear Banner
                  </button>
                )}
              </div>

              {/* Upload & Preset Options */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    onChange={handleBannerUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bannerFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#24272c] hover:bg-[#2c3138] text-[#f1f3f4] px-3 py-2 rounded-xl border border-[#343840] transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#8ab4f8]" />
                    Upload Cover Image
                  </button>
                  <input
                    type="url"
                    value={profile.bannerUrl || ""}
                    onChange={(e) => setProfile({ ...profile, bannerUrl: e.target.value })}
                    placeholder="Or paste banner image URL..."
                    className="flex-1 bg-[#202227] border border-[#343840] rounded-xl px-3 py-2 text-xs text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                  />
                </div>

                {/* Preset Banner Selector */}
                <div>
                  <p className="text-[11px] text-[#9aa0a6] mb-1.5 font-medium">Quick Legal Cover Presets:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BANNER_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setProfile({ ...profile, bannerUrl: preset.url || undefined })}
                        className={`text-left p-2 rounded-xl border text-xs transition-all ${
                          profile.bannerUrl === (preset.url || undefined)
                            ? "bg-[#283244] border-[#8ab4f8] text-[#d3e3fd]"
                            : "bg-[#202227] border-[#343840] text-[#c4c7c5] hover:border-[#4d525e]"
                        }`}
                      >
                        <p className="font-semibold truncate">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: About & Bio */}
          <div className="bg-[#18191c] rounded-2xl p-5 sm:p-6 border border-[#2d3139]/80 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#2d3139]">
              <FileText className="w-4 h-4 text-[#8ab4f8]" />
              <h2 className="text-sm font-semibold text-[#f1f3f4] uppercase tracking-wider">
                Professional Bio (About Section)
              </h2>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
                Chamber Introduction & Practice Overview
              </label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Write a brief introduction about your chamber, areas of legal expertise, and courtroom advocacy..."
                className="w-full bg-[#202227] border border-[#343840] rounded-xl p-3.5 text-sm text-[#f1f3f4] leading-relaxed focus:outline-none focus:border-[#8ab4f8]"
              />
              <p className="text-[11px] text-[#9aa0a6] mt-1 text-right">
                {profile.bio.length} characters
              </p>
            </div>
          </div>

          {/* Section 4: Practice Areas & Courts */}
          <div className="bg-[#18191c] rounded-2xl p-5 sm:p-6 border border-[#2d3139]/80 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#2d3139]">
              <Briefcase className="w-4 h-4 text-[#8ab4f8]" />
              <h2 className="text-sm font-semibold text-[#f1f3f4] uppercase tracking-wider">
                Specialized in Law & Courts
              </h2>
            </div>

            {/* Specializations selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[#9aa0a6]">
                  Select Practice Areas (Click to Toggle)
                </label>
                <span className="text-[11px] text-[#8ab4f8] font-semibold">
                  {profile.specializations.length} Selected
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-[#202227] rounded-xl border border-[#343840]">
                {ALL_SPECIALIZATIONS.map((spec) => {
                  const selected = profile.specializations.includes(spec);
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialization(spec)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                        selected
                          ? "bg-[#8ab4f8] text-[#0e0e10] font-semibold"
                          : "bg-[#292c33] text-[#c4c7c5] hover:bg-[#343840]"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {spec}
                    </button>
                  );
                })}
              </div>

              {/* Add custom specialization */}
              <div className="mt-2.5 flex gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSpecialization())}
                  placeholder="Add custom practice area (e.g. Armed Forces Tribunal, Insolvency...)"
                  className="flex-1 bg-[#202227] border border-[#343840] rounded-xl px-3 py-2 text-xs text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
                <button
                  type="button"
                  onClick={addCustomSpecialization}
                  className="bg-[#24272c] hover:bg-[#2c3138] text-[#8ab4f8] px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#343840]"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Courts selection */}
            <div className="pt-2 border-t border-[#2d3139]/60">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[#9aa0a6]">
                  Courts of Practice (All High Courts & Tribunals)
                </label>
                <span className="text-[11px] text-[#8ab4f8] font-semibold">
                  {profile.courts.length} Selected
                </span>
              </div>

              {/* Selected courts badges */}
              {profile.courts.length > 0 && (
                <div className="mb-2.5 flex flex-wrap gap-1.5 p-2 bg-[#202227] rounded-xl border border-[#343840]/60">
                  <span className="text-[11px] text-[#9aa0a6] py-1 self-center mr-1">Active:</span>
                  {profile.courts.map((court) => (
                    <span
                      key={court}
                      className="inline-flex items-center gap-1.5 bg-[#8ab4f8] text-[#0e0e10] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm"
                    >
                      {court}
                      <button
                        type="button"
                        onClick={() => toggleCourt(court)}
                        className="hover:text-rose-900 font-bold ml-0.5"
                        title="Remove Court"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Court search filter */}
              <div className="mb-2">
                <input
                  type="text"
                  value={courtSearch}
                  onChange={(e) => setCourtSearch(e.target.value)}
                  placeholder="🔍 Filter High Courts (e.g. Punjab, Delhi, Bombay, Madras...)"
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3 py-2 text-xs text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>

              {/* Scrollable list of ALL 25 High Courts & Tribunals */}
              <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto p-2.5 bg-[#202227] rounded-xl border border-[#343840] scrollbar-thin">
                {Array.from(new Set([...ALL_COURTS, ...profile.courts]))
                  .filter((court) =>
                    courtSearch.trim()
                      ? court.toLowerCase().includes(courtSearch.toLowerCase())
                      : true
                  )
                  .map((court) => {
                    const selected = profile.courts.includes(court);
                    return (
                      <button
                        key={court}
                        type="button"
                        onClick={() => toggleCourt(court)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                          selected
                            ? "bg-[#8ab4f8] text-[#0e0e10] font-semibold ring-1 ring-[#8ab4f8]"
                            : "bg-[#292c33] text-[#c4c7c5] hover:bg-[#343840] hover:text-white"
                        }`}
                      >
                        {selected ? "✓ " : "+ "}
                        {court}
                      </button>
                    );
                  })}
              </div>

              {/* Add custom local / district court */}
              <div className="mt-2.5 flex gap-2">
                <input
                  type="text"
                  value={customCourtInput}
                  onChange={(e) => setCustomCourtInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomCourt())}
                  placeholder="Or type custom court (e.g. Patiala House District Court, NCLT...)"
                  className="flex-1 bg-[#202227] border border-[#343840] rounded-xl px-3 py-2 text-xs text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
                <button
                  type="button"
                  onClick={addCustomCourt}
                  className="bg-[#24272c] hover:bg-[#2c3138] text-[#8ab4f8] px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#343840]"
                >
                  Add Court
                </button>
              </div>
            </div>

            {/* Languages */}
            <div className="pt-2 border-t border-[#2d3139]/60">
              <label className="block text-xs font-medium text-[#9aa0a6] mb-2">
                Languages Spoken
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {profile.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1.5 bg-[#202227] border border-[#343840] text-xs text-[#f1f3f4] px-3 py-1 rounded-lg"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      className="text-[#9aa0a6] hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLangInput}
                  onChange={(e) => setCustomLangInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomLanguage())}
                  placeholder="Add language (e.g. Hindi, English, Gujarati...)"
                  className="flex-1 bg-[#202227] border border-[#343840] rounded-xl px-3 py-2 text-xs text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
                <button
                  type="button"
                  onClick={addCustomLanguage}
                  className="bg-[#24272c] hover:bg-[#2c3138] text-[#8ab4f8] px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#343840]"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Contact Channels & Location */}
          <div className="bg-[#18191c] rounded-2xl p-5 sm:p-6 border border-[#2d3139]/80 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#2d3139]">
              <Phone className="w-4 h-4 text-[#8ab4f8]" />
              <h2 className="text-sm font-semibold text-[#f1f3f4] uppercase tracking-wider">
                Chamber Contact & Maps Location
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
                  Mobile Number (WhatsApp Enabled)
                </label>
                <input
                  type="text"
                  value={profile.mobile}
                  onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                  placeholder="e.g. +91-98XXXXXXXX"
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3.5 py-2.5 text-sm text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
                  Chamber Landline / Office Phone (Optional)
                </label>
                <input
                  type="text"
                  value={profile.officePhone || ""}
                  onChange={(e) => setProfile({ ...profile, officePhone: e.target.value })}
                  placeholder="e.g. 011-XXXXXXXX (Optional)"
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3.5 py-2.5 text-sm text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="e.g. advocate@yourchamber.in"
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3.5 py-2.5 text-sm text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#9aa0a6] mb-1.5">
                  Chamber Office Address
                </label>
                <textarea
                  rows={2}
                  value={profile.officeAddress}
                  onChange={(e) => setProfile({ ...profile, officeAddress: e.target.value })}
                  placeholder="e.g. Chamber No. __, Lawyers' Block, Court Complex, City"
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl p-3 text-sm text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[#9aa0a6] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8ab4f8]" />
                    Google Maps Location Link
                  </label>
                  {profile.mapUrl && (
                    <a
                      href={profile.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#8ab4f8] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Test Link
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={profile.mapUrl || ""}
                  onChange={(e) => setProfile({ ...profile, mapUrl: e.target.value })}
                  placeholder="Paste Google Maps share link (e.g. https://maps.app.goo.gl/... or https://maps.google.com/?q=...)"
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3.5 py-2.5 text-sm text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
                <p className="text-[11px] text-[#9aa0a6] mt-1.5 leading-relaxed">
                  💡 <span className="text-[#c4c7c5]">How to get:</span> Open Google Maps on phone or desktop, search your chamber or court complex, tap <strong>Share</strong>, copy the link, and paste it here.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Social & Custom Links */}
          <div className="bg-[#18191c] rounded-2xl p-5 sm:p-6 border border-[#2d3139]/80 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#2d3139]">
              <Share2 className="w-4 h-4 text-[#8ab4f8]" />
              <h2 className="text-sm font-semibold text-[#f1f3f4] uppercase tracking-wider">
                Social Profiles & Custom Links
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#9aa0a6] mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={profile.instagramUrl || ""}
                  onChange={(e) => setProfile({ ...profile, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/advocate_handle"
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3.5 py-2.5 text-sm text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9aa0a6] mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={profile.linkedinUrl || ""}
                  onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/advocate_handle"
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3.5 py-2.5 text-sm text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9aa0a6] mb-1">
                  Twitter / X Profile URL
                </label>
                <input
                  type="url"
                  value={profile.twitterUrl || ""}
                  onChange={(e) => setProfile({ ...profile, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/advocate_handle"
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3.5 py-2.5 text-sm text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9aa0a6] mb-1">
                  Official Website URL
                </label>
                <input
                  type="url"
                  value={profile.websiteUrl || ""}
                  onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
                  placeholder="https://mychamber.in"
                  className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3.5 py-2.5 text-sm text-[#f1f3f4] focus:outline-none focus:border-[#8ab4f8]"
                />
              </div>
            </div>

            {/* Custom Links Adder */}
            <div className="pt-3 border-t border-[#2d3139]/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#f1f3f4]">Additional Links & Judgments</p>
                  <p className="text-[11px] text-[#9aa0a6]">Add articles, news mentions, or court orders</p>
                </div>
                <button
                  type="button"
                  onClick={addCustomLink}
                  className="inline-flex items-center gap-1 bg-[#24272c] hover:bg-[#2c3138] text-[#8ab4f8] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#343840] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Link
                </button>
              </div>

              {profile.customLinks && profile.customLinks.length > 0 && (
                <div className="space-y-2">
                  {profile.customLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center gap-2 bg-[#202227] p-2.5 rounded-xl border border-[#343840]"
                    >
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => updateCustomLink(link.id, "title", e.target.value)}
                        placeholder="Link Title (e.g. Landmark Bail Order 2024)"
                        className="flex-1 bg-transparent text-xs text-[#f1f3f4] border-b border-transparent focus:border-[#8ab4f8] focus:outline-none px-1 py-1"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateCustomLink(link.id, "url", e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-transparent text-xs text-[#8ab4f8] border-b border-transparent focus:border-[#8ab4f8] focus:outline-none px-1 py-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomLink(link.id)}
                        className="text-[#9aa0a6] hover:text-rose-400 p-1"
                        title="Delete Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="sticky bottom-4 z-20 bg-[#18191c]/95 backdrop-blur-md p-4 rounded-2xl border border-[#2d3139] flex items-center justify-between shadow-2xl">
            <span className="text-xs text-[#9aa0a6]">
              {savedStatus === "saved" ? "✓ All changes saved" : "Unsaved changes ready"}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#0e0e10] font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Save & Update Profile
              </button>
            </div>
          </div>

        </div>

        {/* ── RIGHT: Real-time Live Preview (Cols 5 on Desktop) ────────────── */}
        <div className={`lg:col-span-5 lg:sticky lg:top-20 space-y-3 ${activeTab === "edit" ? "hidden lg:block" : "block"}`}>
          
          {/* Preview Controls Header */}
          <div className="flex items-center justify-between bg-[#18191c] px-4 py-2.5 rounded-2xl border border-[#2d3139]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-[#f1f3f4]">Live Chamber Preview</span>
            </div>

            <div className="flex items-center gap-1 bg-[#202227] p-1 rounded-lg border border-[#343840]">
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  previewDevice === "mobile" ? "bg-[#8ab4f8] text-[#0e0e10]" : "text-[#9aa0a6]"
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  previewDevice === "desktop" ? "bg-[#8ab4f8] text-[#0e0e10]" : "text-[#9aa0a6]"
                }`}
                title="Full Width View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Frame Container */}
          <div
            className={`mx-auto transition-all duration-300 rounded-3xl overflow-hidden border border-[#2d3139] shadow-2xl ${
              previewDevice === "mobile" ? "max-w-[420px] ring-8 ring-[#18191c]" : "w-full"
            }`}
          >
            <div className="max-h-[800px] overflow-y-auto scrollbar-thin">
              <ProfileCard advocate={profile} />
            </div>
          </div>

          <p className="text-[11px] text-[#606368] text-center">
            Changes made in the editor update here instantly in real time.
          </p>
        </div>

      </main>

    </div>
  );
}
