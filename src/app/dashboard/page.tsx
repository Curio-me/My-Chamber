"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Advocate,
  NewsMediaItem,
  ALL_SPECIALIZATIONS,
  ALL_COURTS,
  COMMON_BAR_ASSOCIATIONS,
  COMMON_QUALIFICATIONS,
  DEFAULT_BOX_ORDER,
  ALL_BOXES,
} from "@/lib/types";
import { EMPTY_ADVOCATE, DEMO_ADVOCATE } from "@/lib/demoData";
import ProfileCard from "@/components/ProfileCard";
import {
  upsertAdvocateProfile,
  supabase,
  submitChamberClaim,
  validateBarCouncilFormat,
} from "@/lib/supabase";
import { QRCodeSVG } from "qrcode.react";
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
  Newspaper,
  Wand2,
  Loader2,
  Landmark,
  GraduationCap,
  Clock,
  ArrowUp,
  ArrowDown,
  Layers,
  QrCode,
  Download,
  Search,
  Globe,
  UserPlus,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ShieldCheck,
  Upload,
  X,
  FileCheck,
} from "lucide-react";

const STORAGE_KEY = "virtual_chamber_advocate_profile";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Advocate>(EMPTY_ADVOCATE);
  const [savedStatus, setSavedStatus] = useState<"idle" | "saved">("idle");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [customTagInput, setCustomTagInput] = useState("");
  const [customCourtInput, setCustomCourtInput] = useState("");
  const [courtSearch, setCourtSearch] = useState("");
  const [customLangInput, setCustomLangInput] = useState("");
  const [customBarAssocInput, setCustomBarAssocInput] = useState("");
  const [customDegreeInput, setCustomDegreeInput] = useState("");
  const [extractingNewsId, setExtractingNewsId] = useState<string | null>(null);

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimNotes, setClaimNotes] = useState("");
  const [claimProofUrl, setClaimProofUrl] = useState("");
  const [claimStatus, setClaimStatus] = useState<"idle" | "submitting" | "success">("idle");
  const barIdFileInputRef = useRef<HTMLInputElement>(null);
  const claimProofFileInputRef = useRef<HTMLInputElement>(null);

  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const [origin, setOrigin] = useState("https://my-chamber.vercel.app");

  // Load saved profile on mount if author previously created one
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch {
      // remains EMPTY_ADVOCATE
    }
  }, []);

  // Save handler with mandatory and unique Bar Council validation
  const handleSave = async () => {
    setSaveErrorMessage(null);

    // 1. Mandatory check: Every advocate must have a Bar Council Enrollment Number
    if (!profile.enrollmentNo || !profile.enrollmentNo.trim()) {
      const msg = "Bar Council Enrollment Number is mandatory. Every advocate profile must have a valid Bar Council registration number.";
      setSaveErrorMessage(msg);
      alert("⚠️ Bar Council Enrollment Number is mandatory!\n\nPlease enter your official Bar Council registration number (e.g. PH/7797/2025) before saving.");
      return;
    }

    // 2. Mandatory check: Chamber unique handle must be at least 4 characters
    const cleanSlug = (profile.slug || "").trim().toLowerCase();
    if (!cleanSlug || cleanSlug.length < 4) {
      const msg = "Chamber unique handle must be at least 4 characters long (e.g. /yourname).";
      setSaveErrorMessage(msg);
      alert("⚠️ Chamber handle too short!\n\nYour chamber unique handle must be at least 4 characters long.");
      return;
    }

    try {
      // 2. Direct Supabase sync with strict uniqueness check (1 profile per Bar Council ID)
      const result = await upsertAdvocateProfile(profile);
      if (!result.success) {
        setSaveErrorMessage(result.error || "Failed to save profile due to database restriction.");
        alert(`❌ Cannot Save Profile:\n\n${result.error}`);
        return;
      }

      // 3. Save to local storage for instant zero-latency load
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setSavedStatus("saved");
      setSaveErrorMessage(null);
      setTimeout(() => setSavedStatus("idle"), 2500);

      // 4. Also sync to server API
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      }).catch(() => {});
    } catch (err: any) {
      alert("Failed to save profile: " + (err.message || "Unknown error"));
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

  // Handle Bar Council ID / Certificate proof upload
  const handleBarIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please select a document or ID photo smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile((prev) => ({
          ...prev,
          barIdCardUrl: event.target?.result as string,
          verificationStatus: "verified",
          isVerified: true,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle proof document for Chamber Claim / Ownership dispute
  const handleClaimProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setClaimProofUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Chamber Claim / Ownership Dispute
  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimStatus("submitting");
    const conflictingSlug = saveErrorMessage?.match(/@([a-zA-Z0-9_-]+)/)?.[1] || undefined;
    await submitChamberClaim({
      enrollmentNo: profile.enrollmentNo,
      claimantName: profile.fullName || "Advocate",
      claimantEmail: profile.email || "counsel@virtualchamber.in",
      claimantPhone: profile.mobile || "",
      notes: claimNotes,
      proofUrl: claimProofUrl,
      conflictingSlug,
    });
    setClaimStatus("success");
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

  // Bar Associations handlers
  const addBarAssociation = (assocName?: string) => {
    const name = (assocName || customBarAssocInput).trim();
    if (!name) return;
    if (profile.barAssociations?.includes(name)) {
      setCustomBarAssocInput("");
      return;
    }
    setProfile((prev) => ({
      ...prev,
      barAssociations: [...(prev.barAssociations || []), name],
    }));
    setCustomBarAssocInput("");
  };

  const removeBarAssociation = (assocToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      barAssociations: (prev.barAssociations || []).filter((a) => a !== assocToRemove),
    }));
  };

  // Academic Qualifications
  const addQualification = (deg?: string) => {
    const name = (deg || customDegreeInput).trim();
    if (!name) return;
    if ((profile.qualifications || []).includes(name)) {
      setCustomDegreeInput("");
      return;
    }
    setProfile((prev) => ({
      ...prev,
      qualifications: [...(prev.qualifications || []), name],
    }));
    setCustomDegreeInput("");
  };

  const removeQualification = (degToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      qualifications: (prev.qualifications || []).filter((q) => q !== degToRemove),
    }));
  };

  // Box Mover handlers
  const moveBox = (boxId: string, direction: "up" | "down") => {
    const currentOrder =
      profile.boxOrder && profile.boxOrder.length > 0
        ? [...profile.boxOrder]
        : [...DEFAULT_BOX_ORDER];

    // Ensure all known boxes exist
    DEFAULT_BOX_ORDER.forEach((id) => {
      if (!currentOrder.includes(id)) currentOrder.push(id);
    });

    const index = currentOrder.indexOf(boxId);
    if (index === -1) return;

    if (direction === "up" && index > 0) {
      const temp = currentOrder[index - 1];
      currentOrder[index - 1] = currentOrder[index];
      currentOrder[index] = temp;
    } else if (direction === "down" && index < currentOrder.length - 1) {
      const temp = currentOrder[index + 1];
      currentOrder[index + 1] = currentOrder[index];
      currentOrder[index] = temp;
    }

    setProfile((prev) => ({
      ...prev,
      boxOrder: currentOrder,
    }));
  };

  const resetBoxOrder = () => {
    setProfile((prev) => ({
      ...prev,
      boxOrder: DEFAULT_BOX_ORDER,
    }));
  };

  const getBoxIcon = (id: string) => {
    switch (id) {
      case "about":
        return <FileText className="w-4 h-4 text-[#163826]" />;
      case "specializations":
        return <Briefcase className="w-4 h-4 text-blue-400" />;
      case "courts":
        return <Scale className="w-4 h-4 text-indigo-400" />;
      case "bar_associations":
        return <Landmark className="w-4 h-4 text-amber-400" />;
      case "qualifications":
        return <GraduationCap className="w-4 h-4 text-indigo-300" />;
      case "contact":
        return <Phone className="w-4 h-4 text-emerald-400" />;
      case "location":
        return <MapPin className="w-4 h-4 text-rose-400" />;
      case "news_media":
        return <Newspaper className="w-4 h-4 text-cyan-400" />;
      case "custom_links":
        return <ExternalLink className="w-4 h-4 text-purple-400" />;
      default:
        return <Layers className="w-4 h-4 text-[#163826]" />;
    }
  };

  // Custom Links / Judgments
  const addCustomLink = () => {
    const newLink = {
      id: Date.now().toString(),
      title: "",
      url: "",
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

  // News Media handlers
  const addNewsMedia = () => {
    const newItem: NewsMediaItem = {
      id: Date.now().toString(),
      title: "Landmark Case Order / News Feature",
      publication: "The Tribune India",
      url: "https://",
      imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
      date: "Recent Coverage",
    };
    setProfile((prev) => ({
      ...prev,
      newsMedia: [...(prev.newsMedia || []), newItem],
    }));
  };

  const updateNewsMedia = (id: string, field: keyof NewsMediaItem, val: string) => {
    setProfile((prev) => ({
      ...prev,
      newsMedia: (prev.newsMedia || []).map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      ),
    }));
  };

  const removeNewsMedia = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      newsMedia: (prev.newsMedia || []).filter((item) => item.id !== id),
    }));
  };

  const handleExtractNews = async (id: string, url: string) => {
    if (!url || !url.startsWith("http")) return;
    setExtractingNewsId(id);
    try {
      const res = await fetch(`/api/news-metadata?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => ({
          ...prev,
          newsMedia: (prev.newsMedia || []).map((item) => {
            if (item.id === id) {
              return {
                ...item,
                title:
                  data.title &&
                  (!item.title || item.title.startsWith("Landmark Case Order"))
                    ? data.title
                    : item.title || data.title,
                publication: data.publication || item.publication,
                imageUrl: data.imageUrl || item.imageUrl,
              };
            }
            return item;
          }),
        }));
      }
    } catch {
      // ignore
    } finally {
      setExtractingNewsId(null);
    }
  };

  const publicUrl = `${origin}/${profile.slug}`;

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDashboardSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    window.location.href = "/login";
  };

  const testVCardDownload = () => {
    const cleanMobileNum = (profile.mobile || "").replace(/[^0-9+]/g, "");
    const cleanOfficeNum = profile.officePhone ? profile.officePhone.replace(/[^0-9+]/g, "") : "";
    const nameParts = (profile.fullName || "Advocate").replace(/^Adv\.\s*/i, "").trim().split(/\s+/);
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0] || "Advocate";

    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${lastName};${firstName};;;Adv.`,
      `FN:${profile.fullName || "Advocate"}`,
      `TITLE:Advocate`,
      `ORG:${profile.courts?.[0] || "Advocate Chamber"}`,
      cleanMobileNum ? `TEL;TYPE=CELL,VOICE:${cleanMobileNum}` : "",
      cleanOfficeNum ? `TEL;TYPE=WORK,VOICE:${cleanOfficeNum}` : "",
      profile.email ? `EMAIL;TYPE=INTERNET,WORK:${profile.email}` : "",
      profile.officeAddress ? `ADR;TYPE=WORK:;;${profile.officeAddress.replace(/,/g, ";")};;;;` : "",
      `URL:${publicUrl}`,
      `NOTE:Virtual Chamber: ${publicUrl}\\nBar Registration: ${profile.enrollmentNo || "Registered"}${
        profile.barAssociations?.length ? `\\nEnrolled Bar: ${profile.barAssociations.join(", ")}` : ""
      }${profile.almaMater ? `\\nAlma Mater: ${profile.almaMater}` : ""}${
        profile.chamberHours ? `\\nChamber Hours: ${profile.chamberHours}` : ""
      }`,
      "END:VCARD",
    ].filter(Boolean).join("\r\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${(profile.fullName || "Advocate").replace(/[^a-zA-Z0-9]/g, "_")}_Chamber.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadDashboardQrPng = () => {
    const svg = document.getElementById("dashboard-qr-svg") as SVGGraphicsElement | null;
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

      // Fill white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1000, 1200);

      // Outer border
      ctx.strokeStyle = "#E7E0D5";
      ctx.lineWidth = 14;
      ctx.strokeRect(35, 35, 930, 1130);

      // Accent border
      ctx.strokeStyle = "#163826";
      ctx.lineWidth = 4;
      ctx.strokeRect(52, 52, 896, 1096);

      // Header Title
      ctx.fillStyle = "#14231C";
      ctx.font = "bold 44px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(profile.fullName || "Advocate", 500, 140);

      // Subtitle Bar Council
      ctx.fillStyle = "#526057";
      ctx.font = "24px sans-serif";
      ctx.fillText(`Advocate • Bar Council: ${profile.enrollmentNo || "Registered"}`, 500, 190);

      // Court name
      if (profile.courts?.[0]) {
        ctx.fillStyle = "#163826";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(profile.courts[0], 500, 230);
      }

      // Draw QR Code
      ctx.drawImage(img, 175, 290, 650, 650);

      // Footer
      ctx.fillStyle = "#14231C";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("SCAN TO CONNECT • MY CHAMBER", 500, 1020);

      ctx.fillStyle = "#6B7870";
      ctx.font = "20px sans-serif";
      ctx.fillText(publicUrl, 500, 1060);

      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `${(profile.fullName || "Advocate").replace(/[^a-zA-Z0-9]/g, "_")}_Chamber_QR.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#14231C] flex flex-col font-sans">
      
      {/* ── Top Navigation Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7E0D5] px-4 sm:px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-[#163826] text-[#F3EFE6] flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
                <Scale className="w-4 h-4 text-[#E6D5B8]" />
              </div>
              <span className="font-extrabold text-[#14231C] text-base tracking-tight hidden sm:inline">
                My Chamber<span className="text-[#163826] font-normal">✦</span>
              </span>
            </Link>
            <span className="text-xs text-[#D5CFC5] hidden md:inline">|</span>
            <span className="text-xs font-bold text-[#163826] bg-[#EBF3ED] px-3 py-1 rounded-full border border-[#163826]/20 hidden md:inline">
              Advocate Studio
            </span>
          </div>

          {/* Quick URL preview & copy */}
          <div className="hidden lg:flex items-center gap-2 bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-[#E7E0D5] text-xs">
            <span className="text-[#526057] font-medium">Your Chamber:</span>
            <span className="text-[#163826] font-mono font-bold max-w-[220px] truncate">
              /{profile.slug}
            </span>
            <button
              onClick={copyPublicLink}
              className="text-[#6B7870] hover:text-[#14231C] transition-colors ml-1"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#163826]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden bg-[#F4EFEA] p-1 rounded-full border border-[#E7E0D5]">
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeTab === "edit" ? "bg-[#163826] text-[#FAF7F2] shadow-sm" : "text-[#526057]"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                Edit
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeTab === "preview" ? "bg-[#163826] text-[#FAF7F2] shadow-sm" : "text-[#526057]"
                }`}
              >
                <Eye className="w-3.5 h-3.5 inline mr-1" />
                Preview
              </button>
            </div>

            <button
              onClick={handleReset}
              title="Clear all fields and start fresh"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#526057] hover:text-rose-600 bg-white hover:bg-[#F3EFE6] px-3 py-2 rounded-full border border-[#E7E0D5] transition-colors font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>

            <button
              onClick={handleLoadSample}
              title="Load generic sample template"
              className="hidden md:flex items-center gap-1.5 text-xs text-[#163826] hover:text-[#1E4A33] bg-white hover:bg-[#F3EFE6] px-3 py-2 rounded-full border border-[#E7E0D5] transition-colors font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8A86B]" />
              <span>Sample Template</span>
            </button>

            <Link
              href={`/${profile.slug}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#163826] hover:text-[#1E4A33] bg-[#EBF3ED] hover:bg-[#DEECE1] px-4 py-2 rounded-full border border-[#163826]/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Card</span>
            </Link>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-[#163826] hover:bg-[#1E4A33] active:scale-95 text-[#FAF7F2] font-bold text-xs px-5 py-2.5 rounded-full shadow-sm transition-all"
            >
              {savedStatus === "saved" ? (
                <>
                  <Check className="w-4 h-4 text-[#E6D5B8]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#E6D5B8]" />
                  <span>Save Profile</span>
                </>
              )}
            </button>

            <button
              onClick={handleDashboardSignOut}
              title="Sign out of Chamber session"
              className="flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-800 bg-[#FDF2F2] hover:bg-[#FEE2E2] px-3.5 py-2 rounded-full border border-rose-200 transition-colors font-semibold"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── Main Studio Body (Split View) ─────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── LEFT: Profile Editor Form (Cols 7 on Desktop) ────────────────── */}
        <div className={`space-y-6 lg:col-span-7 ${activeTab === "preview" ? "hidden lg:block" : "block"}`}>
          
          {/* Error Banner if Bar Council or Validation Fails */}
          {saveErrorMessage && (
            <div className="bg-[#FDF2F2] border border-rose-300 p-4 rounded-2xl text-xs text-rose-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-sm animate-in fade-in">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-rose-900">Cannot Save Chamber Profile</p>
                  <p className="leading-relaxed font-medium">{saveErrorMessage}</p>
                </div>
              </div>
              {saveErrorMessage.includes("already registered") && (
                <button
                  type="button"
                  onClick={() => {
                    setClaimStatus("idle");
                    setShowClaimModal(true);
                  }}
                  className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold text-xs shadow-sm transition-all active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 text-[#E6D5B8]" />
                  <span>Claim Ownership / Dispute</span>
                </button>
              )}
            </div>
          )}

          {/* ── Chamber Box Mover & Layout Organizer ──────────────────────── */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE4]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                  Chamber Box Mover & Layout Organizer
                </h2>
              </div>
              <button
                type="button"
                onClick={resetBoxOrder}
                className="text-[11px] text-[#526057] hover:text-white flex items-center gap-1 transition-colors bg-[#FAF8F5] hover:bg-[#F3EFE6] px-2.5 py-1 rounded-lg border border-[#E7E0D5]"
                title="Reset boxes to default order"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Order</span>
              </button>
            </div>

            <p className="text-xs text-[#526057] leading-relaxed">
              Rearrange the order of your profile boxes. Use the <strong className="text-white">↑ Move Up</strong> and <strong className="text-white">↓ Move Down</strong> arrows to position boxes in any sequence (e.g. place <span className="text-indigo-300 font-medium">Academic Qualifications</span> above About, or feature <span className="text-blue-300 font-medium">Specialized in Law</span> at the top).
            </p>

            <div className="space-y-2">
              {(() => {
                const currentOrder =
                  profile.boxOrder && profile.boxOrder.length > 0
                    ? profile.boxOrder
                    : DEFAULT_BOX_ORDER;
                const orderedIds = Array.from(
                  new Set([...currentOrder, ...DEFAULT_BOX_ORDER])
                );

                return orderedIds.map((boxId, idx) => {
                  const meta = ALL_BOXES.find((b) => b.id === boxId) || {
                    id: boxId,
                    name: boxId,
                    shortDesc: "",
                    category: "Card",
                  };
                  const isFirst = idx === 0;
                  const isLast = idx === orderedIds.length - 1;

                  return (
                    <div
                      key={boxId}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E0D5] hover:border-indigo-400/40 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-[#FAF8F5] text-[#163826] text-[11px] font-mono font-bold flex items-center justify-center shrink-0 border border-[#E7E0D5]">
                          #{idx + 1}
                        </span>
                        <div className="shrink-0">{getBoxIcon(boxId)}</div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#14231C] truncate">
                            {meta.name}
                          </p>
                          <p className="text-[11px] text-[#526057] truncate hidden sm:block">
                            {meta.shortDesc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => moveBox(boxId, "up")}
                          title={`Move ${meta.name} Up`}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                            isFirst
                              ? "opacity-30 cursor-not-allowed border-transparent text-[#8C9890]"
                              : "bg-white hover:bg-[#163826] hover:text-[#FAF7F2] border-[#E7E0D5] text-[#14231C] shadow-sm"
                          }`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => moveBox(boxId, "down")}
                          title={`Move ${meta.name} Down`}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                            isLast
                              ? "opacity-30 cursor-not-allowed border-transparent text-[#8C9890]"
                              : "bg-white hover:bg-[#163826] hover:text-[#FAF7F2] border-[#E7E0D5] text-[#14231C] shadow-sm"
                          }`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Section 1: Basic Identity & Bar Details */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE4]">
              <Scale className="w-4 h-4 text-[#163826]" />
              <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                Advocate Identity & Enrollment
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#526057] mb-1.5">
                  Full Name (with Prefix)
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="e.g. Adv. Your Full Name"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#14231C]">
                    Chamber URL Handle
                  </label>
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      (profile.slug || "").length >= 4 ? "text-[#163826]" : "text-amber-600"
                    }`}
                  >
                    {(profile.slug || "").length >= 4
                      ? "✓ Valid (≥ 4 chars)"
                      : `${(profile.slug || "").length}/4 chars min`}
                  </span>
                </div>
                <div
                  className={`flex items-center bg-[#FAF8F5] border rounded-xl px-3 py-2.5 text-sm transition-all focus-within:bg-white ${
                    (profile.slug || "").length > 0 && (profile.slug || "").length < 4
                      ? "border-amber-400 focus-within:border-amber-500"
                      : "border-[#E7E0D5] focus-within:border-[#163826]"
                  }`}
                >
                  <span className="text-[#526057] text-xs font-mono">mychamber.in/</span>
                  <input
                    type="text"
                    minLength={4}
                    value={profile.slug}
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-_]/g, ""),
                      });
                      if (saveErrorMessage) setSaveErrorMessage(null);
                    }}
                    placeholder="yourname"
                    className="w-full bg-transparent text-sm text-[#14231C] focus:outline-none pl-1 font-mono placeholder:text-[#8C9890]"
                  />
                </div>
                {(profile.slug || "").length > 0 && (profile.slug || "").length < 4 && (
                  <p className="text-[10px] text-amber-600 mt-1 font-medium">
                    ⚠️ Unique handle must be at least 4 characters long.
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#14231C] flex items-center gap-1.5">
                    <span>Bar Council Enrollment Number</span>
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                      * Mandatory
                    </span>
                  </label>
                  <span className="text-[10px] text-[#163826] font-mono">1 Profile / Bar No.</span>
                </div>
                <input
                  type="text"
                  required
                  value={profile.enrollmentNo}
                  onChange={(e) => {
                    setProfile({ ...profile, enrollmentNo: e.target.value });
                    if (saveErrorMessage) setSaveErrorMessage(null);
                  }}
                  placeholder="e.g. PH/7797/2025 or D/1234/2020"
                  className={`w-full bg-[#FAF8F5] border rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none transition-colors ${
                    !profile.enrollmentNo?.trim()
                      ? "border-amber-500/60 focus:border-amber-400"
                      : "border-[#E7E0D5] focus:border-[#163826]"
                  }`}
                />
                {!profile.enrollmentNo?.trim() ? (
                  <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                    <span>⚠️ Mandatory:</span>
                    <span>Every advocate must have a registered Bar Council number to save.</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-[#526057] mt-1">
                    ✓ Strictly unique. Duplicate profiles with the same Bar Council number are prohibited.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#526057] mb-1.5">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="70"
                  value={profile.yearsExp}
                  onChange={(e) => setProfile({ ...profile, yearsExp: Number(e.target.value) || 0 })}
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              {/* Bar Council ID Verification Upload Card */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E0D5] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-[#14231C]">
                      Bar Council ID Card or Enrollment Certificate Proof
                    </span>
                  </div>
                  {profile.barIdCardUrl ? (
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Verified Proof Attached
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      Optional: Unlock Verified Badge
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#526057] leading-relaxed">
                  Upload a photo of your official Bar Council Certificate or Bar Association ID card. This locks your Bar Council registration to your profile, protects against mistaken duplicate claims, and activates your official <strong className="text-white">Verified Advocate Blue Badge</strong>.
                </p>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={barIdFileInputRef}
                    onChange={handleBarIdUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => barIdFileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#163826] text-xs font-semibold border border-[#E7E0D5] transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{profile.barIdCardUrl ? "Replace ID Proof" : "Upload Bar Council ID / Certificate"}</span>
                  </button>

                  {profile.barIdCardUrl && (
                    <div className="flex items-center gap-2">
                      <img
                        src={profile.barIdCardUrl}
                        alt="Bar ID proof preview"
                        className="w-9 h-9 object-cover rounded-lg border border-[#E7E0D5] shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setProfile((prev) => ({ ...prev, barIdCardUrl: undefined }))}
                        className="text-xs text-rose-400 hover:text-rose-300"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enrolled Bar Associations Subsection */}
            <div className="pt-3 border-t border-[#F0ECE4] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#14231C]">
                    <Landmark className="w-3.5 h-3.5 text-amber-400" />
                    <span>Enrolled with which Bar Association(s)?</span>
                  </label>
                  <p className="text-[11px] text-[#526057] mt-0.5">
                    Add the Bar Associations where you are enrolled or hold membership (e.g. Panchkula Bar Association, Punjab and Haryana High Court Bar Association)
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-amber-400">
                  {(profile.barAssociations || []).length} Added
                </span>
              </div>

              {/* Active Bar Associations Chips */}
              {(profile.barAssociations || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E7E0D5]/70">
                  {(profile.barAssociations || []).map((assoc) => (
                    <span
                      key={assoc}
                      className="inline-flex items-center gap-1.5 bg-[#FAF4EB] border border-[#C8A86B]/40 text-[#7A5B18] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm"
                    >
                      <Landmark className="w-3.5 h-3.5 text-[#A37D28] shrink-0" />
                      <span>{assoc}</span>
                      <button
                        type="button"
                        onClick={() => removeBarAssociation(assoc)}
                        className="text-[#A37D28] hover:text-rose-600 font-bold ml-1 text-sm leading-none"
                        title="Remove Bar Association"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add custom Bar Association Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customBarAssocInput}
                  onChange={(e) => setCustomBarAssocInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addBarAssociation();
                    }
                  }}
                  placeholder="Type Bar Association name (e.g. Panchkula Bar Association, Punjab and Haryana High Court Bar Association)..."
                  className="flex-1 bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#14231C] focus:bg-white focus:outline-none focus:border-[#163826] placeholder:text-[#8C9890]"
                />
                <button
                  type="button"
                  onClick={() => addBarAssociation()}
                  className="bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  Add Association
                </button>
              </div>

              {/* Quick suggestion pills */}
              <div className="space-y-1">
                <p className="text-[11px] text-[#526057]">Popular Suggestions (Click to Add):</p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_BAR_ASSOCIATIONS.map((assoc) => {
                    const alreadyAdded = (profile.barAssociations || []).includes(assoc);
                    return (
                      <button
                        key={assoc}
                        type="button"
                        disabled={alreadyAdded}
                        onClick={() => addBarAssociation(assoc)}
                        className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                          alreadyAdded
                            ? "bg-[#FAF4EB] border-[#C8A86B]/40 text-[#7A5B18] font-bold cursor-default shadow-sm"
                            : "bg-white hover:bg-[#FAF4EB] border-[#E7E0D5] hover:border-[#C8A86B]/50 text-[#526057] hover:text-[#7A5B18] font-medium"
                        }`}
                      >
                        {alreadyAdded ? "✓ " : "+ "}
                        {assoc}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Verified toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E0D5]/60">
              <div className="flex items-center gap-2.5">
                <BadgeCheck className="w-4 h-4 text-[#163826]" />
                <div>
                  <p className="text-xs font-semibold text-[#14231C]">Bar Council Verified Badge</p>
                  <p className="text-[11px] text-[#526057]">Display official advocate verification mark</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#F0ECE4]">
              {/* Default Theme */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E0D5]/60 space-y-2">
                <p className="text-xs font-semibold text-[#14231C]">Default Chamber Theme</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, themePreference: "dark" })}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                      profile.themePreference !== "light"
                        ? "bg-[#163826] border-[#163826] text-[#FAF7F2]"
                        : "bg-white border-[#E7E0D5] text-[#526057]"
                    }`}
                  >
                    🌙 Dark Obsidian
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, themePreference: "light" })}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                      profile.themePreference === "light"
                        ? "bg-[#EBF3ED] border-[#163826] text-[#163826] font-bold"
                        : "bg-white border-[#E7E0D5] text-[#526057]"
                    }`}
                  >
                    ☀️ Clean Light
                  </button>
                </div>
              </div>

              {/* 3D Tilt Enable */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E0D5]/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#14231C]">3D Parallax Rotation</p>
                  <p className="text-[11px] text-[#526057]">3D tilt & specular glare on hover</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.enable3d ?? false}
                  onChange={(e) => setProfile({ ...profile, enable3d: e.target.checked })}
                  className="w-4 h-4 accent-[#8ab4f8] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Visuals (Photo & Cover Banner) */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-5 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE4]">
              <ImageIcon className="w-4 h-4 text-[#163826]" />
              <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                Advocate Profile Photo
              </h2>
            </div>

            {/* Profile Photo */}
            <div>
              <p className="text-xs text-[#526057] mb-3">
                Upload a professional portrait or passport-style photo. A clean circular portrait is displayed with your Bar Council verification seal.
              </p>
              <div className="flex items-center gap-4">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt="Advocate Photo"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#163826] shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#EBF3ED] border-2 border-[#163826]/20 flex items-center justify-center text-sm text-[#163826] font-bold shadow-sm">
                    {profile.fullName
                      ? profile.fullName
                          .replace(/^Adv\.\s*/i, "")
                          .split(" ")
                          .filter(Boolean)
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase() || "Adv"
                      : "Adv"}
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
                      className="inline-flex items-center gap-2 text-xs font-bold bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] px-4 py-2.5 rounded-full shadow-sm transition-all active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#E6D5B8]" />
                      <span>Upload Portrait Photo</span>
                    </button>
                    {profile.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, photoUrl: undefined })}
                        className="text-xs text-rose-700 hover:text-rose-800 bg-[#FDF2F2] hover:bg-[#FEE2E2] px-3.5 py-2 rounded-full border border-rose-200 font-semibold transition-colors"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    value={profile.photoUrl || ""}
                    onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })}
                    placeholder="Or paste image URL (https://...)"
                    className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3 py-2 text-xs text-[#14231C] focus:outline-none focus:border-[#163826]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: About & Bio */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-3 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE4]">
              <FileText className="w-4 h-4 text-[#163826]" />
              <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                Professional Bio (About Section)
              </h2>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#526057] mb-1.5">
                Chamber Introduction & Practice Overview
              </label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Write a brief introduction about your chamber, areas of legal expertise, and courtroom advocacy..."
                className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl p-3.5 text-sm text-[#14231C] leading-relaxed focus:outline-none focus:border-[#163826]"
              />
              <p className="text-[11px] text-[#526057] mt-1 text-right">
                {profile.bio.length} characters
              </p>
            </div>
          </div>

          {/* Section 4: Practice Areas & Courts */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-5 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE4]">
              <Briefcase className="w-4 h-4 text-[#163826]" />
              <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                Specialized in Law & Courts
              </h2>
            </div>

            {/* Specializations selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[#526057]">
                  Select Practice Areas (Click to Toggle)
                </label>
                <span className="text-[11px] text-[#163826] font-semibold">
                  {profile.specializations.length} Selected
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-[#FAF8F5] rounded-xl border border-[#E7E0D5]">
                {ALL_SPECIALIZATIONS.map((spec) => {
                  const selected = profile.specializations.includes(spec);
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialization(spec)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                        selected
                          ? "bg-[#163826] text-[#FAF7F2] font-semibold"
                          : "bg-white text-[#526057] border border-[#E7E0D5] hover:border-[#163826]/40 hover:text-[#14231C]"
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
                  className="flex-1 bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3 py-2 text-xs text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
                <button
                  type="button"
                  onClick={addCustomSpecialization}
                  className="bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#E7E0D5]"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Courts selection */}
            <div className="pt-2 border-t border-[#F0ECE4]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[#526057]">
                  Courts of Practice (All High Courts & Tribunals)
                </label>
                <span className="text-[11px] text-[#163826] font-semibold">
                  {profile.courts.length} Selected
                </span>
              </div>

              {/* Selected courts badges */}
              {profile.courts.length > 0 && (
                <div className="mb-2.5 flex flex-wrap gap-1.5 p-2 bg-[#FAF8F5] rounded-xl border border-[#E7E0D5]/60">
                  <span className="text-[11px] text-[#526057] py-1 self-center mr-1">Active:</span>
                  {profile.courts.map((court) => (
                    <span
                      key={court}
                      className="inline-flex items-center gap-1.5 bg-[#163826] text-[#FAF7F2] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm"
                    >
                      {court}
                      <button
                        type="button"
                        onClick={() => toggleCourt(court)}
                        className="hover:text-rose-600 font-bold ml-0.5"
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
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3 py-2 text-xs text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              {/* Scrollable list of ALL 25 High Courts & Tribunals */}
              <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E7E0D5] scrollbar-thin">
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
                            ? "bg-[#163826] text-[#FAF7F2] font-semibold ring-1 ring-[#163826]"
                            : "bg-white text-[#526057] border border-[#E7E0D5] hover:border-[#163826]/40 hover:text-[#14231C] hover:text-white"
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
                  className="flex-1 bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3 py-2 text-xs text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
                <button
                  type="button"
                  onClick={addCustomCourt}
                  className="bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#E7E0D5]"
                >
                  Add Court
                </button>
              </div>
            </div>

            {/* Languages */}
            <div className="pt-2 border-t border-[#F0ECE4]">
              <label className="block text-xs font-medium text-[#526057] mb-2">
                Languages Spoken
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {profile.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E7E0D5] text-xs text-[#14231C] px-3 py-1 rounded-lg"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      className="text-[#526057] hover:text-rose-400"
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
                  className="flex-1 bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3 py-2 text-xs text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
                <button
                  type="button"
                  onClick={addCustomLanguage}
                  className="bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#E7E0D5]"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Section: Academic Credentials & Alma Mater */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE4]">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                Academic Qualifications & Alma Mater
              </h2>
            </div>

            {/* Alma Mater / University */}
            <div>
              <label className="block text-xs font-medium text-[#526057] mb-1.5">
                Alma Mater (University / Law Faculty / Law School)
              </label>
              <input
                type="text"
                value={profile.almaMater || ""}
                onChange={(e) => setProfile({ ...profile, almaMater: e.target.value })}
                placeholder="e.g. Department of Laws, Panjab University, Chandigarh / NLSIU Bangalore"
                className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-indigo-400"
              />
            </div>

            {/* Degrees / Qualifications */}
            <div className="pt-2 border-t border-[#F0ECE4] space-y-2">
              <label className="block text-xs font-semibold text-[#14231C]">
                Law Degrees & Certifications
              </label>

              {/* Active degrees */}
              {profile.qualifications && profile.qualifications.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {profile.qualifications.map((deg) => (
                    <span
                      key={deg}
                      className="inline-flex items-center gap-1.5 bg-[#EBF3ED] border border-[#163826]/30 text-xs font-bold text-[#163826] px-3.5 py-1.5 rounded-full shadow-sm"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-[#163826] shrink-0" />
                      <span>{deg}</span>
                      <button
                        type="button"
                        onClick={() => removeQualification(deg)}
                        className="text-[#163826]/60 hover:text-rose-600 font-bold ml-1 text-sm leading-none"
                        title="Remove Degree"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Custom Degree Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customDegreeInput}
                  onChange={(e) => setCustomDegreeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addQualification();
                    }
                  }}
                  placeholder="Type qualification (e.g. B.A. LL.B. (Hons.), LL.M. Constitutional Law)..."
                  className="flex-1 bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#14231C] focus:bg-white focus:outline-none focus:border-[#163826] placeholder:text-[#8C9890]"
                />
                <button
                  type="button"
                  onClick={() => addQualification()}
                  className="bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  Add Degree
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="space-y-1">
                <p className="text-[11px] text-[#526057]">Popular Degrees (Click to Add):</p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_QUALIFICATIONS.map((deg) => {
                    const alreadyAdded = (profile.qualifications || []).includes(deg);
                    return (
                      <button
                        key={deg}
                        type="button"
                        disabled={alreadyAdded}
                        onClick={() => addQualification(deg)}
                        className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                          alreadyAdded
                            ? "bg-[#EBF3ED] border border-[#163826]/30 text-[#163826] font-bold cursor-default shadow-sm"
                            : "bg-white hover:bg-[#F3EFE6] border-[#E7E0D5] hover:border-[#163826]/40 text-[#526057] hover:text-[#14231C] font-semibold"
                        }`}
                      >
                        {alreadyAdded ? "✓ " : "+ "}
                        {deg}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Contact Channels & Location */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE4]">
              <Phone className="w-4 h-4 text-[#163826]" />
              <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                Chamber Contact & Maps Location
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#526057] mb-1.5">
                  Mobile Number (WhatsApp Enabled)
                </label>
                <input
                  type="text"
                  value={profile.mobile}
                  onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                  placeholder="e.g. +91-98XXXXXXXX"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#526057] mb-1.5">
                  Chamber Landline / Office Phone (Optional)
                </label>
                <input
                  type="text"
                  value={profile.officePhone || ""}
                  onChange={(e) => setProfile({ ...profile, officePhone: e.target.value })}
                  placeholder="e.g. 011-XXXXXXXX (Optional)"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#526057] mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="e.g. advocate@yourchamber.in"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#526057] mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#163826]" />
                  <span>Chamber Office Hours & Consultation Policy</span>
                </label>
                <input
                  type="text"
                  value={profile.chamberHours || ""}
                  onChange={(e) => setProfile({ ...profile, chamberHours: e.target.value })}
                  placeholder="e.g. Mon – Sat: 10:00 AM – 7:30 PM (Consultations by Prior Appointment)"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
                <p className="text-[11px] text-[#526057] mt-1">
                  Displays live availability status on your chamber profile and indexes in Google Search knowledge panels.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#526057] mb-1.5">
                  Chamber Office Address
                </label>
                <textarea
                  rows={2}
                  value={profile.officeAddress}
                  onChange={(e) => setProfile({ ...profile, officeAddress: e.target.value })}
                  placeholder="e.g. Chamber No. __, Lawyers' Block, Court Complex, City"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl p-3 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[#526057] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#163826]" />
                    Google Maps Location Link
                  </label>
                  {profile.mapUrl && (
                    <a
                      href={profile.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#163826] hover:underline flex items-center gap-1"
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
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
                <p className="text-[11px] text-[#526057] mt-1.5 leading-relaxed">
                  💡 <span className="text-[#3F4D45]">How to get:</span> Open Google Maps on phone or desktop, search your chamber or court complex, tap <strong>Share</strong>, copy the link, and paste it here.
                </p>
              </div>

              {/* WhatsApp Consultation Message */}
              <div className="sm:col-span-2 pt-2 border-t border-[#F0ECE4]">
                <label className="block text-xs font-medium text-[#526057] mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Consultation Message (Pre-filled for Clients)</span>
                </label>
                <input
                  type="text"
                  value={profile.whatsappGreeting || ""}
                  onChange={(e) => setProfile({ ...profile, whatsappGreeting: e.target.value })}
                  placeholder={`e.g. Hello Adv. ${profile.fullName || "Advocate"}, I found your chamber profile on Virtual Chamber and would like to consult regarding a legal matter.`}
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-emerald-500 placeholder:text-[#8C9890]"
                />
                <p className="text-[11px] text-[#526057] mt-1">
                  When prospective clients click &quot;WhatsApp Consult&quot; on your profile or floating CTA bar, this message is pre-typed ready to send.
                </p>
              </div>

              {/* Direct vCard Contact Save Action */}
              <div className="sm:col-span-2 pt-3 border-t border-[#F0ECE4] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#526057]">
                  <UserPlus className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Digital vCard: Saves your full name, chamber mobile, email, and court to the client&apos;s phone.</span>
                </div>
                <button
                  type="button"
                  onClick={testVCardDownload}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F3EFE6] text-[#163826] text-xs font-semibold border border-[#E7E0D5] hover:border-[#163826]/40 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Test vCard (.vcf) Download</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 6: Social Profiles & Web Presence */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0ECE4]">
              <Share2 className="w-4 h-4 text-[#163826]" />
              <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                Social Profiles & Web Presence
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#526057] mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={profile.instagramUrl || ""}
                  onChange={(e) => setProfile({ ...profile, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/advocate_handle"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#526057] mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={profile.linkedinUrl || ""}
                  onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/advocate_handle"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#526057] mb-1">
                  Twitter / X Profile URL
                </label>
                <input
                  type="url"
                  value={profile.twitterUrl || ""}
                  onChange={(e) => setProfile({ ...profile, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/advocate_handle"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#526057] mb-1">
                  Official Website URL
                </label>
                <input
                  type="url"
                  value={profile.websiteUrl || ""}
                  onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
                  placeholder="https://mychamber.in"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>
            </div>
          </div>

          {/* ── Box: Additional Links & Judgments (Dedicated Box) ─────────── */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE4]">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                  Additional Links & Judgments
                </h2>
              </div>
              <button
                type="button"
                onClick={addCustomLink}
                className="inline-flex items-center gap-1.5 bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] text-xs font-semibold px-3 py-1.5 rounded-xl border border-purple-400/30 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Link / Judgment
              </button>
            </div>

            <p className="text-xs text-[#526057] leading-relaxed">
              Add external case orders, reported judgment citations (e.g. SCC / PLR / DLT), legal articles, or publications.
              <span className="text-[#7A5B18] block mt-1 font-semibold">
                🔒 Note: If you do not add any links here, this box remains completely hidden from visitors on your chamber profile.
              </span>
            </p>

            {(!profile.customLinks || profile.customLinks.length === 0) ? (
              <div className="text-center py-6 border border-dashed border-[#E7E0D5] rounded-xl text-xs text-[#526057] space-y-2 bg-[#FAF8F5]/40">
                <ExternalLink className="w-7 h-7 text-[#8C9890] mx-auto" />
                <p>No additional links or judgments added yet.</p>
                <p className="text-[11px] text-[#71767c]">
                  This section is currently hidden from the public.
                </p>
                <button
                  type="button"
                  onClick={addCustomLink}
                  className="text-purple-400 hover:text-[#163826] hover:underline font-medium pt-1 inline-block"
                >
                  + Add your first case order or judgment link
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.customLinks.map((link, idx) => (
                  <div
                    key={link.id}
                    className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E7E0D5] space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#163826] bg-[#FAF8F5] px-2 py-0.5 rounded border border-purple-400/25">
                        Link #{idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        {link.url && link.url.startsWith("http") && (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#163826] hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Test
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => removeCustomLink(link.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                          title="Remove Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#526057] mb-1">
                        Title / Judgment Citation
                      </label>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => updateCustomLink(link.id, "title", e.target.value)}
                        placeholder="e.g. Landmark Bail Order 2024 (Supreme Court of India)"
                        className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-lg px-3 py-2 text-xs text-[#14231C] focus:outline-none focus:border-purple-400 placeholder:text-[#8C9890]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#526057] mb-1">
                        Target Link / Court Order URL
                      </label>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateCustomLink(link.id, "url", e.target.value)}
                        placeholder="https://main.sci.gov.in/..."
                        className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-lg px-3 py-2 text-xs text-[#163826] focus:outline-none focus:border-purple-400 placeholder:text-[#8C9890]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Newspaper & Media Coverage Carousel */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE4]">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-[#163826]" />
                <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                  Newspaper & Press Coverage
                </h2>
              </div>
              <button
                type="button"
                onClick={addNewsMedia}
                className="inline-flex items-center gap-1.5 bg-[#EBF3ED] hover:bg-[#DEECE1] text-[#163826] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#163826]/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add News Article
              </button>
            </div>

            <p className="text-xs text-[#526057]">
              Showcase newspaper headlines, media coverage, and court reports in an interactive visual carousel on your chamber card.
            </p>

            {(!profile.newsMedia || profile.newsMedia.length === 0) ? (
              <div className="text-center py-6 border border-dashed border-[#E7E0D5] rounded-xl text-xs text-[#526057] space-y-2">
                <Newspaper className="w-8 h-8 text-[#8C9890] mx-auto" />
                <p>No newspaper articles added yet.</p>
                <button
                  type="button"
                  onClick={addNewsMedia}
                  className="text-[#163826] hover:underline font-medium"
                >
                  + Add your first media mention
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.newsMedia.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E7E0D5] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#163826] bg-[#EBF3ED] px-2 py-0.5 rounded border border-[#163826]/30">
                        Article #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeNewsMedia(item.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#526057] mb-1">
                          Article Title / Headline
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateNewsMedia(item.id, "title", e.target.value)}
                          placeholder="e.g. Swiggy told to pay Rs 2,000..."
                          className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-lg px-3 py-2 text-xs text-[#14231C] focus:outline-none focus:border-[#163826]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#526057] mb-1">
                          Publication Name
                        </label>
                        <input
                          type="text"
                          value={item.publication || ""}
                          onChange={(e) => updateNewsMedia(item.id, "publication", e.target.value)}
                          placeholder="e.g. The Tribune India, LiveLaw, Times of India"
                          className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-lg px-3 py-2 text-xs text-[#14231C] focus:outline-none focus:border-[#163826]"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-[11px] font-medium text-[#526057]">
                            Target Article Link (URL)
                          </label>
                          <button
                            type="button"
                            onClick={() => handleExtractNews(item.id, item.url)}
                            disabled={!item.url || extractingNewsId === item.id}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#163826] hover:text-[#aecbfa] disabled:opacity-40 transition-colors"
                          >
                            {extractingNewsId === item.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Extracting photo...</span>
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-3 h-3" />
                                <span>Auto-Extract Image & Details</span>
                              </>
                            )}
                          </button>
                        </div>
                        <input
                          type="url"
                          value={item.url}
                          onChange={(e) => updateNewsMedia(item.id, "url", e.target.value)}
                          onBlur={() => {
                            if (item.url && item.url.startsWith("http") && (!item.imageUrl || item.imageUrl.includes("unsplash"))) {
                              handleExtractNews(item.id, item.url);
                            }
                          }}
                          placeholder="Paste article link (e.g. https://www.tribuneindia.com/...)"
                          className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-lg px-3 py-2 text-xs text-[#163826] focus:outline-none focus:border-[#163826]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-[#526057] mb-1">
                          Article Clipping Image (Extracted automatically from news link)
                        </label>
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt="Article thumbnail"
                              className="w-14 h-14 rounded-xl object-cover border border-[#E7E0D5] shrink-0 shadow"
                            />
                          )}
                          <input
                            type="url"
                            value={item.imageUrl || ""}
                            onChange={(e) => updateNewsMedia(item.id, "imageUrl", e.target.value)}
                            placeholder="Image URL extracted automatically from article or custom link..."
                            className="flex-1 bg-[#FAF8F5] border border-[#E7E0D5] rounded-lg px-3 py-2 text-xs text-[#14231C] focus:outline-none focus:border-[#163826]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Studio Card: Printable Chamber QR Code & Visiting Card Asset Studio ──── */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE4]">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#163826]" />
                <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                  Printable Chamber QR Code & Visiting Card Asset Studio
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Print Ready (1000×1200)
              </span>
            </div>

            <p className="text-xs text-[#526057] leading-relaxed">
              Generate an official, high-resolution QR badge for your chamber. Ready to hand directly to your visiting card printing press, print on letterheads, or display in an acrylic standee on your office desk.
            </p>

            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E7E0D5] flex flex-col sm:flex-row items-center gap-5">
              {/* High Contrast QR Code Canvas */}
              <div suppressHydrationWarning className="p-4 bg-white rounded-2xl shadow-xl border border-slate-200 shrink-0 flex flex-col items-center text-center">
                <QRCodeSVG
                  id="dashboard-qr-svg"
                  value={publicUrl}
                  size={140}
                  level="H"
                  includeMargin={true}
                  className="w-32 h-32"
                />
                <span className="text-[9px] font-mono font-bold tracking-wider text-slate-500 mt-1 uppercase">
                  {profile.slug || "chamber"}
                </span>
              </div>

              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div>
                  <h4 className="text-sm font-bold text-[#14231C]">
                    {profile.fullName || "Advocate"}
                  </h4>
                  <p className="text-xs text-[#526057]">
                    Bar Council: {profile.enrollmentNo || "Registered Advocate"}
                  </p>
                  <p
                    suppressHydrationWarning
                    className="text-[11px] text-[#163826] font-mono mt-0.5 truncate max-w-[280px]"
                  >
                    {publicUrl}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={downloadDashboardQrPng}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold text-xs shadow-sm transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4 text-[#E6D5B8]" />
                    <span>Download High-Res PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={copyPublicLink}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F3EFE6] text-[#14231C] text-xs font-semibold border border-[#E7E0D5] transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Link Copied!" : "Copy Link"}</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#71767b]">
                  💡 Tip: The downloaded PNG includes your name, bar number, and court crest framing, formatted perfectly for 3.5×2 inch visiting cards.
                </p>
              </div>
            </div>
          </div>

          {/* ── Studio Card: Google Knowledge Panel & Legal SEO Simulator ───────────── */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE4]">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#163826]" />
                <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                  Google Knowledge Panel & Legal SEO Simulator
                </h2>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Schema.org Active</span>
              </div>
            </div>

            <p className="text-xs text-[#526057] leading-relaxed">
              Search engines use your chamber data to generate structured Knowledge Panels and Rich Sitelinks. Here is a live simulation of how your profile appears on Google Search:
            </p>

            {/* Google Search Result Mockup */}
            <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#E7E0D5] space-y-3">
              <div className="text-[11px] font-semibold text-[#526057] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#F0ECE4]">
                <Globe className="w-3.5 h-3.5 text-[#163826]" />
                <span>Google Search Result Snippet Preview</span>
              </div>

              {/* URL Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-[#526057]">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#8ab4f8] to-[#1a73e8] flex items-center justify-center text-[9px] font-bold text-black">
                  ⚖
                </div>
                <span className="text-[#dadce0] font-medium">Virtual Chamber</span>
                <span>›</span>
                <span className="text-[#526057] font-mono text-[11px]">my-chamber.vercel.app › {profile.slug || "advocate"}</span>
              </div>

              {/* Blue Title Link */}
              <h3 className="text-base sm:text-lg font-medium text-[#163826] hover:underline cursor-pointer">
                {profile.fullName || "Advocate"} | Virtual Chamber Profile
              </h3>

              {/* Snippet Description */}
              <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-3">
                Official Virtual Chamber profile of {profile.fullName || "Advocate"}, Advocate practicing at {profile.courts?.[0] || "High Court"}. Bar Council No: {profile.enrollmentNo || "Registered"}. Experience: {profile.yearsExp || 1}+ Years. Specialized in {(profile.specializations || []).slice(0, 3).join(", ") || "Constitutional, Civil & Criminal Law"}.
              </p>

              {/* Google Sitelinks Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {[
                  { label: "Courts of Practice", desc: profile.courts?.[0] || "High Court" },
                  { label: "Specializations", desc: profile.specializations?.[0] || "Civil & Criminal" },
                  { label: "Chamber Contacts", desc: profile.mobile || "WhatsApp & Call" },
                  { label: "Bar Enrollment", desc: profile.enrollmentNo || "Bar Council" },
                ].map((site, i) => (
                  <div key={i} className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E7E0D5]/60 space-y-0.5">
                    <p className="text-xs font-semibold text-[#163826] hover:underline cursor-pointer truncate">
                      {site.label}
                    </p>
                    <p className="text-[10px] text-[#526057] truncate">{site.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Panel Highlights */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E7E0D5] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-[#526057]">LegalService Schema Type:</span>
                <p className="font-mono text-[#163826] text-[11px]">Attorney, LegalService</p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-[#526057]">Bar Council Index:</span>
                <p className="font-semibold text-emerald-400">{profile.enrollmentNo || "Not specified"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-[#526057]">Jurisdiction / Courts:</span>
                <p className="font-semibold text-[#dadce0] truncate">{profile.courts?.join(", ") || "High Court"}</p>
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-[#E7E0D5] flex items-center justify-between shadow-lg">
            <span className="text-xs text-[#526057]">
              {savedStatus === "saved" ? "✓ All changes saved" : "Unsaved changes ready"}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold text-xs px-6 py-2.5 rounded-full shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4 text-[#E6D5B8]" />
                Save & Update Profile
              </button>
            </div>
          </div>

        </div>

        {/* ── RIGHT: Real-time Live Preview (Cols 5 on Desktop) ────────────── */}
        <div className={`lg:col-span-5 lg:sticky lg:top-20 space-y-3 ${activeTab === "edit" ? "hidden lg:block" : "block"}`}>
          
          {/* Preview Controls Header */}
          <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-[#E7E0D5] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-[#14231C]">Live Chamber Preview</span>
            </div>

            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-lg border border-[#E7E0D5]">
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  previewDevice === "mobile" ? "bg-[#163826] text-[#FAF7F2]" : "text-[#526057]"
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  previewDevice === "desktop" ? "bg-[#163826] text-[#FAF7F2]" : "text-[#526057]"
                }`}
                title="Full Width View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Frame Container */}
          <div
            className={`mx-auto transition-all duration-300 rounded-3xl overflow-hidden border border-[#E7E0D5] shadow-2xl ${
              previewDevice === "mobile" ? "max-w-[420px] ring-8 ring-white shadow-2xl" : "w-full"
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

      {/* ── Chamber Ownership Dispute & Bar Council Claim Modal ───────────────── */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-7 border border-[#E7E0D5] bg-white text-[#14231C] shadow-2xl space-y-4">
            {/* Close button */}
            <button
              onClick={() => setShowClaimModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold shadow-lg shrink-0">
                <ShieldCheck className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold">Claim Chamber Ownership</h3>
                <p className="text-xs text-[#526057]">
                  Dispute review for Bar Council No:{" "}
                  <span className="text-amber-400 font-mono font-bold">
                    {profile.enrollmentNo || "N/A"}
                  </span>
                </p>
              </div>
            </div>

            {claimStatus === "success" ? (
              <div className="bg-[#FAF8F5] border border-emerald-500/40 p-5 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h4 className="text-sm font-bold text-emerald-300">Ownership Claim Submitted</h4>
                <p className="text-xs text-[#3F4D45] leading-relaxed">
                  Your claim for Bar Council No.{" "}
                  <strong className="text-white font-mono">{profile.enrollmentNo}</strong> has been logged.
                  Our verification desk will review the official State Bar Council roll and release the
                  chamber to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-3.5">
                <p className="text-xs text-[#3F4D45] leading-relaxed">
                  If another advocate entered your Bar Council number by mistake or you are the legitimate
                  holder, submit your contact information and ID proof. We will verify and reassign the chamber
                  to your account.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#526057] mb-1">
                      Advocate Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      placeholder="Your official name on Bar roll"
                      className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#163826]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#526057] mb-1">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="your.email@gmail.com"
                      className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#163826]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#526057] mb-1">
                    Mobile / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.mobile}
                    onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                    placeholder="+91-98XXXXXXXX"
                    className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#163826]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#526057] mb-1">
                    Upload Bar Council ID or Enrollment Certificate (Proof)
                  </label>
                  <input
                    type="file"
                    ref={claimProofFileInputRef}
                    onChange={handleClaimProofUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => claimProofFileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#163826] text-xs font-semibold border border-[#E7E0D5] transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{claimProofUrl ? "Change Proof Photo" : "Upload ID Proof"}</span>
                    </button>
                    {claimProofUrl && (
                      <span className="text-[11px] text-emerald-400 font-medium">✓ Document attached</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#526057] mb-1">
                    Explanation / Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={claimNotes}
                    onChange={(e) => setClaimNotes(e.target.value)}
                    placeholder="e.g. Enrolled with Punjab and Haryana Bar Council in 2025. Please release this registration."
                    className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#163826]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowClaimModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-[#526057] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={claimStatus === "submitting"}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {claimStatus === "submitting" ? "Submitting Claim..." : "Submit Ownership Claim"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
