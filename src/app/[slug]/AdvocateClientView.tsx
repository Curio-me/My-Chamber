"use client";

import { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import UnclaimedChamberView from "@/components/UnclaimedChamberView";
import { Advocate } from "@/lib/types";

const STORAGE_KEY = "virtual_chamber_advocate_profile";

interface AdvocateClientViewProps {
  slug: string;
  initialAdvocate?: Advocate | null;
}

export default function AdvocateClientView({ slug, initialAdvocate }: AdvocateClientViewProps) {
  const [advocate, setAdvocate] = useState<Advocate | null>(() => initialAdvocate || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialAdvocate);

  useEffect(() => {
    try {
      // 1. If local editing occurred on this device, check local storage for instant preview
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Advocate;
        if (
          parsed.slug &&
          parsed.slug.toLowerCase() === slug.toLowerCase() &&
          parsed.fullName
        ) {
          setAdvocate(parsed);
          setIsLoading(false);
        }
      }

      // 2. Fetch live data from API in background to ensure fresh data
      fetch(`/api/profile?slug=${encodeURIComponent(slug)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.fullName) {
            setAdvocate(data);
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsLoading(false);
        });
    } catch {
      setIsLoading(false);
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-sm font-semibold text-[#163826]">
        Opening Digital Chamber...
      </div>
    );
  }

  // If no published profile exists in the database for this slug, display the Claim Chamber view
  if (!advocate) {
    return <UnclaimedChamberView slug={slug} />;
  }

  return <ProfileCard advocate={advocate} />;
}
