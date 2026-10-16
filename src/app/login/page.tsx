import Link from "next/link";
import { Scale, Mail, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Login | Virtual Chamber",
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-[#080f1e] to-[#0f1d3c] flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-[#162348]/80 border border-[#c9a84c]/20 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#c9a84c] to-[#a0782e] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome to Virtual Chamber
              </h1>
              <p className="text-gray-400 text-sm">
                Sign in to manage your profile
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="advocate@email.com"
                    className="w-full bg-[#0f1d3c] border border-[#c9a84c]/20 text-white placeholder-gray-600 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#c9a84c]/60 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all text-sm"
                  />
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#e2c26e] text-[#0f1d3c] font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#c9a84c]/20">
                Send OTP
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-[#c9a84c]/10 text-center">
              <p className="text-gray-500 text-xs">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-[#c9a84c] hover:text-[#e2c26e] font-semibold transition-colors"
                >
                  Create your Chamber
                </Link>
              </p>
            </div>

            <p className="text-center text-gray-700 text-xs mt-4">
              We send a one-time password — no permanent password needed.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
