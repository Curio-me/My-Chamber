"use client";

import { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { Advocate } from "@/lib/types";

const STORAGE_KEY = "virtual_chamber_advocate_profile";

function createDefaultProfileFromSlug(slug: string): Advocate {
  if (slug.toLowerCase() === "rajavikrant" || slug.toLowerCase() === "adv-rv") {
    return {
      id: "rajavikrant",
      slug: "rajavikrant",
      fullName: "Adv. RajaVikrant Sharma",
      enrollmentNo: "PH//7797//2025",
      bio: "Advocate with 1+ years of experience practicing at the Punjab and Haryana High Court. I have handled over 2 Constitutional cases, 5 Consumer Cases and have a strong track record in Cyber, Civil and Consumer disputes. My mission is to ensure every client receives fair representation and justice, regardless of their background.",
      mobile: "",
      officePhone: "",
      email: "",
      officeAddress: "Advocate Chamber, Punjab and Haryana High Court Complex, Chandigarh",
      mapUrl: "",
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
      newsMedia: [
        {
          id: "tribune-swiggy",
          title: "Swiggy told to pay Rs 2,000 over short delivery of oranges to Panchkula resident",
          publication: "The Tribune",
          url: "https://www.tribuneindia.com/news/chandigarh/swiggy-told-to-pay-rs-2000-over-short-delivery-of-oranges-to-panchkula-resident/",
          imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
          date: "Consumer Order",
        },
        {
          id: "high-court-ruling",
          title: "Advocate RajaVikrant Sharma secures relief in Constitutional writ petition at High Court",
          publication: "Law & Bench",
          url: "https://www.tribuneindia.com/news/chandigarh/swiggy-told-to-pay-rs-2000-over-short-delivery-of-oranges-to-panchkula-resident/",
          imageUrl: "https://images.unsplash.com/photo-1453733197781-791723bb7e77?auto=format&fit=crop&w=800&q=80",
          date: "PHHC Ruling",
        },
        {
          id: "consumer-case-update",
          title: "District Commission holds e-commerce aggregator liable for deficiency in consumer services",
          publication: "The Tribune",
          url: "https://www.tribuneindia.com/news/chandigarh/swiggy-told-to-pay-rs-2000-over-short-delivery-of-oranges-to-panchkula-resident/",
          imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80",
          date: "Judicial Note",
        },
      ],
      themePreference: "dark",
      enable3d: true,
      isVerified: true,
    };
  }

  const clean = slug.replace(/^adv-?/i, "");
  const formattedName = clean
    ? clean
        .split("-")
        .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
        .join(" ")
    : "Advocate";

  return {
    id: slug,
    slug,
    fullName: `Adv. ${formattedName}`,
    enrollmentNo: "Bar Council of India",
    bio: `Advocate practicing across legal domains. Dedicated to client representation, court proceedings, and legal advisory.`,
    mobile: "",
    officePhone: "",
    email: "",
    officeAddress: "Advocate Chamber, Court Complex",
    mapUrl: "",
    yearsExp: 5,
    courts: ["High Court", "District & Sessions Court"],
    specializations: ["Constitutional Law", "Civil Law", "Criminal Law"],
    languages: ["English", "Hindi"],
    themePreference: "dark",
    enable3d: true,
    isVerified: true,
  };
}

export default function AdvocateClientView({ slug }: { slug: string }) {
  const [advocate, setAdvocate] = useState<Advocate>(() =>
    createDefaultProfileFromSlug(slug)
  );

  useEffect(() => {
    try {
      // 1. Check local storage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Advocate;
        if (parsed.slug === slug || !parsed.slug) {
          setAdvocate({ ...parsed, slug });
          return;
        }
      }

      // 2. Fetch from cloud API if available
      fetch(`/api/profile?slug=${encodeURIComponent(slug)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.fullName) {
            setAdvocate(data);
          }
        })
        .catch(() => {
          // ignore network error
        });
    } catch {
      // fallback to generated profile
    }
  }, [slug]);

  return <ProfileCard advocate={advocate} />;
}
