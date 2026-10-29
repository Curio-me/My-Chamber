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
import Logo from "@/components/Logo";
import { normalizeSocialUrl, extractSocialHandle } from "@/lib/urlHelpers";
import {
  upsertAdvocateProfile,
  mapRowToAdvocate,
  supabase,
  submitChamberClaim,
  validateBarCouncilFormat,
  uploadProfilePhotoToStorage,
  uploadVerificationDocToStorage,
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Advocate>(EMPTY_ADVOCATE);
  const [savedStatus, setSavedStatus] = useState<"idle" | "saved">("idle");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copiedModalAddress, setCopiedModalAddress] = useState(false);
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
  const [origin, setOrigin] = useState("https://mychamber.me");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingBarId, setIsUploadingBarId] = useState(false);

  // Load saved profile on mount if author previously created one, or apply claimed slug from URL, and sync with live Supabase database
  useEffect(() => {
    let currentProfile = EMPTY_ADVOCATE;
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          currentProfile = JSON.parse(saved);
          if (currentProfile.id === "chamber-new") {
            currentProfile.id = "";
          }
          // Sanitize ghost/empty customLinks from old sessions
          if (Array.isArray(currentProfile.customLinks)) {
            currentProfile.customLinks = currentProfile.customLinks
              .filter(
                (l: any) =>
                  l &&
                  !l.id?.startsWith("meta_") &&
                  !l.isProfileMeta &&
                  !l.isBarAssociations &&
                  (Boolean(l.title?.trim()) || Boolean(l.url?.trim()))
              )
              .slice(0, 3);
          }
        }
      } catch {
        // remains EMPTY_ADVOCATE
      }

      // Check if handle was passed via ?slug= from the claim form on the homepage
      const urlParams = new URLSearchParams(window.location.search);
      const authError = urlParams.get("error_description") || urlParams.get("error");
      if (authError) {
        alert("⚠️ Sign-In Incomplete:\n\nGoogle OAuth could not complete (" + decodeURIComponent(authError).replace(/\+/g, " ") + ").\n\nPlease use the 'Magic Link' tab on the login page to receive an instant 1-click login link in your Gmail.");
        window.location.href = "/login?tab=magic";
        return;
      }

      const querySlug = urlParams.get("slug");
      if (querySlug) {
        const cleanSlug = querySlug.toLowerCase().replace(/[^a-z0-9-_]/g, "").slice(0, 20);
        if (cleanSlug) {
          currentProfile = { ...currentProfile, slug: cleanSlug };
        }
      }

      setProfile(currentProfile);

      // Async: Sync with live profile from Supabase cloud database
      const loadLiveProfile = async () => {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const user = sessionData?.session?.user;

          // 1. If authenticated, load profile matching logged-in advocate's email or user ID
          if (user) {
            let query = supabase.from("advocate_profiles").select("*");
            if (user.email) {
              query = query.or(`email.eq.${user.email},user_id.eq.${user.id}`);
            } else {
              query = query.eq("user_id", user.id);
            }

            const { data: userProfile } = await query.maybeSingle();
            if (userProfile) {
              const mapped = mapRowToAdvocate(userProfile);
              setProfile(mapped);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
              return;
            }
          }

          // 2. If targetSlug exists in database, verify ownership!
          const targetSlug = querySlug ? querySlug.toLowerCase() : currentProfile.slug;
          if (targetSlug) {
            const { data: slugProfile } = await supabase
              .from("advocate_profiles")
              .select("*")
              .eq("slug", targetSlug)
              .maybeSingle();

            if (slugProfile) {
              // Existing chamber found in database! Verify if visitor is the verified owner.
              const isOwner =
                user &&
                ((slugProfile.user_id && slugProfile.user_id === user.id) ||
                 (slugProfile.email && user.email && slugProfile.email.toLowerCase() === user.email.toLowerCase()) ||
                 (!slugProfile.user_id && slugProfile.email && user.email && slugProfile.email.toLowerCase() === user.email.toLowerCase()));

              if (!isOwner) {
                // Not authorized to edit this chamber! Protect data integrity.
                alert(`🔒 Chamber Protected:\n\n@${targetSlug} is registered to ${slugProfile.full_name || "another advocate"}.\n\nYou must log in with the owner's verified email to edit this chamber.`);
                window.location.href = `/login?tab=magic`;
                return;
              }

              const mapped = mapRowToAdvocate(slugProfile);
              setProfile(mapped);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
            }
          }
        } catch (err) {
          console.error("Live profile sync error:", err);
        }
      };

      loadLiveProfile();
    }
  }, []);

  // Save handler with mandatory and unique Bar Council validation
  const handleSave = async () => {
    setSaveErrorMessage(null);

    // 1. Mandatory check: Every advocate must have a valid Bar Council Enrollment Number
    const rawEnrollment = (profile.enrollmentNo || "").trim();
    if (!rawEnrollment) {
      const msg = "Bar Council Enrollment Number is mandatory. Every advocate profile must have a valid Bar Council registration number.";
      setSaveErrorMessage(msg);
      alert("⚠️ Bar Council Enrollment Number is mandatory!\n\nPlease enter your official Bar Council registration number (e.g. PH/7797/2025) before saving.");
      return;
    }

    const formatCheck = validateBarCouncilFormat(rawEnrollment);
    if (!formatCheck.isValid) {
      const msg = `Invalid Bar Council Enrollment Number (${rawEnrollment}). ${formatCheck.suggestion || "Must follow [State]/[Number]/[Year], e.g. PH/7797/2025. Asterisks (*) or placeholder masks are strictly prohibited."}`;
      setSaveErrorMessage(msg);
      alert(`⚠️ Invalid Bar Council Enrollment Number!\n\n"${rawEnrollment}" does not match official Bar Council conventions.\n\nRequired Format: [State Code]/[Number]/[Year]\nExamples:\n• PH/7797/2025 (Punjab & Haryana)\n• D/1234/2018 (Delhi)\n• MAH/567/2019 (Maharashtra & Goa)\n• UP/1029/2021 (Uttar Pradesh)\n\nNote: Masking with asterisks (****) or placeholder letters is strictly prohibited.`);
      return;
    }

    // 2. Mandatory check: Chamber unique handle must be between 4 and 20 characters
    const cleanSlug = (profile.slug || "").trim().toLowerCase();
    if (!cleanSlug || cleanSlug.length < 4 || cleanSlug.length > 20) {
      const msg = "Chamber unique handle must be between 4 and 20 characters long (e.g. /yourname).";
      setSaveErrorMessage(msg);
      alert("⚠️ Chamber handle length invalid!\n\nYour chamber unique handle must be between 4 and 20 characters long.");
      return;
    }

    if (profile.bio && profile.bio.length > 800) {
      alert("⚠️ About / Bio exceeds 800 characters!\n\nPlease shorten your chamber introduction to 800 characters or fewer.");
      return;
    }

    const cleanCustomLinks = (profile.customLinks || [])
      .filter(
        (l) =>
          l &&
          !l.id?.startsWith("meta_") &&
          !(l as any).isProfileMeta &&
          !(l as any).isBarAssociations &&
          (Boolean(l.title?.trim()) || Boolean(l.url?.trim()))
      )
      .slice(0, 3);

    const profileToSave: Advocate = {
      ...profile,
      slug: cleanSlug,
      bio: (profile.bio || "").slice(0, 800),
      id: (!profile.id || profile.id === "chamber-new") ? cleanSlug : profile.id,
      customLinks: cleanCustomLinks,
      hideEnrollmentNo: profile.hideEnrollmentNo === true,
      instagramUrl: normalizeSocialUrl("instagram", profile.instagramUrl || ""),
      linkedinUrl: normalizeSocialUrl("linkedin", profile.linkedinUrl || ""),
      twitterUrl: normalizeSocialUrl("twitter", profile.twitterUrl || ""),
      youtubeUrl: normalizeSocialUrl("youtube", profile.youtubeUrl || ""),
      facebookUrl: normalizeSocialUrl("facebook", profile.facebookUrl || ""),
      websiteUrl: normalizeSocialUrl("website", profile.websiteUrl || ""),
    };

    try {
      setIsSaving(true);

      // 2. Direct Supabase sync with strict uniqueness check (1 profile per Bar Council ID)
      const result = await upsertAdvocateProfile(profileToSave);
      if (!result.success) {
        setSaveErrorMessage(result.error || "Failed to save profile due to database restriction.");
        alert(`❌ Cannot Save Profile:\n\n${result.error}`);
        return;
      }

      // 3. Save to local storage for instant zero-latency load
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileToSave));
      setProfile(profileToSave);
      setSavedStatus("saved");
      setSaveErrorMessage(null);
      setTimeout(() => setSavedStatus("idle"), 2500);

      // Open Congratulations & Share Chamber Address pop-up modal immediately!
      setShowSuccessModal(true);

      // 4. Fire background server sync & edge pre-warming without blocking the modal
      fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileToSave),
      }).catch(() => {});

      // 5. Pre-warm Vercel Edge CDN cache immediately in background so the very first visitor gets instant <300ms load
      fetch(`/${cleanSlug}`, { cache: "no-store" }).catch(() => {});
    } catch (err: any) {
      alert("Failed to save profile: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
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

  // Helper to compress image to Blob + DataURL for instant UI preview and lightweight Supabase storage (~35KB)
  const compressImageFile = (
    file: File,
    maxDim = 480,
    quality = 0.85
  ): Promise<{ blob: Blob; dataUrl: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            fetch(e.target?.result as string)
              .then((r) => r.blob())
              .then((blob) => resolve({ blob, dataUrl: e.target?.result as string }));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({ blob, dataUrl });
              } else {
                fetch(dataUrl)
                  .then((r) => r.blob())
                  .then((b) => resolve({ blob: b, dataUrl }));
              }
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = () => {
          fetch(e.target?.result as string)
            .then((r) => r.blob())
            .then((blob) => resolve({ blob, dataUrl: e.target?.result as string }))
            .catch(reject);
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle local photo upload: client-side compression + direct Supabase Storage 'avatars' CDN upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Please select an image smaller than 10MB.");
      return;
    }

    try {
      setIsUploadingPhoto(true);

      // 1. Instant client-side compression to sharp 480x480 (~35KB)
      const { blob, dataUrl } = await compressImageFile(file, 480, 0.85);

      // Instant preview in the UI
      setProfile((prev) => ({ ...prev, photoUrl: dataUrl }));

      // 2. Upload compressed blob directly to Supabase Storage 'avatars' bucket
      const uploadRes = await uploadProfilePhotoToStorage(blob, profile.slug || "adv");
      if (uploadRes.url) {
        // Replace preview with permanent CDN URL
        setProfile((prev) => ({ ...prev, photoUrl: uploadRes.url! }));
      }
    } catch (err) {
      console.error("Photo upload error:", err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle Bar Council ID / Certificate proof upload to private 'verification-documents' storage
  const handleBarIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Please select a document or ID photo smaller than 10MB.");
      return;
    }

    try {
      setIsUploadingBarId(true);

      // Compress slightly to 1280px so text/stamps are 100% sharp for admin verification (~150KB)
      const { blob, dataUrl } = await compressImageFile(file, 1280, 0.88);

      // Show instant preview
      setProfile((prev) => ({
        ...prev,
        barIdCardUrl: dataUrl,
        verificationStatus: "pending",
      }));

      // Upload to private 'verification-documents' bucket
      const uploadRes = await uploadVerificationDocToStorage(blob, profile.slug || "adv");
      if (uploadRes.path) {
        setProfile((prev) => ({
          ...prev,
          barIdCardUrl: uploadRes.path!,
          verificationStatus: "pending",
        }));
      }
    } catch (err) {
      console.error("Bar ID upload error:", err);
    } finally {
      setIsUploadingBarId(false);
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
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (trimmed.length < 3) {
      alert("⚠️ Practice area name too short!\n\nPlease enter at least 3 characters (e.g. NCLT, Insolvency, Family Courts).");
      return;
    }
    if (trimmed.length > 40) {
      alert("⚠️ Practice area name too long!\n\nPlease keep it under 40 characters so it fits cleanly on mobile screens.");
      return;
    }
    if (!profile.specializations.includes(trimmed)) {
      setProfile((prev) => ({
        ...prev,
        specializations: [...prev.specializations, trimmed],
      }));
    }
    setCustomTagInput("");
  };

  const removeSpecialization = (spec: string) => {
    setProfile((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((s) => s !== spec),
    }));
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
    const trimmed = customCourtInput.trim();
    if (!trimmed) return;
    if (trimmed.length < 3) {
      alert("⚠️ Court name too short!\n\nPlease enter at least 3 characters (e.g. NCLT, Patiala House District Court).");
      return;
    }
    if (!profile.courts.includes(trimmed)) {
      setProfile((prev) => ({
        ...prev,
        courts: [...prev.courts, trimmed],
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
      case "social_presence":
        return <Share2 className="w-4 h-4 text-[#163826]" />;
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

  // Custom Links / Judgments (Max 3 Allowed)
  const addCustomLink = () => {
    // Clean out any empty ghost links first
    const validExisting = (profile.customLinks || []).filter(
      (l) => l && !l.id?.startsWith("meta_") && (Boolean(l.title?.trim()) || Boolean(l.url?.trim()))
    );

    if (validExisting.length >= 3) {
      alert("⚠️ Maximum Limit Reached:\n\nYou can add a maximum of 3 Additional Links & Judgments to keep your chamber profile clean and focused.");
      return;
    }
    const newLink = {
      id: Date.now().toString(),
      title: "",
      url: "",
    };
    setProfile((prev) => ({
      ...prev,
      customLinks: [...validExisting, newLink],
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

  const clearAllCustomLinks = () => {
    setProfile((prev) => ({
      ...prev,
      customLinks: [],
    }));
  };

  // News Media handlers (Max 7 Allowed)
  const addNewsMedia = () => {
    if ((profile.newsMedia || []).length >= 7) {
      alert("⚠️ Maximum Limit Reached:\n\nYou can add a maximum of 7 Newspaper & Press Coverage articles to maintain fast mobile performance for clients.");
      return;
    }
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
      `NOTE:Digital Chamber: ${publicUrl}\\nBar Registration: ${profile.enrollmentNo || "Registered"}${
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
      ctx.fillText(profile.fullName || "Advocate", 500, 150);

      // Subtitle Bar Council
      ctx.fillStyle = "#526057";
      ctx.font = "24px sans-serif";
      ctx.fillText(`Advocate • Bar Council: ${profile.enrollmentNo || "Registered"}`, 500, 205);

      // Draw QR Code in center (court name removed for clean, focused layout)
      ctx.drawImage(img, 175, 260, 650, 650);

      // Footer
      ctx.fillStyle = "#14231C";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("SCAN TO CONNECT • DIGITAL CHAMBER", 500, 1005);

      ctx.fillStyle = "#6B7870";
      ctx.font = "20px sans-serif";
      ctx.fillText(publicUrl, 500, 1050);

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
            <Link href="/" className="group py-0.5">
              <Logo size="sm" />
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
              disabled={isSaving}
              className="flex items-center gap-1.5 bg-[#163826] hover:bg-[#1E4A33] active:scale-95 text-[#FAF7F2] font-bold text-xs px-5 py-2.5 rounded-full shadow-sm transition-all disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#E6D5B8]" />
                  <span>Saving...</span>
                </>
              ) : savedStatus === "saved" ? (
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
                      (profile.slug || "").length >= 4 && (profile.slug || "").length <= 20
                        ? "text-[#163826]"
                        : "text-amber-600"
                    }`}
                  >
                    {(profile.slug || "").length >= 4 && (profile.slug || "").length <= 20
                      ? `✓ Valid (${(profile.slug || "").length}/20 chars)`
                      : `${(profile.slug || "").length}/20 chars (min 4)`}
                  </span>
                </div>
                <div
                  className={`flex items-center bg-[#FAF8F5] border rounded-xl px-3 py-2.5 text-sm transition-all focus-within:bg-white ${
                    (profile.slug || "").length > 0 &&
                    ((profile.slug || "").length < 4 || (profile.slug || "").length > 20)
                      ? "border-amber-400 focus-within:border-amber-500"
                      : "border-[#E7E0D5] focus-within:border-[#163826]"
                  }`}
                >
                  <span className="text-[#526057] text-xs font-mono">mychamber.me/</span>
                  <input
                    type="text"
                    minLength={4}
                    maxLength={20}
                    value={profile.slug}
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-_]/g, "")
                          .slice(0, 20),
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
                {(profile.slug || "").length >= 20 && (
                  <p className="text-[10px] text-[#526057] mt-1 font-medium">
                    Maximum 20 characters limit reached.
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

                {/* Privacy toggle: Hide enrollment number from public visitors */}
                <div className="mt-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E0D5] flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="hideEnrollmentNo"
                    checked={profile.hideEnrollmentNo === true}
                    onChange={(e) =>
                      setProfile({ ...profile, hideEnrollmentNo: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 rounded border-[#E7E0D5] text-[#163826] focus:ring-[#163826] accent-[#163826] cursor-pointer shrink-0"
                  />
                  <label htmlFor="hideEnrollmentNo" className="text-xs cursor-pointer select-none">
                    <span className="font-semibold text-[#14231C] block">
                      Hide enrollment number from public visitors (Keep private)
                    </span>
                    <span className="text-[11px] text-[#526057] block mt-0.5 leading-relaxed">
                      Your enrollment number remains securely verified in MyChamber records, but public visitors on your chamber profile link will only see your State Bar Council and Verified Advocate Badge.
                    </span>
                  </label>
                </div>
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
                  Upload a photo of your official Bar Council Certificate or Bar Association ID card. This locks your Bar Council registration to your profile, protects against mistaken duplicate claims, and activates your official <strong className="text-[#163826] font-semibold">Verified Advocate Badge</strong>.
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
                    disabled={isUploadingBarId}
                    onClick={() => barIdFileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#163826] text-xs font-semibold border border-[#E7E0D5] transition-colors disabled:opacity-50"
                  >
                    <Upload className={`w-3.5 h-3.5 ${isUploadingBarId ? "animate-spin" : ""}`} />
                    <span>{isUploadingBarId ? "Securing & Uploading Proof..." : profile.barIdCardUrl ? "Replace ID Proof" : "Upload Bar Council ID / Certificate"}</span>
                  </button>

                  {profile.barIdCardUrl && (
                    <div className="flex items-center gap-2">
                      {profile.barIdCardUrl.startsWith("storage://") ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF8F5] border border-emerald-600/30 text-emerald-800 rounded-lg text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>ID Document Secured</span>
                        </div>
                      ) : (
                        <img
                          src={profile.barIdCardUrl}
                          alt="Bar ID proof preview"
                          className="w-9 h-9 object-cover rounded-lg border border-[#E7E0D5] shadow-sm"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setProfile((prev) => ({ ...prev, barIdCardUrl: undefined }))}
                        className="text-xs text-rose-500 hover:text-rose-600 font-medium"
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

            {/* Verified Status (Read-Only: Controlled Exclusively by Admin Desk) */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E0D5]/60">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    profile.isVerified
                      ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
                      : "bg-[#163826]/10 text-[#163826]"
                  }`}
                >
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#14231C]">Bar Council Verification Status</p>
                  <p className="text-[11px] text-[#526057]">
                    {profile.isVerified
                      ? "Official Verified Shield Badge is active on your chamber profile."
                      : profile.barIdCardUrl
                      ? "ID Proof attached. Verification is under review by MyChamber Admin Desk."
                      : "Upload your Bar Council ID proof below to unlock the Verified Shield Badge."}
                  </p>
                </div>
              </div>
              <div className="shrink-0 ml-3">
                {profile.isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 border border-emerald-300 text-emerald-800 shadow-sm">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified
                  </span>
                ) : profile.barIdCardUrl ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 border border-amber-300 text-amber-800 shadow-sm">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Pending Review
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-100 border border-stone-300 text-stone-600">
                    Unverified
                  </span>
                )}
              </div>
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
                      disabled={isUploadingPhoto}
                      onClick={() => photoFileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 text-xs font-bold bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] px-4 py-2.5 rounded-full shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Camera className={`w-3.5 h-3.5 text-[#E6D5B8] ${isUploadingPhoto ? "animate-spin" : ""}`} />
                      <span>{isUploadingPhoto ? "Optimizing & Uploading..." : "Upload Portrait Photo"}</span>
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
                maxLength={800}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value.slice(0, 800) })}
                placeholder="Write a brief introduction about your chamber, areas of legal expertise, and courtroom advocacy..."
                className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl p-3.5 text-sm text-[#14231C] leading-relaxed focus:outline-none focus:border-[#163826]"
              />
              <div className="flex items-center justify-between text-[11px] text-[#526057] mt-1">
                <span>Maximum 800 characters</span>
                <span className={`font-mono ${profile.bio.length >= 800 ? "text-rose-600 font-semibold" : profile.bio.length >= 750 ? "text-amber-600 font-semibold" : ""}`}>
                  {profile.bio.length} / 800
                </span>
              </div>
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

              {/* Selected Practice Areas Active Badges (with ✕ to instantly remove custom or preset areas) */}
              {profile.specializations.length > 0 && (
                <div className="mb-2.5 flex flex-wrap gap-1.5 p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E7E0D5]/70">
                  <span className="text-[11px] text-[#526057] py-1 self-center mr-1">Active:</span>
                  {profile.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1.5 bg-[#163826] text-[#FAF7F2] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecialization(spec)}
                        className="text-[#FAF7F2]/80 hover:text-rose-300 font-bold ml-1 text-sm leading-none transition-colors"
                        title={`Remove ${spec}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Full pool including ALL presets AND custom practice areas */}
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-[#FAF8F5] rounded-xl border border-[#E7E0D5]">
                {Array.from(new Set([...ALL_SPECIALIZATIONS, ...profile.specializations])).map((spec) => {
                  const selected = profile.specializations.includes(spec);
                  const isCustom = !ALL_SPECIALIZATIONS.includes(spec);
                  return (
                    <span
                      key={spec}
                      className={`inline-flex items-center rounded-full text-xs font-medium transition-all ${
                        selected
                          ? "bg-[#163826] text-[#FAF7F2] font-semibold"
                          : "bg-white text-[#526057] border border-[#E7E0D5] hover:border-[#163826]/40 hover:text-[#14231C]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSpecialization(spec)}
                        className="px-3 py-1.5"
                      >
                        {selected ? "✓ " : "+ "}
                        {spec}
                      </button>
                      {isCustom && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSpecialization(spec);
                          }}
                          className={`pr-2.5 pl-0.5 text-xs font-bold ${
                            selected ? "text-rose-300 hover:text-white" : "text-rose-500 hover:text-rose-700"
                          }`}
                          title={`Permanently delete custom area ${spec}`}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>

              {/* Add custom specialization */}
              <div className="mt-2.5 flex gap-2">
                <input
                  type="text"
                  maxLength={40}
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSpecialization())}
                  placeholder="Add custom practice area (3-40 chars, e.g. Armed Forces Tribunal, Insolvency...)"
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
                  maxLength={60}
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
                  placeholder={`e.g. Hello Adv. ${profile.fullName || "Advocate"}, I found your digital chamber profile on My Chamber and would like to consult regarding a legal matter.`}
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

            {/* Smart URL Helper Guidance Banner */}
            <div className="bg-[#FAF8F5] border border-[#E7E0D5] rounded-2xl p-3.5 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#163826]/10 text-[#163826] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs text-[#526057] space-y-1">
                <p className="font-semibold text-[#14231C]">
                  Smart Auto-Formatting Enabled
                </p>
                <p className="leading-relaxed">
                  Enter your full URL (e.g. <span className="font-mono text-[#163826] bg-white px-1.5 py-0.5 rounded border border-[#E7E0D5]">https://instagram.com/handle</span>) or simply type your handle (e.g. <span className="font-mono text-[#163826] bg-white px-1.5 py-0.5 rounded border border-[#E7E0D5]">@handle</span>). MyChamber automatically converts it into a verified working link.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {/* Instagram */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#526057]">
                    Instagram Profile URL
                  </label>
                  {profile.instagramUrl && (
                    <a
                      href={normalizeSocialUrl("instagram", profile.instagramUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#163826] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={profile.instagramUrl || ""}
                  onChange={(e) => setProfile({ ...profile, instagramUrl: e.target.value })}
                  onBlur={() => {
                    if (profile.instagramUrl) {
                      setProfile({
                        ...profile,
                        instagramUrl: normalizeSocialUrl("instagram", profile.instagramUrl),
                      });
                    }
                  }}
                  placeholder="https://instagram.com/handle or @handle"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#526057]">
                    LinkedIn Profile URL
                  </label>
                  {profile.linkedinUrl && (
                    <a
                      href={normalizeSocialUrl("linkedin", profile.linkedinUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#163826] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={profile.linkedinUrl || ""}
                  onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  onBlur={() => {
                    if (profile.linkedinUrl) {
                      setProfile({
                        ...profile,
                        linkedinUrl: normalizeSocialUrl("linkedin", profile.linkedinUrl),
                      });
                    }
                  }}
                  placeholder="https://linkedin.com/in/handle or handle"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              {/* Twitter / X */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#526057]">
                    Twitter / X Profile URL
                  </label>
                  {profile.twitterUrl && (
                    <a
                      href={normalizeSocialUrl("twitter", profile.twitterUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#163826] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={profile.twitterUrl || ""}
                  onChange={(e) => setProfile({ ...profile, twitterUrl: e.target.value })}
                  onBlur={() => {
                    if (profile.twitterUrl) {
                      setProfile({
                        ...profile,
                        twitterUrl: normalizeSocialUrl("twitter", profile.twitterUrl),
                      });
                    }
                  }}
                  placeholder="https://x.com/handle or @handle"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              {/* YouTube */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#526057]">
                    YouTube Channel / Legal Discussions URL
                  </label>
                  {profile.youtubeUrl && (
                    <a
                      href={normalizeSocialUrl("youtube", profile.youtubeUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#163826] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={profile.youtubeUrl || ""}
                  onChange={(e) => setProfile({ ...profile, youtubeUrl: e.target.value })}
                  onBlur={() => {
                    if (profile.youtubeUrl) {
                      setProfile({
                        ...profile,
                        youtubeUrl: normalizeSocialUrl("youtube", profile.youtubeUrl),
                      });
                    }
                  }}
                  placeholder="https://youtube.com/@handle or @handle"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              {/* Facebook */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#526057]">
                    Facebook Page / Chamber URL
                  </label>
                  {profile.facebookUrl && (
                    <a
                      href={normalizeSocialUrl("facebook", profile.facebookUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#163826] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={profile.facebookUrl || ""}
                  onChange={(e) => setProfile({ ...profile, facebookUrl: e.target.value })}
                  onBlur={() => {
                    if (profile.facebookUrl) {
                      setProfile({
                        ...profile,
                        facebookUrl: normalizeSocialUrl("facebook", profile.facebookUrl),
                      });
                    }
                  }}
                  placeholder="https://facebook.com/handle or handle"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>

              {/* Official Website */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#526057]">
                    Official Website URL
                  </label>
                  {profile.websiteUrl && (
                    <a
                      href={normalizeSocialUrl("website", profile.websiteUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#163826] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Test Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={profile.websiteUrl || ""}
                  onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
                  onBlur={() => {
                    if (profile.websiteUrl) {
                      setProfile({
                        ...profile,
                        websiteUrl: normalizeSocialUrl("website", profile.websiteUrl),
                      });
                    }
                  }}
                  placeholder="https://yourchamber.com or yourchamber.com"
                  className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3.5 py-2.5 text-sm text-[#14231C] focus:outline-none focus:border-[#163826]"
                />
              </div>
            </div>
          </div>

          {/* ── Box: Additional Links & Judgments (Dedicated Box) ─────────── */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E7E0D5] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE4]">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-[#163826]" />
                <h2 className="text-sm font-semibold text-[#14231C] uppercase tracking-wider">
                  Additional Links & Judgments
                </h2>
                <span className="text-[11px] font-bold text-[#163826] bg-[#EBF3ED] px-2 py-0.5 rounded-full border border-[#163826]/20">
                  {profile.customLinks?.length || 0}/3 Max
                </span>
              </div>
              <div className="flex items-center gap-2">
                {(profile.customLinks || []).length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllCustomLinks}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={addCustomLink}
                  disabled={(profile.customLinks || []).length >= 3}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors shadow-sm ${
                    (profile.customLinks || []).length >= 3
                      ? "bg-[#F3EFE6] text-[#8C9890] border-[#E7E0D5] cursor-not-allowed"
                      : "bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] border-[#163826]/30"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {(profile.customLinks || []).length >= 3
                      ? "Limit Reached (3/3)"
                      : "Add Link / Judgment"}
                  </span>
                </button>
              </div>
            </div>

            <p className="text-xs text-[#526057] leading-relaxed">
              Add external case orders, reported judgment citations (e.g. SCC / PLR / DLT), legal articles, or publications (max 3 links).
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
                <span className="text-[11px] font-bold text-[#163826] bg-[#EBF3ED] px-2 py-0.5 rounded-full border border-[#163826]/20">
                  {profile.newsMedia?.length || 0}/7 Max
                </span>
              </div>
              <button
                type="button"
                onClick={addNewsMedia}
                disabled={(profile.newsMedia || []).length >= 7}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                  (profile.newsMedia || []).length >= 7
                    ? "bg-[#F3EFE6] text-[#8C9890] border-[#E7E0D5] cursor-not-allowed"
                    : "bg-[#EBF3ED] hover:bg-[#DEECE1] text-[#163826] border-[#163826]/30"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {(profile.newsMedia || []).length >= 7
                    ? "Limit Reached (7/7)"
                    : "Add News Article"}
                </span>
              </button>
            </div>

            <p className="text-xs text-[#526057]">
              Showcase newspaper headlines, media coverage, and court reports in an interactive visual carousel on your chamber card (maximum 7 featured articles to keep mobile card loading fast).
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
                <span className="text-[#dadce0] font-medium">Digital Chamber</span>
                <span>›</span>
                <span className="text-[#526057] font-mono text-[11px]">mychamber.me › {profile.slug || "advocate"}</span>
              </div>

              {/* Blue Title Link */}
              <h3 className="text-base sm:text-lg font-medium text-[#163826] hover:underline cursor-pointer">
                {profile.fullName || "Advocate"} | Digital Chamber Profile
              </h3>

              {/* Snippet Description */}
              <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-3">
                Official Digital Chamber profile of {profile.fullName || "Advocate"}, Advocate practicing at {profile.courts?.[0] || "High Court"}. Bar Council No: {profile.enrollmentNo || "Registered"}. Experience: {profile.yearsExp || 1}+ Years. Specialized in {(profile.specializations || []).slice(0, 3).join(", ") || "Constitutional, Civil & Criminal Law"}.
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
                disabled={isSaving}
                className="bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold text-xs px-6 py-2.5 rounded-full shadow-sm transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E6D5B8]" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#E6D5B8]" />
                    <span>Save & Update Profile</span>
                  </>
                )}
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

      {/* ── Congratulations & Live Chamber Address Popup Modal ───────────────── */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#FAF8F5] border-2 border-[#D4AF37]/50 rounded-3xl p-5 sm:p-6 shadow-2xl text-center space-y-3.5 animate-in zoom-in-95 duration-200 text-[#14231C]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-3.5 right-3.5 p-1.5 text-stone-400 hover:text-stone-700 rounded-full bg-black/5 hover:bg-black/10 transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Square: Advocate Portrait Photo with Verified Checkmark */}
            <div className="relative mx-auto w-14 h-14 rounded-xl p-0.5 bg-gradient-to-br from-[#D4AF37] via-[#E5C768] to-[#163826] shadow-md">
              <div className="w-full h-full rounded-[10px] overflow-hidden bg-white flex items-center justify-center">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#163826] flex items-center justify-center text-white font-serif font-bold text-base">
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
              </div>
              {/* Green Verified Check Badge */}
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-sm"
                title="Verified Chamber"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#163826] bg-[#163826]/10 border border-[#163826]/20 px-2.5 py-0.5 rounded-full">
                Profile Updated & Saved
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#14231C]">
                Congratulations!
              </h2>
              <p className="text-xs text-[#526057] leading-relaxed max-w-xs mx-auto">
                Your official <strong className="text-[#163826] font-semibold">Digital Chamber</strong> is now Live and ready to share with clients, colleagues, and courts.
              </p>
            </div>

            {/* Chamber Address Box */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#E7E0D5] text-left space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase tracking-wider text-[#163826] flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-[#D4AF37]" />
                  Your Chamber Address
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Online
                </span>
              </div>

              {/* Click-to-copy URL box */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF8F5] border border-[#D4AF37]/40 shadow-inner">
                <input
                  type="text"
                  readOnly
                  value={`${origin}/${profile.slug}`}
                  className="bg-transparent text-xs font-mono font-medium text-[#14231C] flex-1 outline-none select-all"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${origin}/${profile.slug}`);
                    setCopiedModalAddress(true);
                    setTimeout(() => setCopiedModalAddress(false), 2500);
                  }}
                  className="px-3 py-1 rounded-lg bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] text-xs font-bold transition flex items-center gap-1 shrink-0 active:scale-95 shadow-sm"
                >
                  {copiedModalAddress ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#D4AF37]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Inspiring Judicial Quote by Nani A. Palkhivala */}
            <div className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#163826]/5 via-[#D4AF37]/10 to-[#163826]/5 border border-[#D4AF37]/30 text-center">
              <p className="text-[11px] font-serif italic text-[#163826] leading-snug">
                &ldquo;The highest duty of an advocate is not merely to win, but to assist in the fearless pursuit of truth and justice.&rdquo;
              </p>
              <p className="text-[9px] font-bold tracking-wider uppercase text-[#8C7335] mt-0.5">
                — Nani A. Palkhivala
              </p>
            </div>

            {/* Action Buttons: WhatsApp Share & View Live */}
            <div className="space-y-2 pt-0.5">
              {/* WhatsApp Share Button */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Greetings! Here is the official Digital Chamber of ${profile.fullName || "Advocate"} (${profile.enrollmentNo || "Bar Council Registered"}):\n${origin}/${profile.slug}\n\nYou can review my courtroom particulars, practice areas, chamber location, and save my direct phonebook contact.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#25D366]/25 transition-all active:scale-[0.98]"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Share Address on WhatsApp</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                {/* View Chamber Button */}
                <a
                  href={`/${profile.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#163826]/30 text-[#163826] font-bold text-xs transition shadow-sm active:scale-[0.98]"
                >
                  <Eye className="w-3.5 h-3.5 text-[#163826]" />
                  <span>View Chamber ↗</span>
                </a>

                {/* Dismiss Button */}
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex items-center justify-center py-2.5 px-3 rounded-xl bg-black/5 hover:bg-black/10 text-[#526057] font-semibold text-xs transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
