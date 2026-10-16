"use client";

import { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { DEMO_ADVOCATE } from "@/lib/demoData";
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
    ...DEMO_ADVOCATE,
    id: slug,
    slug,
    fullName: `Adv. ${formattedName}`,
    bio: `Advocate practicing across Constitutional, Civil, and Criminal matters. Dedicated to accessible legal counsel, fair representation, and courtroom advocacy.`,
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
