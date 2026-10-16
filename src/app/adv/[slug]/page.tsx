import { Suspense } from "react";
import type { Metadata } from "next";
import AdvocateClientView from "./AdvocateClientView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Format clean name from slug (e.g. adv-rv -> Adv. RV, adv-raj-vikrant -> Adv. Raj Vikrant)
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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center text-sm text-[#8ab4f8]">
          Opening Virtual Chamber...
        </div>
      }
    >
      <AdvocateClientView slug={slug} />
    </Suspense>
  );
}
