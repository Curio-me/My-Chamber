import { createClient } from "@supabase/supabase-js";
import { Advocate } from "./types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ajscsmcykqbygbgtusxb.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqc2NzbWN5a3FieWdiZ3R1c3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNDg3OTUsImV4cCI6MjEwNzcyNDc5NX0.1rgMBY2jaxvhBxA9tts_JcCfH_HrKNI25U8yCN7uXH0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function mapRowToAdvocate(row: Record<string, any>): Advocate {
  const customLinksRaw = Array.isArray(row.custom_links) ? row.custom_links : [];
  const standardLinks: { id: string; title: string; url: string }[] = [];
  const newsItems: any[] = Array.isArray(row.news_media) ? [...row.news_media] : [];

  customLinksRaw.forEach((item: any) => {
    const isNews =
      item.isNews ||
      item.publication ||
      item.imageUrl ||
      (item.url &&
        (item.url.includes("tribuneindia") ||
          item.url.includes("livelaw") ||
          item.url.includes("barandbench") ||
          item.url.includes("timesofindia") ||
          item.url.includes("thehindu")));

    if (isNews) {
      if (!newsItems.some((n) => n.id === item.id || n.url === item.url)) {
        let pub = item.publication;
        if (!pub && item.url) {
          if (item.url.includes("tribuneindia")) pub = "The Tribune India";
          else if (item.url.includes("livelaw")) pub = "LiveLaw";
          else if (item.url.includes("barandbench")) pub = "Bar and Bench";
          else if (item.url.includes("timesofindia")) pub = "Times of India";
          else pub = "News Media";
        }

        newsItems.push({
          id: item.id || Date.now().toString(),
          title: item.title || "Press Feature",
          url: item.url,
          publication: pub || "News Media",
          imageUrl:
            item.imageUrl ||
            "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
          date: item.date || "Press Coverage",
        });
      }
    } else {
      standardLinks.push({
        id: item.id,
        title: item.title,
        url: item.url,
      });
    }
  });

  return {
    id: row.id,
    slug: row.slug,
    fullName: row.full_name,
    enrollmentNo: row.enrollment_no || "",
    bio: row.bio || "",
    photoUrl: row.photo_url || undefined,
    mobile: row.mobile || "",
    officePhone: row.office_phone || undefined,
    email: row.email || "",
    officeAddress: row.office_address || "",
    mapUrl: row.map_url || undefined,
    yearsExp: Number(row.years_exp) || 0,
    courts: Array.isArray(row.courts) ? row.courts : [],
    specializations: Array.isArray(row.specializations) ? row.specializations : [],
    languages: Array.isArray(row.languages) ? row.languages : [],
    instagramUrl: row.instagram_url || undefined,
    twitterUrl: row.twitter_url || undefined,
    linkedinUrl: row.linkedin_url || undefined,
    websiteUrl: row.website_url || undefined,
    customLinks: standardLinks,
    newsMedia: newsItems,
    themePreference: row.theme_preference || "dark",
    enable3d: row.enable_3d === true,
    isVerified: row.is_verified !== false,
  };
}

export function mapAdvocateToRow(advocate: Advocate, userId?: string) {
  // Store both customLinks and newsMedia tagged inside custom_links JSONB
  const combinedCustomLinks = [
    ...(advocate.customLinks || []).map((l) => ({ ...l, isNews: false })),
    ...(advocate.newsMedia || []).map((n) => ({
      id: n.id,
      title: n.title,
      url: n.url,
      publication: n.publication || "News Media",
      imageUrl: n.imageUrl || null,
      date: n.date || null,
      isNews: true,
    })),
  ];

  return {
    id: advocate.id || advocate.slug,
    slug: advocate.slug,
    user_id: userId || null,
    full_name: advocate.fullName,
    enrollment_no: advocate.enrollmentNo,
    bio: advocate.bio,
    photo_url: advocate.photoUrl || null,
    mobile: advocate.mobile || "",
    office_phone: advocate.officePhone || null,
    email: advocate.email || "",
    office_address: advocate.officeAddress || "",
    map_url: advocate.mapUrl || null,
    years_exp: advocate.yearsExp || 0,
    courts: advocate.courts || [],
    specializations: advocate.specializations || [],
    languages: advocate.languages || [],
    instagram_url: advocate.instagramUrl || null,
    twitter_url: advocate.twitterUrl || null,
    linkedin_url: advocate.linkedinUrl || null,
    website_url: advocate.websiteUrl || null,
    custom_links: combinedCustomLinks,
    theme_preference: advocate.themePreference || "dark",
    enable_3d: advocate.enable3d === true,
    is_verified: advocate.isVerified !== false,
    updated_at: new Date().toISOString(),
  };
}

// Fetch advocate by slug from Supabase
export async function fetchAdvocateBySlug(slug: string): Promise<Advocate | null> {
  try {
    const { data, error } = await supabase
      .from("advocate_profiles")
      .select("*")
      .eq("slug", slug.toLowerCase())
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapRowToAdvocate(data);
  } catch {
    return null;
  }
}

// Save or update advocate profile in Supabase
export async function upsertAdvocateProfile(
  advocate: Advocate,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const row = mapAdvocateToRow(advocate, userId);
    const { error } = await supabase
      .from("advocate_profiles")
      .upsert(row, { onConflict: "slug" });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error" };
  }
}
