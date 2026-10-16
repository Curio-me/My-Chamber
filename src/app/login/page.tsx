"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scale, Mail, Lock, ArrowRight, Check, AlertCircle, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ type: "error", text: "Please enter both email and password." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
          setLoading(false);
          return;
        }

        if (data.session) {
          setMessage({ type: "success", text: "Logged in successfully! Redirecting..." });
          setTimeout(() => {
            router.push("/dashboard");
          }, 800);
        }
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
          setLoading(false);
          return;
        }

        if (data.user) {
          setMessage({
            type: "success",
            text: "Account registered! If confirmation email is required, check your inbox, or you can log in now.",
          });
          setMode("login");
        }
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
    setMessage({ type: "success", text: "Signed out successfully." });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-[#080f1e] to-[#0f1d3c] flex items-center justify-center px-4 pt-24 pb-12 font-sans">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-[#162348]/90 border border-[#c9a84c]/20 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#c9a84c] to-[#a0782e] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#c9a84c]/20">
                <Scale className="w-7 h-7 text-[#0e0e10]" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1.5">
                {currentUser ? "Chamber Session Active" : mode === "login" ? "Advocate Sign In" : "Create Advocate Account"}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">
                {currentUser
                  ? `Signed in as ${currentUser.email}`
                  : mode === "login"
                  ? "Access and update your Virtual Chamber"
                  : "Claim your verified legal chamber URL"}
              </p>
            </div>

            {/* If user is already logged in */}
            {currentUser ? (
              <div className="space-y-4">
                <div className="bg-[#0f1d3c] border border-[#c9a84c]/30 rounded-2xl p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="text-white text-sm font-semibold">{currentUser.email}</p>
                  <p className="text-xs text-gray-400 mt-1">You are authenticated with Supabase</p>
                </div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#e2c26e] text-[#0f1d3c] font-bold py-3 rounded-xl transition-all shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  Go to Chamber Studio
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full text-xs text-gray-400 hover:text-rose-400 py-2 transition-colors"
                >
                  Sign Out of Account
                </button>
              </div>
            ) : (
              /* Auth Form */
              <form onSubmit={handleAuth} className="space-y-4">
                {message && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                      message.type === "success"
                        ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {message.type === "success" ? (
                      <Check className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{message.text}</span>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="advocate@barcouncil.org"
                      className="w-full bg-[#0f1d3c] border border-[#c9a84c]/20 text-white placeholder-gray-600 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#c9a84c] text-sm"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#0f1d3c] border border-[#c9a84c]/20 text-white placeholder-gray-600 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#c9a84c] text-sm"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#e2c26e] active:bg-[#a0782e] text-[#0f1d3c] font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#c9a84c]/20 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <span>Verifying...</span>
                  ) : mode === "login" ? (
                    <>
                      <span>Sign In to Chamber</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Create My Chamber</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Toggle Login / Register */}
                <div className="pt-4 border-t border-[#c9a84c]/10 text-center">
                  {mode === "login" ? (
                    <p className="text-gray-400 text-xs">
                      Don&apos;t have an advocate account yet?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signup");
                          setMessage(null);
                        }}
                        className="text-[#c9a84c] hover:text-[#e2c26e] font-semibold underline underline-offset-2 ml-1"
                      >
                        Sign Up Here
                      </button>
                    </p>
                  ) : (
                    <p className="text-gray-400 text-xs">
                      Already registered?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setMessage(null);
                        }}
                        className="text-[#c9a84c] hover:text-[#e2c26e] font-semibold underline underline-offset-2 ml-1"
                      >
                        Sign In Here
                      </button>
                    </p>
                  )}
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                ← Return to Home
              </Link>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
