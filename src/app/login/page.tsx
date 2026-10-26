"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Scale,
  Mail,
  Lock,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  KeyRound,
  FileBadge,
  Loader2,
  LogOut,
  X,
  Upload,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase, checkBarCouncilUnique, submitChamberClaim } from "@/lib/supabase";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"magic" | "password" | "signup">("magic");
  const [identifier, setIdentifier] = useState(""); // Email or Bar Council Enrollment No
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimPhone, setClaimPhone] = useState("");
  const [claimNotes, setClaimNotes] = useState("");
  const [claimProofUrl, setClaimProofUrl] = useState("");
  const [claimStatus, setClaimStatus] = useState<"idle" | "submitting" | "success">("idle");
  const claimProofFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimStatus("submitting");
    const conflictingSlug = message?.text?.match(/@([a-zA-Z0-9_-]+)/)?.[1] || undefined;
    await submitChamberClaim({
      enrollmentNo: enrollmentNo || identifier,
      claimantName: fullName || "Advocate",
      claimantEmail: identifier.includes("@") ? identifier : "",
      claimantPhone: claimPhone,
      notes: claimNotes,
      proofUrl: claimProofUrl,
      conflictingSlug,
    });
    setClaimStatus("success");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "signup" || tabParam === "register") {
        setTab("signup");
      } else if (tabParam === "password") {
        setTab("password");
      } else if (tabParam === "magic") {
        setTab("magic");
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setCurrentUser(data.session.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // ── 1. Google 1-Tap OAuth Sign-In ──────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/dashboard`
          : "https://mychamber.me/dashboard";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to initiate Google sign in." });
      setLoading(false);
    }
  };

  // Helper: resolve email if advocate entered a Bar Council Enrollment number
  const resolveEmailFromInput = async (input: string): Promise<string> => {
    const trimmed = input.trim();
    if (trimmed.includes("@")) {
      return trimmed;
    }

    // Attempt to lookup advocate's email by Bar Council Enrollment No
    try {
      const { data } = await supabase
        .from("advocate_profiles")
        .select("email")
        .ilike("enrollment_no", `%${trimmed}%`)
        .limit(1)
        .maybeSingle();

      if (data && data.email) {
        return data.email;
      }
    } catch {
      // ignore lookup error
    }

    return trimmed;
  };

  // ── 2. Passwordless Magic Link Sign-In ──────────────────────────────────────
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const resolvedEmail = await resolveEmailFromInput(identifier);
      if (!resolvedEmail.includes("@")) {
        setMessage({
          type: "error",
          text: "Please enter a valid email address to receive your magic login link.",
        });
        setLoading(false);
        return;
      }

      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/dashboard`
          : "https://mychamber.me/dashboard";

      const { error } = await supabase.auth.signInWithOtp({
        email: resolvedEmail,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: `Magic link sent to ${resolvedEmail}! Open your email app (Gmail / Apple Mail) and tap the link to log in instantly.`,
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to send magic link." });
    } finally {
      setLoading(false);
    }
  };

  // ── 3. Password Sign-In (Supports iCloud Keychain & Face ID) ────────────────
  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setMessage({ type: "error", text: "Please enter both identifier and password." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const resolvedEmail = await resolveEmailFromInput(identifier);
      if (!resolvedEmail.includes("@")) {
        setMessage({
          type: "error",
          text: "No account found matching this Bar Council ID. Please use your registered email address.",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: resolvedEmail,
        password,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
        return;
      }

      if (data.session) {
        setMessage({ type: "success", text: "Logged in successfully! Redirecting to studio..." });
        setTimeout(() => {
          router.push("/dashboard");
        }, 700);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot Password Request ────────────────────────────────────────────────
  const handleForgotPassword = async () => {
    if (!identifier) {
      setMessage({
        type: "error",
        text: "Please enter your email in the field above, then click 'Forgot Password?'.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const resolvedEmail = await resolveEmailFromInput(identifier);
      if (!resolvedEmail.includes("@")) {
        setMessage({
          type: "error",
          text: "Please enter a valid email address to receive password reset instructions.",
        });
        setLoading(false);
        return;
      }

      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : "https://mychamber.me/login";

      const { error } = await supabase.auth.resetPasswordForEmail(resolvedEmail, {
        redirectTo,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: `Password reset link sent to ${resolvedEmail}! Check your inbox.`,
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to send reset link." });
    } finally {
      setLoading(false);
    }
  };

  // ── 4. Sign Up / Register New Chamber ──────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setMessage({ type: "error", text: "Please fill in email and password to create your account." });
      return;
    }

    if (!identifier.includes("@")) {
      setMessage({ type: "error", text: "Please provide a valid email address for account creation." });
      return;
    }

    if (!enrollmentNo || !enrollmentNo.trim()) {
      setMessage({
        type: "error",
        text: "Bar Council Enrollment Number is mandatory. Multiple profiles with the same Bar Council Number are not allowed.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1. Strict check: verify Bar Council Number uniqueness across all profiles
      const uniqueCheck = await checkBarCouncilUnique(enrollmentNo, "");
      if (!uniqueCheck.isUnique) {
        setLoading(false);
        setMessage({
          type: "error",
          text: `Bar Council Number (${enrollmentNo}) is already registered to another chamber (@${uniqueCheck.conflictingSlug}). Each advocate may only have 1 profile per unique Bar Council registration. Multiple profiles are strictly prohibited.`,
        });
        return;
      }

      // 2. Register account with Supabase
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/dashboard`
          : "https://mychamber.me/dashboard";

      const { data, error } = await supabase.auth.signUp({
        email: identifier,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName,
            enrollment_no: enrollmentNo.trim(),
          },
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
        return;
      }

      if (data.user) {
        setMessage({
          type: "success",
          text: "Chamber account created! Check your email for verification link or log in now.",
        });
        setTab("password");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setMessage({ type: "success", text: "Signed out of Chamber session successfully." });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF7F2] text-[#14231C] flex items-center justify-center px-4 pt-28 pb-16 font-sans">
        <div className="w-full max-w-md">
          
          {/* Main Container Card */}
          <div className="bg-white border border-[#E7E0D5] rounded-[32px] p-6 sm:p-9 shadow-sm">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#163826] rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-sm text-[#E6D5B8]">
                <Scale className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14231C] tracking-tight">
                {currentUser
                  ? "Chamber Session Active"
                  : tab === "signup"
                  ? "Create Your Chamber"
                  : "Advocate Portal"}
              </h1>
              <p className="text-[#526057] text-xs sm:text-sm mt-1.5 leading-relaxed">
                {currentUser
                  ? `Signed in as ${currentUser.email}`
                  : tab === "signup"
                  ? "Register your verified advocate profile & digital visiting card"
                  : "Sign in to manage your digital chamber profile, QR codes & practice links"}
              </p>
            </div>

            {/* ── If User is Already Logged In ─────────────────────────────────── */}
            {currentUser ? (
              <div className="space-y-4">
                <div className="bg-[#FAF8F5] border border-[#E7E0D5] rounded-2xl p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#EBF3ED] text-[#163826] flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <p className="text-[#14231C] text-sm font-bold">{currentUser.email}</p>
                  <p className="text-xs text-[#163826] font-semibold mt-1">
                    ✓ Verified Advocate Authentication
                  </p>
                </div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center justify-center gap-2 bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold py-3.5 rounded-full transition-all shadow-sm active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#E6D5B8]" />
                  <span>Open Advocate Studio / Dashboard</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 bg-[#FDF2F2] hover:bg-[#FEE2E2] text-rose-700 border border-rose-200 text-xs font-semibold py-3 rounded-full transition-all"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out of Chamber Account</span>
                </button>
              </div>
            ) : (
              /* ── Sign In / Register Forms ──────────────────────────────────── */
              <div className="space-y-5">
                
                {/* ── 1-Tap Google Sign In Button (FREE, 1-Click for Android & iPhone) ── */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#F3EFE6] active:bg-[#EBE4D8] text-[#14231C] font-semibold text-sm py-3 px-4 rounded-full shadow-sm transition-all active:scale-[0.98] border border-[#E7E0D5] disabled:opacity-50"
                >
                  <GoogleIcon className="w-5 h-5 shrink-0" />
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-[#E7E0D5] w-full" />
                  <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-[#6B7870] font-bold shrink-0">
                    or with Email / Bar Council ID
                  </span>
                </div>

                {/* Status Message Notification */}
                {message && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs space-y-2.5 ${
                      message.type === "success"
                        ? "bg-[#EBF3ED] border border-[#163826]/30 text-[#163826]"
                        : "bg-[#FDF2F2] border border-rose-300 text-rose-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {message.type === "success" ? (
                        <Check className="w-4 h-4 shrink-0 text-[#163826]" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      )}
                      <span className="leading-relaxed font-medium">{message.text}</span>
                    </div>

                    {message.text.includes("already registered") && (
                      <button
                        type="button"
                        onClick={() => {
                          setClaimStatus("idle");
                          setShowClaimModal(true);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold text-xs shadow-sm transition-all active:scale-95"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#E6D5B8]" />
                        <span>Is this your Bar Council ID? Claim Chamber</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Sub-Tabs: Magic Link vs Password vs Sign Up */}
                <div className="flex bg-[#F4EFEA] p-1.5 rounded-full border border-[#E7E0D5] text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setTab("magic");
                      setMessage(null);
                    }}
                    className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
                      tab === "magic"
                        ? "bg-[#163826] text-[#FAF7F2] shadow-sm font-bold"
                        : "text-[#526057] hover:text-[#14231C]"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Magic Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTab("password");
                      setMessage(null);
                    }}
                    className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
                      tab === "password"
                        ? "bg-[#163826] text-[#FAF7F2] shadow-sm font-bold"
                        : "text-[#526057] hover:text-[#14231C]"
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Password</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTab("signup");
                      setMessage(null);
                    }}
                    className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
                      tab === "signup"
                        ? "bg-[#163826] text-[#FAF7F2] shadow-sm font-bold"
                        : "text-[#526057] hover:text-[#14231C]"
                    }`}
                  >
                    <span>Create Chamber</span>
                  </button>
                </div>

                {/* ── TAB 1: Magic Link (Passwordless 1-Click) ──────────────── */}
                {tab === "magic" && (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div>
                      <label className="block text-[#14231C] text-xs font-semibold mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#163826]" />
                        <input
                          type="email"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="advocate@chamber.in or @gmail.com"
                          className="w-full bg-[#FAF8F5] border border-[#E7E0D5] text-[#14231C] placeholder-[#8C9890] rounded-xl px-4 py-3 pl-10 focus:bg-white focus:outline-none focus:border-[#163826] focus:ring-1 focus:ring-[#163826] text-sm transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-[#526057] mt-1.5 leading-relaxed">
                        ✦ No password required. We will email you a secure 1-click link to log in directly on your phone or laptop.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold py-3.5 rounded-full transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#E6D5B8]" />
                          Sending Magic Link...
                        </span>
                      ) : (
                        <>
                          <span>Send 1-Click Magic Link</span>
                          <ArrowRight className="w-4 h-4 text-[#E6D5B8]" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ── TAB 2: Password Sign In (Face ID & iCloud Keychain Compatible) ── */}
                {tab === "password" && (
                  <form onSubmit={handlePasswordAuth} className="space-y-4">
                    <div>
                      <label className="block text-[#14231C] text-xs font-semibold mb-1.5 flex items-center justify-between">
                        <span>Email or Bar Council ID</span>
                        <span className="text-[10px] text-[#163826] font-semibold font-mono bg-[#EBF3ED] px-2 py-0.5 rounded-full border border-[#163826]/20">
                          e.g. PH/7797/2025
                        </span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#163826]" />
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="Email or Bar Council No."
                          className="w-full bg-[#FAF8F5] border border-[#E7E0D5] text-[#14231C] placeholder-[#8C9890] rounded-xl px-4 py-3 pl-10 focus:bg-white focus:outline-none focus:border-[#163826] focus:ring-1 focus:ring-[#163826] text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[#14231C] text-xs font-semibold">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-[11px] text-[#163826] hover:underline font-semibold transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#163826]" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-[#FAF8F5] border border-[#E7E0D5] text-[#14231C] placeholder-[#8C9890] rounded-xl px-4 py-3 pl-10 focus:bg-white focus:outline-none focus:border-[#163826] focus:ring-1 focus:ring-[#163826] text-sm transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-[#6B7870] mt-1">
                        🔒 Compatible with Apple iCloud Keychain & Android Autofill (Face ID / Touch ID).
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold py-3.5 rounded-full transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#E6D5B8]" />
                          Authenticating...
                        </span>
                      ) : (
                        <>
                          <span>Sign In to Chamber</span>
                          <ArrowRight className="w-4 h-4 text-[#E6D5B8]" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ── TAB 3: Register New Chamber Profile ────────────────────── */}
                {tab === "signup" && (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <label className="block text-[#14231C] text-xs font-semibold mb-1.5">
                        Advocate Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Adv. RajaVikrant Sharma"
                        className="w-full bg-[#FAF8F5] border border-[#E7E0D5] text-[#14231C] placeholder-[#8C9890] rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-[#163826] focus:ring-1 focus:ring-[#163826] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[#14231C] text-xs font-semibold mb-1.5 flex items-center justify-between">
                        <span>Bar Council Enrollment Number</span>
                        <span className="text-[10px] text-[#163826] font-bold bg-[#EBF3ED] border border-[#163826]/30 px-2 py-0.5 rounded-full">
                          * Mandatory
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        value={enrollmentNo}
                        onChange={(e) => setEnrollmentNo(e.target.value)}
                        placeholder="e.g. PH/7797/2025 or D/1234/2020"
                        className="w-full bg-[#FAF8F5] border border-[#E7E0D5] text-[#14231C] placeholder-[#8C9890] rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-[#163826] focus:ring-1 focus:ring-[#163826] transition-all"
                      />
                      <p className="text-[10px] text-[#6B7870] mt-1">
                        Strictly unique. Each advocate is permitted only 1 profile per Bar Council registration.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[#14231C] text-xs font-semibold mb-1.5">
                        Official Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#163826]" />
                        <input
                          type="email"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="advocate@chamber.in or @gmail.com"
                          className="w-full bg-[#FAF8F5] border border-[#E7E0D5] text-[#14231C] placeholder-[#8C9890] rounded-xl px-4 py-3 pl-10 focus:bg-white focus:outline-none focus:border-[#163826] focus:ring-1 focus:ring-[#163826] text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#14231C] text-xs font-semibold mb-1.5">
                        Set Chamber Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#163826]" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full bg-[#FAF8F5] border border-[#E7E0D5] text-[#14231C] placeholder-[#8C9890] rounded-xl px-4 py-3 pl-10 focus:bg-white focus:outline-none focus:border-[#163826] focus:ring-1 focus:ring-[#163826] text-sm transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold py-3.5 rounded-full transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#E6D5B8]" />
                          Creating Chamber...
                        </span>
                      ) : (
                        <>
                          <span>Create Free Chamber Account</span>
                          <ArrowRight className="w-4 h-4 text-[#E6D5B8]" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Footer Security Badges */}
                <div className="pt-2 text-center flex items-center justify-center gap-3 text-[11px] text-[#6B7870] font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#163826]" />
                    256-bit Encrypted
                  </span>
                  <span>•</span>
                  <span>Free Forever</span>
                  <span>•</span>
                  <span>Bar Council Compliant</span>
                </div>

              </div>
            )}

            <div className="mt-6 text-center space-y-2">
              <div>
                <Link
                  href="/"
                  className="text-xs text-[#526057] hover:text-[#14231C] font-semibold transition-colors"
                >
                  ← Return to My Chamber Home
                </Link>
              </div>
              <div>
                <Link
                  href="/privacy"
                  className="text-[11px] text-[#6B7870] hover:text-[#163826] underline transition-colors"
                >
                  DPDP Act, 2023 Compliant Privacy Policy
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* ── Chamber Ownership Dispute & Bar Council Claim Modal ───────────────── */}
        {showClaimModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-7 border border-[#E7E0D5] bg-white text-[#14231C] shadow-2xl space-y-4">
              {/* Close button */}
              <button
                onClick={() => setShowClaimModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F3EFE6] text-[#6B7870] hover:text-[#14231C] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#163826] flex items-center justify-center text-[#E6D5B8] font-bold shadow-sm shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#14231C]">Claim Chamber Ownership</h3>
                  <p className="text-xs text-[#526057]">
                    Dispute review for Bar Council No:{" "}
                    <span className="text-[#163826] font-mono font-bold">
                      {enrollmentNo || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {claimStatus === "success" ? (
                <div className="bg-[#EBF3ED] border border-[#163826]/30 p-5 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#163826] text-[#FAF7F2] flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#163826]">Ownership Claim Submitted</h4>
                  <p className="text-xs text-[#3F4D45] leading-relaxed">
                    Your claim for Bar Council No.{" "}
                    <strong className="text-[#14231C] font-mono">{enrollmentNo}</strong> has been logged.
                    Our legal verification desk will check the official State Bar Council enrollment roll and
                    resolve this within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowClaimModal(false)}
                    className="px-6 py-2.5 rounded-full bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold text-xs transition-colors shadow-sm"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="space-y-3.5">
                  <p className="text-xs text-[#526057] leading-relaxed">
                    If another person mistakenly entered your Bar Council number or you are the legitimate
                    advocate, submit your contact information and ID proof. We will verify and release the chamber
                    to you.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3F4D45] mb-1">
                        Advocate Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your official name on Bar roll"
                        className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3 py-2 text-xs text-[#14231C] focus:bg-white focus:outline-none focus:border-[#163826]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3F4D45] mb-1">
                        Official Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="your.email@gmail.com"
                        className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3 py-2 text-xs text-[#14231C] focus:bg-white focus:outline-none focus:border-[#163826]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#3F4D45] mb-1">
                      Mobile / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      required
                      value={claimPhone}
                      onChange={(e) => setClaimPhone(e.target.value)}
                      placeholder="+91-98XXXXXXXX"
                      className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl px-3 py-2 text-xs text-[#14231C] focus:bg-white focus:outline-none focus:border-[#163826]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#3F4D45] mb-1">
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
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#163826] text-xs font-semibold border border-[#E7E0D5] transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{claimProofUrl ? "Change Proof Photo" : "Upload ID Proof"}</span>
                      </button>
                      {claimProofUrl && (
                        <span className="text-[11px] text-[#163826] font-semibold">✓ Document attached</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#3F4D45] mb-1">
                      Explanation / Additional Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={claimNotes}
                      onChange={(e) => setClaimNotes(e.target.value)}
                      placeholder="e.g. Enrolled with Punjab and Haryana Bar Council in 2025. Please release this registration."
                      className="w-full bg-[#FAF8F5] border border-[#E7E0D5] rounded-xl p-2.5 text-xs text-[#14231C] focus:bg-white focus:outline-none focus:border-[#163826]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowClaimModal(false)}
                      className="px-4 py-2 rounded-full text-xs text-[#526057] hover:text-[#14231C] transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={claimStatus === "submitting"}
                      className="px-5 py-2.5 rounded-full bg-[#163826] hover:bg-[#1E4A33] text-[#FAF7F2] font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                      {claimStatus === "submitting" ? "Submitting Claim..." : "Submit Ownership Claim"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </main>
    </>
  );
}
