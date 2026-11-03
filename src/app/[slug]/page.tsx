import { Suspense, cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdvocateClientView from "./AdvocateClientView";
import UnclaimedChamberView from "@/components/UnclaimedChamberView";
import { fetchAdvocateBySlug, fetchAllAdvocateSlugs } from "@/lib/supabase";
import LegalSchema from "@/components/LegalSchema";

// Pre-render static HTML at build time for existing advocates for instant <50ms CDN loads
export const dynamicParams = true;
// Keep cached on Vercel Edge CDN for 1 hour (revalidated on-demand when edited)
export const revalidate = 3600;

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

    // Normalize spaced names like 'RajaVikrant' -> 'Raja Vikrant'
    const normalizedName = advocate.fullName.replace(/([a-z])([A-Z])/g, "$1 $2");
    const plainName = normalizedName.replace(/^Adv\.\s*/i, "").trim();

    // Target the highest-volume search queries: "Advocate [Name]", "[Name]"
    const title = `Advocate ${plainName} — ${courtName}`;
    const desc = advocate.bio
      ? `${plainName} is an advocate practicing at ${courtName}. Bar Council No: ${advocate.enrollmentNo || "Registered Advocate"}. ${advocate.bio.slice(0, 140)}`
      : `Official digital chamber of Advocate ${plainName}, practicing at ${courtName}. Bar Council Registration: ${
          advocate.enrollmentNo || "Registered Advocate"
        }. Contact details, chamber address & desk QR.`;

    return {
      title,
      description: desc,
      keywords: [
        plainName,
        `Advocate ${plainName}`,
        `Adv. ${plainName}`,
        `${plainName} advocate`,
        `${plainName} lawyer`,
        advocate.fullName,
        courtName,
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
        title: `Advocate ${plainName} — ${courtName} | My Chamber`,
        description: desc,
        url: canonicalUrl,
        type: "profile",
        siteName: "My Chamber",
        images: advocate.photoUrl && advocate.photoUrl.startsWith("http")
          ? [{ url: advocate.photoUrl, width: 800, height: 800, alt: `Advocate ${plainName}` }]
          : [{ url: "https://mychamber.me/icon.svg", width: 512, height: 512, alt: "My Chamber" }],
      },
      twitter: {
        card: "summary_large_image",
        title: `Advocate ${plainName} — ${courtName} | My Chamber`,
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

  // Slug does not exist in the database: mark as available to claim
  return {
    title: `mychamber.me/${slug} is Available | Claim Your Digital Chamber`,
    description: `The official digital chamber address mychamber.me/${slug} has not been registered yet. Claim this permanent address on My Chamber today.`,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `mychamber.me/${slug} is Available to Claim | My Chamber`,
      description: `The official digital chamber address mychamber.me/${slug} has not been registered yet. Claim this permanent address on My Chamber today.`,
      url: canonicalUrl,
      type: "website",
      siteName: "My Chamber",
      images: [{ url: "https://mychamber.me/icon.svg", width: 512, height: 512, alt: "My Chamber" }],
    },
    twitter: {
      card: "summary",
      title: `mychamber.me/${slug} is Available to Claim | My Chamber`,
      description: `The official digital chamber address mychamber.me/${slug} has not been registered yet. Claim this permanent address on My Chamber today.`,
      images: ["https://mychamber.me/icon.svg"],
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

  // Sanitize public payload: never bundle sensitive admin verification ID scans into public HTML
  const publicAdvocateData = advocateData
    ? (() => {
        const { barIdCardUrl, ...rest } = advocateData;
        return rest as typeof advocateData;
      })()
    : null;

  // If no published profile exists in the database, render the Available Handle reservation view
  if (!publicAdvocateData) {
    return <UnclaimedChamberView slug={slug} />;
  }

  return (
    <>
      <LegalSchema advocate={publicAdvocateData} />
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center text-sm text-[#8ab4f8]">
            Opening Digital Chamber...
          </div>
        }
      >
        <AdvocateClientView slug={slug} initialAdvocate={publicAdvocateData} />
      </Suspense>
    </>
  );
}
