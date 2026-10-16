"use client";

import { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { DEMO_ADVOCATE } from "@/lib/demoData";
import { Advocate } from "@/lib/types";

const STORAGE_KEY = "virtual_chamber_advocate_profile";

export default function AdvocateClientView({ slug }: { slug: string }) {
  const [advocate, setAdvocate] = useState<Advocate>(() => ({
    ...DEMO_ADVOCATE,
    slug,
  }));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Advocate;
        if (parsed.slug === slug || !parsed.slug) {
          setAdvocate(parsed);
        } else {
          setAdvocate({ ...parsed, slug });
        }
      }
    } catch {
      // fallback to state default
    }
  }, [slug]);

  return <ProfileCard advocate={advocate} />;
}
