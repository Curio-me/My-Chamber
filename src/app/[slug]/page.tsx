import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdvocateClientView from "./AdvocateClientView";

const RESERVED_SLUGS = new Set([
  "dashboard",
  "demo",
  "find",
  "login",
  "api",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "adv",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug.toLowerCase())) {
    return { title: "Virtual Chamber" };
  }

  // Fetch actual data or fallback
  const advocate = await fetchAdvocateBySlug(slug);

  if (advocate) {
    const title = `${advocate.fullName} | Virtual Chamber`;
    const desc = advocate.bio
      ? advocate.bio.slice(0, 160)
      : `Official Virtual Chamber profile of ${advocate.fullName}, practicing at ${
          advocate.courts?.[0] || "High Court"
        }. Bar Council: ${advocate.enrollmentNo || "Registered"}.`;
    return {
      title,
      description: desc,
      keywords: [
        advocate.fullName,
        ...(advocate.specializations || []),
        ...(advocate.courts || []),
        ...(advocate.barAssociations || []),
        "Advocate",
        "Virtual Chamber",
        "Legal Counsel",
        "High Court",
      ],
      openGraph: {
        title: `${advocate.fullName} | Virtual Chamber`,
        description: desc,
        type: "profile",
        siteName: "Virtual Chamber",
        images: advocate.photoUrl ? [{ url: advocate.photoUrl }] : undefined,
      },
      twitter: {
        card: "summary",
        title: `${advocate.fullName} | Virtual Chamber`,
        description: desc,
        images: advocate.photoUrl ? [advocate.photoUrl] : undefined,
      },
    };
  }

  if (slug.toLowerCase() === "rajavikrant" || slug.toLowerCase() === "adv-rv") {
    const title = "Adv. RajaVikrant Sharma | Virtual Chamber";
    const description = "Official Virtual Chamber profile of Adv. RajaVikrant Sharma, Advocate practicing at the Punjab and Haryana High Court. Bar Council No: PH//7797//2025.";
    return {
      title,
      description,
      keywords: [
        "Adv. RajaVikrant Sharma",
        "Punjab and Haryana High Court",
        "Panchkula Bar Association",
        "Constitutional Law",
        "Consumer Law",
        "Cyber Law",
        "Civil Law",
      ],
      openGraph: {
        title,
        description,
        type: "profile",
        siteName: "Virtual Chamber",
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  }

  // Format clean name from slug (e.g. rajavikrant -> Adv. Rajavikrant, adv-raj-vikrant -> Adv. Raj Vikrant)
  const clean = slug.replace(/^adv-?/i, "");
  const formattedName = clean
    ? clean
        .split("-")
        .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
        .join(" ")
    : "Advocate";

  const title = `Adv. ${formattedName}`;
  const description = `Official Virtual Chamber profile of Adv. ${formattedName}. Specializations, Bar Council details, chamber location, and direct contact.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Virtual Chamber`,
      description,
      type: "profile",
      siteName: "Virtual Chamber",
    },
    twitter: {
      card: "summary",
      title: `${title} | Virtual Chamber`,
      description,
    },
  };
}

import { fetchAdvocateBySlug } from "@/lib/supabase";
import LegalSchema, { generateLegalSchema } from "@/components/LegalSchema";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug.toLowerCase())) {
    notFound();
  }

  // Attempt SSR fetch for search engine crawlers
  let advocateData = await fetchAdvocateBySlug(slug);

  if (!advocateData && (slug.toLowerCase() === "rajavikrant" || slug.toLowerCase() === "adv-rv")) {
    advocateData = {
      id: "rajavikrant",
      slug: "rajavikrant",
      fullName: "Adv. RajaVikrant Sharma",
      enrollmentNo: "PH//7797//2025",
      barAssociations: [
        "Panchkula Bar Association",
        "Punjab and Haryana High Court Bar Association",
      ],
      qualifications: ["B.A. LL.B. (Hons.)"],
      almaMater: "Department of Laws, Panjab University, Chandigarh",
      chamberHours: "Mon – Sat: 10:00 AM – 7:30 PM (Consultations by Prior Appointment)",
      bio: "Advocate with 1+ years of experience practicing at the Punjab and Haryana High Court. Dedicated to accessible legal counsel, fair representation, and courtroom advocacy.",
      mobile: "+91-9876543210",
      officePhone: "",
      email: "advocate@virtualchamber.in",
      officeAddress: "Advocate Chamber, Punjab and Haryana High Court Complex, Chandigarh",
      mapUrl: "https://maps.google.com/?q=Punjab+and+Haryana+High+Court+Chandigarh",
      yearsExp: 1,
      courts: ["Punjab and Haryana High Court"],
      specializations: [
        "Civil Law",
        "Cheque Bounce (NI Act)",
        "Constitutional Law",
        "Consumer Law",
        "Cyber Law",
        "Criminal Law",
      ],
      languages: ["English", "Hindi", "Punjabi"],
      isVerified: true,
    };
  }

  return (
    <>
      {advocateData && <LegalSchema advocate={advocateData} />}
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center text-sm text-[#8ab4f8]">
            Opening Virtual Chamber...
          </div>
        }
      >
        <AdvocateClientView slug={slug} />
      </Suspense>
    </>
  );
}
