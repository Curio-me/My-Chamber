import { Suspense, cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdvocateClientView from "./AdvocateClientView";
import { fetchAdvocateBySlug, fetchAllAdvocateSlugs } from "@/lib/supabase";
import LegalSchema from "@/components/LegalSchema";

// Pre-render static HTML at build time for existing advocates for instant <50ms CDN loads
export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const list = await fetchAllAdvocateSlugs();
    const slugs = list.map((item) => ({ slug: item.slug }));
    if (!slugs.some((s) => s.slug === "rajavikrant")) {
      slugs.push({ slug: "rajavikrant" });
    }
    return slugs;
  } catch {
    return [{ slug: "rajavikrant" }];
  }
}

// Deduplicate database queries across generateMetadata and Page execution
const getCachedAdvocate = cache(async (slug: string) => {
  return await fetchAdvocateBySlug(slug);
});

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
  const canonicalUrl = `https://mychamber.me/${encodeURIComponent(slug)}`;

  if (RESERVED_SLUGS.has(slug.toLowerCase())) {
    return { title: "My Chamber" };
  }

  // Fetch actual data or fallback (deduplicated across metadata & page render)
  const advocate = await getCachedAdvocate(slug);

  if (advocate) {
    const courtName = advocate.courts?.[0] || "High Court";
    const title = `${advocate.fullName} — ${courtName}`;
    const desc = advocate.bio
      ? advocate.bio.slice(0, 155)
      : `Official digital chamber of ${advocate.fullName}, practicing at ${courtName}. Bar Council Registration: ${
          advocate.enrollmentNo || "Registered Advocate"
        }. Contact details, chamber address & desk QR.`;
    return {
      title,
      description: desc,
      keywords: [
        advocate.fullName,
        ...(advocate.specializations || []),
        ...(advocate.courts || []),
        ...(advocate.barAssociations || []),
        "Advocate",
        "My Chamber",
        "Legal Counsel",
        "High Court",
        "Supreme Court",
      ],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${advocate.fullName} — ${courtName} | My Chamber`,
        description: desc,
        url: canonicalUrl,
        type: "profile",
        siteName: "My Chamber",
        images: advocate.photoUrl && advocate.photoUrl.startsWith("http")
          ? [{ url: advocate.photoUrl, width: 800, height: 800, alt: advocate.fullName }]
          : [{ url: "https://mychamber.me/icon.svg", width: 512, height: 512, alt: "My Chamber" }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${advocate.fullName} — ${courtName} | My Chamber`,
        description: desc,
        images: advocate.photoUrl && advocate.photoUrl.startsWith("http")
          ? [advocate.photoUrl]
          : ["https://mychamber.me/icon.svg"],
      },
    };
  }

  if (slug.toLowerCase() === "rajavikrant" || slug.toLowerCase() === "adv-rv") {
    const title = "Adv. RajaVikrant Sharma — Punjab & Haryana High Court";
    const description = "Official digital chamber of Adv. RajaVikrant Sharma, Advocate practicing at the Punjab and Haryana High Court. Bar Council No: PH/7797/2025. Contact, directions & desk QR.";
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
        "My Chamber",
      ],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${title} | My Chamber`,
        description,
        url: canonicalUrl,
        type: "profile",
        siteName: "My Chamber",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | My Chamber`,
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

  const title = `Adv. ${formattedName} | My Chamber`;
  const description = `Official digital chamber of Adv. ${formattedName}. Specializations, Bar Council credentials, chamber location, and direct contact.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "profile",
      siteName: "My Chamber",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug.toLowerCase())) {
    notFound();
  }

  // Attempt SSR fetch (cached and shared with metadata)
  let advocateData = await getCachedAdvocate(slug);

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
            Opening Digital Chamber...
          </div>
        }
      >
        <AdvocateClientView slug={slug} initialAdvocate={advocateData} />
      </Suspense>
    </>
  );
}
