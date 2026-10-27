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
      barAssociations: [
        "Panchkula Bar Association",
        "Punjab and Haryana High Court Bar Association",
      ],
      qualifications: ["B.A. LL.B. (Hons.)"],
      almaMater: "Department of Laws, Panjab University, Chandigarh",
      chamberHours: "Mon – Sat: 10:00 AM – 7:30 PM (Consultations by Prior Appointment)",
      bio: "Advocate with 1+ years of experience practicing at the Punjab and Haryana High Court. I have handled over 2 Constitutional cases, 5 Consumer Cases and have a strong track record in Cyber, Civil and Consumer disputes. My mission is to ensure every client receives fair representation and justice, regardless of their background.",
      mobile: "",
      officePhone: "",
      email: "",
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
      newsMedia: [
        {
          id: "tribune-swiggy",
          title: "Swiggy told to pay Rs 2,000 over short delivery of oranges to Panchkula resident",
          publication: "The Tribune",
          url: "https://www.tribuneindia.com/news/chandigarh/swiggy-told-to-pay-rs-2000-over-short-delivery-of-oranges-to-panchkula-resident/",
          imageUrl: "https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTU0MTJjMDUwLWJlZDItMTFmMC1iMDY0LWVkNWUyYTYzNDljNy5qcGc=",
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
      enable3d: false,
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
    enable3d: false,
    isVerified: true,
  };
}

interface AdvocateClientViewProps {
  slug: string;
  initialAdvocate?: Advocate | null;
}

export default function AdvocateClientView({ slug, initialAdvocate }: AdvocateClientViewProps) {
  const [advocate, setAdvocate] = useState<Advocate>(() =>
    initialAdvocate || createDefaultProfileFromSlug(slug)
  );

  useEffect(() => {
    // If we already have server-rendered data for this advocate, avoid duplicate network roundtrips
    if (initialAdvocate && (initialAdvocate.slug === slug || initialAdvocate.id === slug)) {
      setAdvocate(initialAdvocate);
      return;
    }

    try {
      // 1. Check local storage for instant zero-latency load if local editing
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Advocate;
        if (parsed.slug === slug || !parsed.slug) {
          setAdvocate({ ...parsed, slug });
        }
      }

      // 2. Fetch live data from Supabase cloud database if not pre-rendered
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
  }, [slug, initialAdvocate]);

  return <ProfileCard advocate={advocate} />;
}
