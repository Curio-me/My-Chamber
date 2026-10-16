"use client";

import Link from "next/link";
import { Scale, Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#16171b]/90 backdrop-blur-md border-b border-[#2d3139]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#8ab4f8] to-[#1a73e8] rounded-lg flex items-center justify-center shadow-lg">
              <Scale className="w-4 h-4 text-[#0e0e10]" />
            </div>
            <span className="font-bold text-[#f1f3f4] text-lg tracking-tight">
              Virtual<span className="text-[#8ab4f8]"> Chamber</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-[#9aa0a6] hover:text-[#f1f3f4] text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/demo"
              className="text-[#9aa0a6] hover:text-[#f1f3f4] text-sm font-medium transition-colors"
            >
              Sample Profile
            </Link>
            <Link
              href="/dashboard"
              className="text-[#9aa0a6] hover:text-[#8ab4f8] text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Chamber Studio
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-[#0e0e10] bg-[#8ab4f8] hover:bg-[#aecbfa] px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              Open Your Chamber
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#9aa0a6] hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#18191c] border-t border-[#2d3139] px-4 py-4 flex flex-col gap-4">
          <Link href="/" className="text-[#9aa0a6] hover:text-white text-sm font-medium">Home</Link>
          <Link href="/demo" className="text-[#9aa0a6] hover:text-white text-sm font-medium">Sample Profile</Link>
          <Link href="/dashboard" className="text-[#8ab4f8] text-sm font-medium flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4" />
            Chamber Studio (Dashboard)
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-[#0e0e10] bg-[#8ab4f8] hover:bg-[#aecbfa] px-4 py-2 rounded-xl text-center transition-colors">
            Open Your Chamber
          </Link>
        </div>
      )}
    </nav>
  );
}
