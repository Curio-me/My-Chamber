"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  RefreshCw,
  Eye,
  Lock,
  LogOut,
  UserCheck,
  AlertCircle,
  Clock,
  Sparkles,
  FileText,
  Scale,
  Maximize2,
  X,
  RotateCw,
} from "lucide-react";
import { Advocate } from "@/lib/types";
import {
  fetchAllAdvocatesForAdmin,
  updateAdvocateVerificationStatus,
  getVerificationDocSignedUrl,
  supabase,
} from "@/lib/supabase";
import Logo from "@/components/Logo";

// Authorized administrator emails
const AUTHORIZED_ADMIN_EMAILS = [
  "mychamber.official@gmail.com",
  "rajavikrant.developer@gmail.com",
];

// Fallback Master Passkey for emergency admin access from any browser
const ADMIN_MASTER_PASSKEY = "mychamber2026";

export default function AdminVerificationPage() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"pending" | "all" | "verified" | "unverified">("pending");
  const [inspectAdvocate, setInspectAdvocate] = useState<Advocate | null>(null);
  const [inspectZoom, setInspectZoom] = useState(1);
  const [resolvedInspectUrl, setResolvedInspectUrl] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load secure signed URL when inspecting a document
  useEffect(() => {
    if (inspectAdvocate?.barIdCardUrl) {
      getVerificationDocSignedUrl(inspectAdvocate.barIdCardUrl).then(setResolvedInspectUrl);
    } else {
      setResolvedInspectUrl("");
    }
  }, [inspectAdvocate]);

  // Auth state
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [passkeyError, setPasskeyError] = useState(false);

  // Check auth session on load
  useEffect(() => {
    async function checkAuth() {
      // Check stored admin passkey in session
      const savedPasskey = sessionStorage.getItem("mychamber_admin_auth");
      if (savedPasskey === "true") {
        setIsAuthorized(true);
        loadAdvocates();
        return;
      }

      // Check Supabase session
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email?.toLowerCase();
      if (email) {
        setCurrentUserEmail(email);
        if (AUTHORIZED_ADMIN_EMAILS.includes(email)) {
          setIsAuthorized(true);
          loadAdvocates();
          return;
        }
      }

      setLoading(false);
    }
    checkAuth();
  }, []);

  async function loadAdvocates() {
    setLoading(true);
    const data = await fetchAllAdvocatesForAdmin();
    setAdvocates(data);
    setLoading(false);
  }

  function handlePasskeyLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passkeyInput.trim() === ADMIN_MASTER_PASSKEY) {
      sessionStorage.setItem("mychamber_admin_auth", "true");
      setIsAuthorized(true);
      setPasskeyError(false);
      loadAdvocates();
    } else {
      setPasskeyError(true);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("mychamber_admin_auth");
    setIsAuthorized(false);
    supabase.auth.signOut();
  }

  async function handleVerificationToggle(advocate: Advocate, verify: boolean) {
    setActionLoading(advocate.id);
    const newStatus = verify ? "verified" : "unverified";
    const res = await updateAdvocateVerificationStatus(advocate.id, verify, newStatus);
    if (res.success) {
      setAdvocates((prev) =>
        prev.map((a) =>
          a.id === advocate.id
            ? { ...a, isVerified: verify, verificationStatus: newStatus }
            : a
        )
      );
      if (inspectAdvocate?.id === advocate.id) {
        setInspectAdvocate({
          ...inspectAdvocate,
          isVerified: verify,
          verificationStatus: newStatus,
        });
      }
    } else {
      alert(`Failed to update status: ${res.error}`);
    }
    setActionLoading(null);
  }

  // Filtered advocates list
  const filteredAdvocates = advocates.filter((a) => {
    const matchesSearch =
      (a.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.slug || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.enrollmentNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === "pending") {
      // Pending review: Has uploaded ID proof but is either unverified or pending
      return Boolean(a.barIdCardUrl && (!a.isVerified || a.verificationStatus === "pending"));
    }
    if (filterTab === "verified") {
      return a.isVerified;
    }
    if (filterTab === "unverified") {
      return !a.isVerified;
    }
    return true;
  });

  // Count metrics
  const totalChambers = advocates.length;
  const pendingCount = advocates.filter(
    (a) => Boolean(a.barIdCardUrl && (!a.isVerified || a.verificationStatus === "pending"))
  ).length;
  const verifiedCount = advocates.filter((a) => a.isVerified).length;
  const withIdUploadsCount = advocates.filter((a) => Boolean(a.barIdCardUrl)).length;

  // ── Render: Access Gate if not authorized ──────────────────────────────────
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0B1510] text-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#122319] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#163826] border border-[#D4AF37]/40 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7 text-[#D4AF37]" />
          </div>

          <div>
            <h1 className="text-xl font-bold font-serif text-[#FAF7F2]">
              MyChamber Admin Portal
            </h1>
            <p className="text-xs text-[#8C9890] mt-1.5 leading-relaxed">
              Bar Council Document Verification & Directory Management
            </p>
          </div>

          <form onSubmit={handlePasskeyLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#C4C7C5] mb-1.5">
                Admin Master Passkey
              </label>
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter admin passkey..."
                className="w-full bg-[#0E1D14] border border-[#234D35] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder:text-[#526057]"
                autoFocus
              />
              {passkeyError && (
                <p className="text-xs text-rose-400 mt-1.5 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Incorrect admin passkey. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E5C768] text-[#0B1510] font-bold py-3 rounded-xl text-sm shadow-lg hover:brightness-105 active:scale-[0.98] transition-all"
            >
              Unlock Verification Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Render: Authorized Admin Dashboard ────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A130D] text-[#FAF7F2] font-sans antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#0E1D14]/90 backdrop-blur-md border-b border-[#234D35] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="sm" theme="dark" />
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-bold tracking-wide uppercase">
            Admin Verification
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdvocates}
            disabled={loading}
            className="p-2 rounded-xl bg-[#163826] hover:bg-[#1E4A33] text-stone-200 border border-[#234D35] transition"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#122319] border border-[#234D35] rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-[#8C9890] font-medium">Total Chambers</p>
            <p className="text-2xl font-bold font-serif text-[#FAF7F2] mt-1">{totalChambers}</p>
          </div>

          <div className="bg-[#122319] border border-amber-500/30 rounded-2xl p-4 shadow-sm bg-gradient-to-br from-[#122319] to-amber-950/20">
            <div className="flex items-center justify-between">
              <p className="text-xs text-amber-300 font-medium">Pending Review</p>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold font-serif text-amber-300 mt-1">{pendingCount}</p>
          </div>

          <div className="bg-[#122319] border border-emerald-500/30 rounded-2xl p-4 shadow-sm bg-gradient-to-br from-[#122319] to-emerald-950/20">
            <div className="flex items-center justify-between">
              <p className="text-xs text-emerald-300 font-medium">Verified Advocates</p>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-serif text-emerald-300 mt-1">{verifiedCount}</p>
          </div>

          <div className="bg-[#122319] border border-[#234D35] rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-[#8C9890] font-medium">Total ID Proofs Uploaded</p>
            <p className="text-2xl font-bold font-serif text-[#FAF7F2] mt-1">{withIdUploadsCount}</p>
          </div>
        </div>

        {/* Controls Bar: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#122319] border border-[#234D35] rounded-2xl p-3 sm:p-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setFilterTab("pending")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filterTab === "pending"
                  ? "bg-amber-400 text-[#0B1510] shadow-sm"
                  : "bg-[#163826] text-stone-300 hover:text-white"
              }`}
            >
              <span>Pending Review</span>
              {pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterTab === "all"
                  ? "bg-[#D4AF37] text-[#0B1510] shadow-sm"
                  : "bg-[#163826] text-stone-300 hover:text-white"
              }`}
            >
              All Advocates ({totalChambers})
            </button>

            <button
              onClick={() => setFilterTab("verified")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterTab === "verified"
                  ? "bg-emerald-500 text-[#0B1510] shadow-sm"
                  : "bg-[#163826] text-stone-300 hover:text-white"
              }`}
            >
              Verified ({verifiedCount})
            </button>

            <button
              onClick={() => setFilterTab("unverified")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterTab === "unverified"
                  ? "bg-stone-200 text-[#0B1510] shadow-sm"
                  : "bg-[#163826] text-stone-300 hover:text-white"
              }`}
            >
              Unverified
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, slug, enrollment no..."
              className="w-full bg-[#0E1D14] border border-[#234D35] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] placeholder:text-[#526057]"
            />
          </div>
        </div>

        {/* Advocate Verification Table */}
        <div className="bg-[#122319] border border-[#234D35] rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-stone-400 space-y-2">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[#D4AF37]" />
              <p className="text-xs">Loading advocate records from Supabase...</p>
            </div>
          ) : filteredAdvocates.length === 0 ? (
            <div className="p-12 text-center text-stone-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
              <p className="text-sm font-semibold text-[#FAF7F2]">
                {filterTab === "pending"
                  ? "All caught up! No pending verifications."
                  : "No advocates match the current filter."}
              </p>
              <p className="text-xs text-[#8C9890]">
                {filterTab === "pending"
                  ? "When an advocate uploads their Bar Council ID card, it will appear here for review."
                  : "Try clearing your search query or switching tabs."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0E1D14] border-b border-[#234D35] text-[#8C9890] uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 font-semibold">Advocate</th>
                    <th className="py-3 px-4 font-semibold">Bar Council Enrollment</th>
                    <th className="py-3 px-4 font-semibold">Courts & City</th>
                    <th className="py-3 px-4 font-semibold">ID Proof Document</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D3B2A]">
                  {filteredAdvocates.map((adv) => {
                    const hasIdProof = Boolean(adv.barIdCardUrl);
                    const isActing = actionLoading === adv.id;

                    return (
                      <tr
                        key={adv.id}
                        className="hover:bg-[#162D20]/60 transition-colors"
                      >
                        {/* Advocate Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#163826] border border-[#D4AF37]/30 flex items-center justify-center font-bold font-serif text-[#D4AF37] shrink-0 overflow-hidden">
                              {adv.photoUrl ? (
                                <img
                                  src={adv.photoUrl}
                                  alt={adv.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                adv.fullName.charAt(0)
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#FAF7F2] truncate flex items-center gap-1.5">
                                <span>{adv.fullName || "Unnamed Advocate"}</span>
                                {adv.isVerified && (
                                  <span title="Verified">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  </span>
                                )}
                              </p>
                              <Link
                                href={`/${adv.slug}`}
                                target="_blank"
                                className="text-[11px] text-[#D4AF37] hover:underline font-mono inline-flex items-center gap-1 truncate"
                              >
                                mychamber.me/{adv.slug}
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                            </div>
                          </div>
                        </td>

                        {/* Bar Enrollment Number */}
                        <td className="py-3.5 px-4 font-mono">
                          {adv.enrollmentNo ? (
                            <div className="space-y-1">
                              <span className="font-semibold text-white bg-[#0E1D14] px-2 py-1 rounded border border-[#234D35] inline-block">
                                {adv.enrollmentNo}
                              </span>
                              {adv.hideEnrollmentNo ? (
                                <span className="block text-[10px] text-amber-400 font-sans font-medium">
                                  🔒 Hidden on profile
                                </span>
                              ) : (
                                <span className="block text-[10px] text-emerald-400/80 font-sans font-medium">
                                  🌐 Visible on profile
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[#526057] italic">Not Provided</span>
                          )}
                        </td>

                        {/* Courts & Location */}
                        <td className="py-3.5 px-4 text-stone-300">
                          <p className="truncate max-w-[200px]">
                            {adv.courts && adv.courts.length > 0
                              ? adv.courts.slice(0, 2).join(", ")
                              : "No courts listed"}
                          </p>
                          <p className="text-[11px] text-[#8C9890] truncate max-w-[200px]">
                            {adv.officeAddress || adv.email || "—"}
                          </p>
                        </td>

                        {/* ID Proof Document */}
                        <td className="py-3.5 px-4">
                          {hasIdProof ? (
                            <button
                              type="button"
                              onClick={() => {
                                setInspectAdvocate(adv);
                                setInspectZoom(1);
                              }}
                              className="group flex items-center gap-2 p-1.5 rounded-xl bg-[#0E1D14] hover:bg-[#163826] border border-[#D4AF37]/40 transition text-left"
                            >
                              <img
                                src={adv.barIdCardUrl}
                                alt="ID Thumbnail"
                                className="w-10 h-8 object-cover rounded-lg border border-white/10 shrink-0"
                              />
                              <div className="min-w-0 pr-1">
                                <span className="block text-[11px] font-bold text-[#D4AF37] group-hover:underline">
                                  Inspect ID
                                </span>
                                <span className="block text-[10px] text-stone-400">
                                  Click to zoom
                                </span>
                              </div>
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#526057] italic">
                              No document uploaded
                            </span>
                          )}
                        </td>

                        {/* Verification Status */}
                        <td className="py-3.5 px-4">
                          {adv.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </span>
                          ) : hasIdProof ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 border border-amber-500/40 text-amber-300">
                              <Clock className="w-3 h-3" />
                              Pending Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-900 border border-white/10 text-stone-400">
                              Unverified
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!adv.isVerified ? (
                              <button
                                type="button"
                                disabled={isActing}
                                onClick={() => handleVerificationToggle(adv, true)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow flex items-center gap-1 disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isActing}
                                onClick={() => handleVerificationToggle(adv, false)}
                                className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-semibold text-[11px] transition flex items-center gap-1 disabled:opacity-50"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>Revoke</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ── High-Resolution Document Inspection Modal ───────────────────────── */}
      {inspectAdvocate && inspectAdvocate.barIdCardUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setInspectAdvocate(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] bg-[#122319] border border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#0E1D14] border-b border-[#234D35] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#163826] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#FAF7F2]">
                    Verify Bar Council Document
                  </h3>
                  <p className="text-xs text-[#8C9890]">
                    Advocate: <span className="text-white font-semibold">{inspectAdvocate.fullName}</span> • Slug: <span className="text-[#D4AF37]">/{inspectAdvocate.slug}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectZoom((z) => (z >= 2 ? 1 : z + 0.5))}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#163826] border border-white/10 text-stone-300 hover:text-white"
                >
                  Zoom ({inspectZoom}x)
                </button>
                <a
                  href={resolvedInspectUrl || inspectAdvocate.barIdCardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#163826] border border-white/10 text-stone-300 hover:text-white flex items-center gap-1"
                >
                  Open Full File <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => setInspectAdvocate(null)}
                  className="p-1 text-stone-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Document View + Comparison Column */}
            <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-y-auto">
              {/* Document Image Zoom Viewport (2 cols) */}
              <div className="md:col-span-2 p-4 bg-black/60 flex items-center justify-center overflow-auto min-h-[360px] max-h-[500px]">
                <img
                  src={resolvedInspectUrl || inspectAdvocate.barIdCardUrl}
                  alt="Bar Council ID Proof"
                  style={{ transform: `scale(${inspectZoom})`, transformOrigin: "center" }}
                  className="max-w-full max-h-[460px] object-contain rounded-lg border border-white/20 shadow-2xl transition-transform duration-200"
                />
              </div>

              {/* Advocate Claimed Details & Action Column (1 col) */}
              <div className="p-5 bg-[#0E1D14] border-t md:border-t-0 md:border-l border-[#234D35] flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-[#8C9890] uppercase tracking-wider">
                    Profile Data to Cross-Check
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div className="bg-[#122319] p-3 rounded-xl border border-[#234D35]">
                      <p className="text-[#8C9890] text-[11px]">Advocate Stated Name:</p>
                      <p className="font-bold text-white text-sm mt-0.5">
                        {inspectAdvocate.fullName}
                      </p>
                    </div>

                    <div className="bg-[#122319] p-3 rounded-xl border border-[#234D35]">
                      <p className="text-[#8C9890] text-[11px]">Stated Bar Enrollment No:</p>
                      <p className="font-mono font-bold text-[#D4AF37] text-sm mt-0.5">
                        {inspectAdvocate.enrollmentNo || "Not specified"}
                      </p>
                    </div>

                    <div className="bg-[#122319] p-3 rounded-xl border border-[#234D35]">
                      <p className="text-[#8C9890] text-[11px]">Mobile / WhatsApp:</p>
                      <p className="font-mono text-stone-200 mt-0.5">
                        {inspectAdvocate.mobile || "—"}
                      </p>
                    </div>

                    <div className="bg-[#122319] p-3 rounded-xl border border-[#234D35]">
                      <p className="text-[#8C9890] text-[11px]">Bar Associations:</p>
                      <p className="text-stone-200 mt-0.5">
                        {inspectAdvocate.barAssociations?.join(", ") || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verification Decision Buttons */}
                <div className="space-y-2 pt-4 border-t border-[#234D35]">
                  <button
                    type="button"
                    onClick={() => handleVerificationToggle(inspectAdvocate, true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Grant Verified Shield</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerificationToggle(inspectAdvocate, false)}
                    className="w-full bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-semibold py-2 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject / Revoke Badge</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
