"use client";

import Link from "next/link";
import { Scale, Menu, X, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E7E0D5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#163826] text-[#F3EFE6] flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
              <Scale className="w-4 h-4 text-[#E6D5B8]" />
            </div>
            <span className="font-extrabold text-[#14231C] text-lg tracking-tight">
              My Chamber<span className="text-[#163826] font-normal">✦</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-[#526057] hover:text-[#14231C] text-sm font-semibold transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="text-[#526057] hover:text-[#14231C] text-sm font-semibold transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#faq"
              className="text-[#526057] hover:text-[#14231C] text-sm font-semibold transition-colors"
            >
              FAQ
            </Link>

            {user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="text-xs font-bold text-[#FAF7F2] bg-[#163826] hover:bg-[#1E4A33] px-4 py-2 rounded-full shadow-sm transition-all flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#E6D5B8]" />
                  <span>Chamber Studio</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  title="Sign Out of Chamber"
                  className="flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-800 bg-[#FDF2F2] hover:bg-[#FEE2E2] border border-rose-200 px-3.5 py-2 rounded-full transition-colors font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-[#3F4D45] hover:text-[#14231C] text-sm font-semibold px-2 py-1.5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/login?tab=signup"
                  className="flex items-center gap-1.5 text-sm font-bold text-[#FAF7F2] bg-[#163826] hover:bg-[#1E4A33] px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow active:scale-95"
                >
                  <span>Sign Up Free</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#14231C] hover:bg-[#F3EFE6] p-2 rounded-full transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E7E0D5] px-5 py-4 flex flex-col gap-3 shadow-lg">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-[#3F4D45] hover:text-[#14231C] text-sm font-semibold py-1">Home</Link>
          <Link href="/#features" onClick={() => setMenuOpen(false)} className="text-[#3F4D45] hover:text-[#14231C] text-sm font-semibold py-1">Features</Link>
          <Link href="/#faq" onClick={() => setMenuOpen(false)} className="text-[#3F4D45] hover:text-[#14231C] text-sm font-semibold py-1">FAQ</Link>
          
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-[#163826] text-sm font-bold flex items-center gap-1.5 py-1">
                <LayoutDashboard className="w-4 h-4" />
                <span>Chamber Studio</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 text-xs font-bold text-rose-700 bg-[#FDF2F2] border border-rose-200 py-2.5 rounded-full mt-1 w-full"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out ({user.email})</span>
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2 border-t border-[#E7E0D5]">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-[#3F4D45] py-2 text-center"
              >
                Log In
              </Link>
              <Link
                href="/login?tab=signup"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-bold text-[#FAF7F2] bg-[#163826] hover:bg-[#1E4A33] px-4 py-2.5 rounded-full text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Sign Up Free</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
