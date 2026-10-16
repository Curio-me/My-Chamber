import Link from "next/link";
import {
  Scale,
  MapPin,
  Phone,
  BadgeCheck,
  ArrowRight,
  Globe,
  Users,
  Star,
  Gavel,
} from "lucide-react";
import Navbar from "@/components/Navbar";

// Brand icons (removed from newer lucide-react)
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-[#162348]/60 border border-[#c9a84c]/15 rounded-2xl p-6 hover:border-[#c9a84c]/40 transition-all hover:-translate-y-1 group">
      <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c9a84c]/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-[#c9a84c] mb-1">
        {number}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#080f1e] to-[#0f1d3c]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#c9a84c]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <Scale className="w-3.5 h-3.5" />
            Free for all Indian Advocates
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Every Advocate Deserves
            <br />
            <span className="gold-shimmer">A Virtual Chamber</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            In India, not every lawyer has a physical chamber. We give every
            advocate a{" "}
            <span className="text-[#c9a84c] font-semibold">
              free digital profile
            </span>{" "}
            — shareable, beautiful, and professional.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#e2c26e] text-[#0f1d3c] font-bold text-base px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#c9a84c]/20 hover:-translate-y-0.5"
            >
              Create Your Chamber — Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 bg-[#162348] hover:bg-[#1e2f5e] text-white font-bold text-base px-8 py-4 rounded-xl border border-[#c9a84c]/30 transition-all hover:-translate-y-0.5"
            >
              See Demo Profile
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto border border-[#c9a84c]/20 rounded-2xl bg-[#162348]/40 p-6">
            <StatCard number="100%" label="Free to use" />
            <StatCard number="2 min" label="Setup time" />
            <StatCard number="∞" label="Profiles" />
          </div>
        </div>
      </section>

      {/* Sample Profile Preview */}
      <section className="py-16 px-4 bg-[#080f1e]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              What Your Chamber Looks Like
            </h2>
            <p className="text-gray-400">
              A professional profile with everything clients need
            </p>
          </div>

          {/* Mock Profile Card */}
          <div className="max-w-sm mx-auto bg-gradient-to-br from-[#162348] to-[#0f1d3c] border border-[#c9a84c]/20 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Profile Header */}
            <div className="p-6 text-center border-b border-[#c9a84c]/10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8ab4f8] to-[#1a73e8] flex items-center justify-center text-2xl font-bold text-[#0e0e10] mx-auto mb-3 ring-4 ring-[#8ab4f8]/30">
                LC
              </div>
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <h3 className="text-white font-bold text-lg">Adv. Legal Counsel</h3>
                <BadgeCheck className="w-4 h-4 text-[#8ab4f8]" />
              </div>
              <p className="text-gray-400 text-xs mb-3">Enrollment: Bar Council Verified · 10+ yrs exp.</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {["Criminal", "Family", "Property"].map((s) => (
                  <span key={s} className="text-[10px] font-semibold text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/30 px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="p-4 space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center justify-center gap-1.5 bg-[#c9a84c] text-[#0f1d3c] font-bold text-xs py-2.5 rounded-xl">
                  <Phone className="w-3 h-3" /> Call Now
                </div>
                <div className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white font-bold text-xs py-2.5 rounded-xl">
                  WhatsApp
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#0f1d3c] rounded-xl px-3 py-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                <p className="text-gray-400 text-xs truncate">Saket District Court, New Delhi</p>
              </div>
              <div className="flex gap-2 pt-1">
                {[InstagramIcon, TwitterIcon, Globe].map((Icon, i) => (
                  <div key={i} className="flex-1 flex items-center justify-center bg-[#162348] border border-[#c9a84c]/20 py-2 rounded-lg">
                    <Icon className="w-3.5 h-3.5 text-[#c9a84c]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 text-[#c9a84c] hover:text-[#e2c26e] font-semibold text-sm transition-colors"
            >
              View Full Demo Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything in One Link
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Share your Virtual Chamber URL on WhatsApp, visiting cards, or
              court notices — clients get everything they need instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<BadgeCheck className="w-6 h-6 text-[#c9a84c]" />}
              title="Professional Profile"
              desc="Name, photo, enrollment number, specializations, experience — all in one beautiful card."
            />
            <FeatureCard
              icon={<Phone className="w-6 h-6 text-[#c9a84c]" />}
              title="Instant Contact"
              desc="Clients can call, WhatsApp, or email you directly with one tap. No typing numbers."
            />
            <FeatureCard
              icon={<MapPin className="w-6 h-6 text-[#c9a84c]" />}
              title="Google Maps Location"
              desc="Show your office on an embedded map. Clients can navigate directly to your chamber."
            />
            <FeatureCard
              icon={<Scale className="w-6 h-6 text-[#c9a84c]" />}
              title="Courts & Specializations"
              desc="Display which courts you practice in and your areas of expertise clearly."
            />
            <FeatureCard
              icon={<InstagramIcon className="w-6 h-6 text-[#c9a84c]" />}
              title="Social Media Links"
              desc="Link Instagram, Twitter, LinkedIn — let clients follow your legal insights online."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-[#c9a84c]" />}
              title="Your Unique URL"
              desc="Get a shareable link like virtualchamber.in/adv-yourname. Put it everywhere."
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 bg-[#080f1e]/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Perfect For Every Advocate
          </h2>
          <p className="text-gray-400 mb-10">
            Whether you practice at the Supreme Court or a district court —
            Virtual Chamber works for you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Gavel className="w-5 h-5" />, label: "Junior Advocates", desc: "Build your presence from day one" },
              { icon: <Scale className="w-5 h-5" />, label: "Senior Advocates", desc: "Professional profile for referrals" },
              { icon: <Users className="w-5 h-5" />, label: "Law Firms", desc: "Showcase your team members" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#162348]/60 border border-[#c9a84c]/15 rounded-2xl p-5 text-left"
              >
                <div className="text-[#c9a84c] mb-3">{item.icon}</div>
                <h3 className="text-white font-bold mb-1">{item.label}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-[#162348] to-[#0f1d3c] border border-[#c9a84c]/30 rounded-3xl p-12">
          <Scale className="w-10 h-10 text-[#c9a84c] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Open Your Virtual Chamber?
          </h2>
          <p className="text-gray-400 mb-8">
            Free forever. No credit card. No tech skills needed. Setup in 2
            minutes.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#e2c26e] text-[#0f1d3c] font-bold text-lg px-10 py-4 rounded-xl transition-all shadow-lg shadow-[#c9a84c]/20 hover:-translate-y-0.5"
          >
            <Star className="w-5 h-5" />
            Get Your Free Profile
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#c9a84c]/10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Scale className="w-4 h-4 text-[#c9a84c]" />
          <span className="text-white font-semibold">Virtual Chamber</span>
        </div>
        <p className="text-gray-600 text-sm">
          Made with ❤️ for Indian Advocates · न्याय सबके लिए
        </p>
      </footer>
    </main>
  );
}
