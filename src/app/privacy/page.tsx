import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Scale,
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  Mail,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy (DPDP Act, 2023 Compliant) | My Chamber",
  description:
    "Privacy Policy of My Chamber formulated in strict compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and Bar Council of India standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#14231C] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-28 pb-20 space-y-10">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#526057] hover:text-[#14231C] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E0D5] shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF3ED] text-[#163826] text-xs font-bold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4 text-[#163826]" />
            <span>DPDP Act, 2023 Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#14231C] tracking-tight">
            Privacy Policy & Data Protection Charter
          </h1>

          <p className="text-sm sm:text-base text-[#526057] leading-relaxed">
            Formulated in strict accordance with the{" "}
            <strong className="text-[#14231C]">
              Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)
            </strong>{" "}
            and the{" "}
            <strong className="text-[#14231C]">
              Bar Council of India Rules (Rule 36, Chapter II, Part VI)
            </strong>
            .
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#6B7870] border-t border-[#F0ECE4]">
            <span>
              <strong>Effective Date:</strong> October 2026
            </span>
            <span>•</span>
            <span>
              <strong>Entity:</strong> My Chamber Digital Infrastructure
            </span>
            <span>•</span>
            <span>
              <strong>Jurisdiction:</strong> Republic of India
            </span>
          </div>
        </div>

        {/* Legal Sections */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E0D5] shadow-sm space-y-8 text-sm sm:text-base text-[#3F4D45] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#14231C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#163826] text-[#FAF7F2] text-xs font-extrabold flex items-center justify-center">
                1
              </span>
              <span>Overview & Fiduciary Status</span>
            </h2>
            <p>
              This Privacy Policy governs the processing of digital personal data by{" "}
              <strong className="text-[#14231C]">My Chamber</strong> (“Platform”, “we”, “us”, or
              “our”), operating as a <strong className="text-[#14231C]">Data Fiduciary</strong> under
              Section 2(i) of the Digital Personal Data Protection Act, 2023 (DPDP Act).
            </p>
            <p>
              The Platform provides digital profile and chamber infrastructure strictly for licensed
              advocates enrolled with respective State Bar Councils across India (“Data Principals”).
              The Platform does not act as a legal referral service, legal bidding broker, or
              commercial advertisement agency.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6 border-t border-[#F0ECE4]">
            <h2 className="text-lg sm:text-xl font-bold text-[#14231C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#163826] text-[#FAF7F2] text-xs font-extrabold flex items-center justify-center">
                2
              </span>
              <span>Personal Data Collected (Data Principals)</span>
            </h2>
            <p>
              In accordance with the principle of data minimization (Section 6 of DPDP Act), we
              collect only such personal data that is essential for setting up and verifying an
              advocate’s digital chamber:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li>
                <strong className="text-[#14231C]">Professional Identity:</strong> Full Name,
                mandatory State Bar Council Enrollment Number (e.g. PH/7797/2025), enrolled Bar
                Associations, and educational law degrees / alma mater.
              </li>
              <li>
                <strong className="text-[#14231C]">Chamber Orientation Details:</strong> Chamber
                office address, courts of practice, consultation hours, official contact numbers
                (Mobile/Office), and WhatsApp link.
              </li>
              <li>
                <strong className="text-[#14231C]">Verification Documents (Optional):</strong> Photo
                of State Bar Council ID Card or Enrollment Certificate, submitted voluntarily by the
                advocate for anti-impersonation badge verification.
              </li>
              <li>
                <strong className="text-[#14231C]">Authentication Credentials:</strong> Email
                address and secure hashed passwords or Google OAuth identifiers used to authenticate
                the advocate’s session.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-6 border-t border-[#F0ECE4]">
            <h2 className="text-lg sm:text-xl font-bold text-[#14231C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#163826] text-[#FAF7F2] text-xs font-extrabold flex items-center justify-center">
                3
              </span>
              <span>Specified Purpose of Processing (Sections 4 & 5)</span>
            </h2>
            <p>Your personal data is processed solely for the following specified lawful purposes:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D5] text-xs space-y-1.5">
                <p className="font-bold text-[#14231C]">Chamber Hosting & QR Visiting Card</p>
                <p className="text-[#526057]">
                  Publishing your permanent custom chamber link and generating print-ready desk QR
                  codes.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D5] text-xs space-y-1.5">
                <p className="font-bold text-[#14231C]">Anti-Impersonation Protection</p>
                <p className="text-[#526057]">
                  Enforcing the strict 1-chamber-per-Bar-Council-number rule to prevent fraudulent
                  identity spoofing.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D5] text-xs space-y-1.5">
                <p className="font-bold text-[#14231C]">BCI Rule 36 Harmonization</p>
                <p className="text-[#526057]">
                  Facilitating factual client orientation regarding your chamber location, contact
                  channels, and courts of practice.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D5] text-xs space-y-1.5">
                <p className="font-bold text-[#14231C]">Ownership Dispute Resolution</p>
                <p className="text-[#526057]">
                  Evaluating Bar certificate submissions in the event of an enrollment number claim
                  contest.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-6 border-t border-[#F0ECE4]">
            <h2 className="text-lg sm:text-xl font-bold text-[#14231C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#163826] text-[#FAF7F2] text-xs font-extrabold flex items-center justify-center">
                4
              </span>
              <span>Rights of the Data Principal (Advocate)</span>
            </h2>
            <p>
              Under Chapter III (Sections 11–14) of the DPDP Act, 2023, every advocate registered on
              My Chamber possesses the following statutory rights:
            </p>
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#163826] shrink-0 mt-1" />
                <p className="text-xs sm:text-sm">
                  <strong className="text-[#14231C]">Right to Access Information (Section 11):</strong>{" "}
                  You have the right to view a complete summary of your personal data processed by
                  the Platform via your Studio Dashboard.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#163826] shrink-0 mt-1" />
                <p className="text-xs sm:text-sm">
                  <strong className="text-[#14231C]">
                    Right to Correction and Erasure (Section 12):
                  </strong>{" "}
                  You have the right to edit, update, or permanently delete your chamber profile and
                  associated data at any time.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#163826] shrink-0 mt-1" />
                <p className="text-xs sm:text-sm">
                  <strong className="text-[#14231C]">
                    Right of Grievance Redressal (Section 13):
                  </strong>{" "}
                  You have the right to address any data protection grievances to our designated
                  Grievance Officer before escalating to the Data Protection Board of India.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#163826] shrink-0 mt-1" />
                <p className="text-xs sm:text-sm">
                  <strong className="text-[#14231C]">Right to Nominate (Section 14):</strong> You
                  have the right to nominate an individual who, in the event of death or incapacity,
                  shall exercise your rights under the Act.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-6 border-t border-[#F0ECE4]">
            <h2 className="text-lg sm:text-xl font-bold text-[#14231C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#163826] text-[#FAF7F2] text-xs font-extrabold flex items-center justify-center">
                5
              </span>
              <span>Reasonable Security Safeguards (Section 8(5))</span>
            </h2>
            <p>
              To prevent any unauthorized access, alteration, or disclosure of advocate data, My
              Chamber implements enterprise-grade technical safeguards:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>256-Bit SSL/TLS 1.3 Encryption:</strong> All data transmitted between your
                device and our servers is strictly encrypted in transit.
              </li>
              <li>
                <strong>Encrypted Database Storage:</strong> Hosted on PostgreSQL infrastructure
                with automated backups and row-level access control.
              </li>
              <li>
                <strong>Zero Commercial Sale:</strong> We never sell, lease, or monetize advocate
                contact data or client inquiries to third-party advertisers or insurance brokers.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-6 border-t border-[#F0ECE4]">
            <h2 className="text-lg sm:text-xl font-bold text-[#14231C] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#163826] text-[#FAF7F2] text-xs font-extrabold flex items-center justify-center">
                6
              </span>
              <span>Grievance Redressal Mechanism & Officer</span>
            </h2>
            <p>
              In compliance with Section 8(9) and Section 13 of the DPDP Act, 2023, you may contact
              our designated Grievance Officer regarding any data inquiry, correction request, or
              erasure notice:
            </p>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D5] space-y-2 text-xs sm:text-sm">
              <p>
                <strong className="text-[#14231C]">Designation:</strong> Data Protection &
                Grievance Officer
              </p>
              <p>
                <strong className="text-[#14231C]">Platform:</strong> My Chamber (Digital Chamber
                Infrastructure)
              </p>
              <p>
                <strong className="text-[#14231C]">Grievance Email:</strong>{" "}
                <a
                  href="mailto:mychamber.official@gmail.com"
                  className="text-[#163826] underline font-bold"
                >
                  mychamber.official@gmail.com
                </a>
              </p>
              <p className="text-[#6B7870] text-xs pt-1">
                Resolution Timeline: All bona fide requests and complaints are resolved within a
                maximum of 30 days.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAE3D6] py-8 px-4 sm:px-6 bg-[#F4EFEA] text-center space-y-2 text-xs text-[#6B7870]">
        <p>© {new Date().getFullYear()} My Chamber • न्याय सबके लिए</p>
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-[#163826]">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy (DPDP Act)
          </Link>
          <span>•</span>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>•</span>
          <Link href="/login" className="hover:underline">
            Advocate Portal
          </Link>
        </div>
      </footer>
    </div>
  );
}
