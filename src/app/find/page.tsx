import Link from "next/link";
import { Search, MapPin, Scale, Construction } from "lucide-react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Find Advocates | Digital Chamber",
};

export default function FindPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-[#080f1e] to-[#0f1d3c] flex items-center justify-center px-4 pt-20">
        <div className="max-w-xl w-full text-center">
          <div className="bg-[#162348]/60 border border-[#c9a84c]/20 rounded-3xl p-12">
            <div className="w-16 h-16 bg-[#c9a84c]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Construction className="w-8 h-8 text-[#c9a84c]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Advocate Directory
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              The advocate search directory is coming soon in{" "}
              <span className="text-[#c9a84c] font-semibold">Phase 2</span>.
              You&apos;ll be able to search advocates by city, specialization,
              court, and language.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              {[
                { icon: <Search className="w-4 h-4" />, label: "Search by Specialization" },
                { icon: <MapPin className="w-4 h-4" />, label: "Search by City" },
                { icon: <Scale className="w-4 h-4" />, label: "Search by Court" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 bg-[#0f1d3c] border border-[#c9a84c]/10 text-gray-500 text-xs px-3 py-2 rounded-xl"
                >
                  <span className="text-[#c9a84c]/50">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#e2c26e] text-[#0f1d3c] font-bold text-sm px-6 py-3 rounded-xl transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
