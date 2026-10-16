"use client";

import { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { Advocate } from "@/lib/types";

const STORAGE_KEY = "virtual_chamber_advocate_profile";

function createDefaultProfileFromSlug(slug: string): Advocate {
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
