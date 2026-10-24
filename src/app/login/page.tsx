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
          : "https://my-chamber.vercel.app/dashboard";

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
        .from("advocates")
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
          : "https://my-chamber.vercel.app/dashboard";

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
          : "https://my-chamber.vercel.app/login";

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
      const { data, error } = await supabase.auth.signUp({
        email: identifier,
        password,
        options: {
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
      <main className="min-h-screen bg-[#0e0e10] text-[#f1f3f4] flex items-center justify-center px-4 pt-24 pb-12 font-sans">
        <div className="w-full max-w-md">
          
          {/* Main Container Card */}
          <div className="bg-[#18191c] border border-[#2d3139] rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-br from-[#8ab4f8] to-[#1a73e8] rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-[#1a73e8]/20 text-[#0e0e10]">
                <Scale className="w-7 h-7 font-bold" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {currentUser ? "Chamber Session Active" : "Advocate Portal"}
              </h1>
              <p className="text-[#9aa0a6] text-xs sm:text-sm mt-1">
                {currentUser
                  ? `Signed in as ${currentUser.email}`
                  : "Sign in to manage your Virtual Chamber profile & judgments"}
              </p>
            </div>

            {/* ── If User is Already Logged In ─────────────────────────────────── */}
            {currentUser ? (
              <div className="space-y-4">
                <div className="bg-[#202227] border border-[#343840] rounded-2xl p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <p className="text-white text-sm font-semibold">{currentUser.email}</p>
                  <p className="text-xs text-emerald-400 font-medium mt-1">
                    ✓ Verified Advocate Authentication
                  </p>
                </div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center justify-center gap-2 bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#0e0e10] font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Advocate Studio / Dashboard</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 bg-[#202227] hover:bg-[#2c282d] text-rose-300 hover:text-rose-200 border border-rose-500/30 hover:border-rose-500/50 text-xs font-semibold py-3 rounded-xl transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
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
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 active:bg-slate-200 text-[#1f2937] font-semibold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] border border-slate-200 disabled:opacity-50"
                >
                  <GoogleIcon className="w-5 h-5 shrink-0" />
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-[#2d3139] w-full" />
                  <span className="bg-[#18191c] px-3 text-[11px] uppercase tracking-wider text-[#9aa0a6] font-medium shrink-0">
                    or with Email / Bar Council ID
                  </span>
                </div>

                {/* Status Message Notification */}
                {message && (
                  <div
                    className={`p-3.5 rounded-xl text-xs space-y-2.5 ${
                      message.type === "success"
                        ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/70 border border-rose-500/40 text-rose-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {message.type === "success" ? (
                        <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      )}
                      <span className="leading-relaxed">{message.text}</span>
                    </div>

                    {message.text.includes("already registered") && (
                      <button
                        type="button"
                        onClick={() => {
                          setClaimStatus("idle");
                          setShowClaimModal(true);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs shadow-md transition-all active:scale-95"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-black" />
                        <span>Is this your Bar Council ID? Claim Chamber</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Sub-Tabs: Magic Link vs Password vs Sign Up */}
                <div className="flex bg-[#202227] p-1 rounded-xl border border-[#343840] text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setTab("magic");
                      setMessage(null);
                    }}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      tab === "magic"
                        ? "bg-[#8ab4f8] text-[#0e0e10] shadow-sm font-bold"
                        : "text-[#9aa0a6] hover:text-white"
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
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      tab === "password"
                        ? "bg-[#8ab4f8] text-[#0e0e10] shadow-sm font-bold"
                        : "text-[#9aa0a6] hover:text-white"
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
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      tab === "signup"
                        ? "bg-[#8ab4f8] text-[#0e0e10] shadow-sm font-bold"
                        : "text-[#9aa0a6] hover:text-white"
                    }`}
                  >
                    <span>Register</span>
                  </button>
                </div>

                {/* ── TAB 1: Magic Link (Passwordless 1-Click) ──────────────── */}
                {tab === "magic" && (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div>
                      <label className="block text-[#c4c7c5] text-xs font-semibold mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8ab4f8]" />
                        <input
                          type="email"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="advocate@chamber.in or @gmail.com"
                          className="w-full bg-[#202227] border border-[#343840] text-white placeholder-[#5f6368] rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#8ab4f8] text-sm"
                        />
                      </div>
                      <p className="text-[11px] text-[#9aa0a6] mt-1.5 leading-relaxed">
                        ✦ No password required. We will email you a secure 1-click link to log in directly on your phone or laptop.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#0e0e10] font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending Magic Link...
                        </span>
                      ) : (
                        <>
                          <span>Send 1-Click Magic Link</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ── TAB 2: Password Sign In (Face ID & iCloud Keychain Compatible) ── */}
                {tab === "password" && (
                  <form onSubmit={handlePasswordAuth} className="space-y-4">
                    <div>
                      <label className="block text-[#c4c7c5] text-xs font-semibold mb-1.5 flex items-center justify-between">
                        <span>Email or Bar Council ID</span>
                        <span className="text-[10px] text-[#8ab4f8] font-normal font-mono">
                          e.g. PH/7797/2025
                        </span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8ab4f8]" />
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="Email or Bar Council No."
                          className="w-full bg-[#202227] border border-[#343840] text-white placeholder-[#5f6368] rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#8ab4f8] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[#c4c7c5] text-xs font-semibold">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-[11px] text-[#8ab4f8] hover:text-[#aecbfa] hover:underline transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8ab4f8]" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-[#202227] border border-[#343840] text-white placeholder-[#5f6368] rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#8ab4f8] text-sm"
                        />
                      </div>
                      <p className="text-[11px] text-[#71767b] mt-1">
                        🔒 Compatible with Apple iCloud Keychain & Android Autofill (Face ID / Touch ID).
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#0e0e10] font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Authenticating...
                        </span>
                      ) : (
                        <>
                          <span>Sign In to Chamber</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ── TAB 3: Register New Chamber Profile ────────────────────── */}
                {tab === "signup" && (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <label className="block text-[#c4c7c5] text-xs font-semibold mb-1.5">
                        Advocate Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Adv. RajaVikrant Sharma"
                        className="w-full bg-[#202227] border border-[#343840] text-white placeholder-[#5f6368] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8ab4f8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#c4c7c5] text-xs font-semibold mb-1.5 flex items-center justify-between">
                        <span>Bar Council Enrollment Number</span>
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                          * Mandatory
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        value={enrollmentNo}
                        onChange={(e) => setEnrollmentNo(e.target.value)}
                        placeholder="e.g. PH/7797/2025 or D/1234/2020"
                        className="w-full bg-[#202227] border border-[#343840] text-white placeholder-[#5f6368] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8ab4f8]"
                      />
                      <p className="text-[10px] text-[#9aa0a6] mt-1">
                        Strictly unique. Each advocate is permitted only 1 profile per Bar Council registration.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[#c4c7c5] text-xs font-semibold mb-1.5">
                        Official Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8ab4f8]" />
                        <input
                          type="email"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="advocate@chamber.in or @gmail.com"
                          className="w-full bg-[#202227] border border-[#343840] text-white placeholder-[#5f6368] rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#8ab4f8] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#c4c7c5] text-xs font-semibold mb-1.5">
                        Set Chamber Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8ab4f8]" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full bg-[#202227] border border-[#343840] text-white placeholder-[#5f6368] rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#8ab4f8] text-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#0e0e10] font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Chamber...
                        </span>
                      ) : (
                        <>
                          <span>Create Free Chamber Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Footer Security Badges */}
                <div className="pt-2 text-center flex items-center justify-center gap-3 text-[11px] text-[#71767b]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    256-bit Encrypted
                  </span>
                  <span>•</span>
                  <span>Free Forever</span>
                  <span>•</span>
                  <span>Bar Council of India</span>
                </div>

              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-xs text-[#9aa0a6] hover:text-white transition-colors"
              >
                ← Return to Virtual Chamber Home
              </Link>
            </div>

          </div>
        </div>

        {/* ── Chamber Ownership Dispute & Bar Council Claim Modal ───────────────── */}
        {showClaimModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-7 border border-[#343840] bg-[#18191c] text-[#f1f3f4] shadow-2xl space-y-4">
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
                  <p className="text-xs text-[#9aa0a6]">
                    Dispute review for Bar Council No:{" "}
                    <span className="text-amber-400 font-mono font-bold">
                      {enrollmentNo || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {claimStatus === "success" ? (
                <div className="bg-[#202227] border border-emerald-500/40 p-5 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-300">Ownership Claim Submitted</h4>
                  <p className="text-xs text-[#c4c7c5] leading-relaxed">
                    Your claim for Bar Council No.{" "}
                    <strong className="text-white font-mono">{enrollmentNo}</strong> has been logged.
                    Our legal verification desk will check the official State Bar Council enrollment roll and
                    resolve this within 24 hours.
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
                  <p className="text-xs text-[#c4c7c5] leading-relaxed">
                    If another person mistakenly entered your Bar Council number or you are the legitimate
                    advocate, submit your contact information and ID proof. We will verify and release the chamber
                    to you.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#9aa0a6] mb-1">
                        Advocate Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your official name on Bar roll"
                        className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8ab4f8]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#9aa0a6] mb-1">
                        Official Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="your.email@gmail.com"
                        className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8ab4f8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#9aa0a6] mb-1">
                      Mobile / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      required
                      value={claimPhone}
                      onChange={(e) => setClaimPhone(e.target.value)}
                      placeholder="+91-98XXXXXXXX"
                      className="w-full bg-[#202227] border border-[#343840] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8ab4f8]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#9aa0a6] mb-1">
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
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#202227] hover:bg-[#282a30] text-[#8ab4f8] text-xs font-semibold border border-[#343840] transition-colors"
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
                    <label className="block text-[11px] font-semibold text-[#9aa0a6] mb-1">
                      Explanation / Additional Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={claimNotes}
                      onChange={(e) => setClaimNotes(e.target.value)}
                      placeholder="e.g. Enrolled with Punjab and Haryana Bar Council in 2025. Please release this registration."
                      className="w-full bg-[#202227] border border-[#343840] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#8ab4f8]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowClaimModal(false)}
                      className="px-4 py-2 rounded-xl text-xs text-[#9aa0a6] hover:text-white transition-colors"
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

      </main>
    </>
  );
}
