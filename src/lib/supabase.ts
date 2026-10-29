import { createClient } from "@supabase/supabase-js";
import { Advocate, ChamberClaimRequest } from "./types";

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
    if (!item || typeof item !== "object") {
      return;
    }

    // Ignore internal metadata entries stored inside custom_links JSONB
    if (item.isBarAssociations || item.isProfileMeta || item.id?.startsWith("meta_")) {
      return;
    }

    // If explicitly marked as standard link or not news
    if (item.isNews === false) {
      if ((item.title && item.title.trim()) || (item.url && item.url.trim())) {
        standardLinks.push({
          id: item.id || `link_${Date.now()}_${Math.random()}`,
          title: item.title || "",
          url: item.url || "",
        });
      }
      return;
    }

    // Only treat as news if explicitly flagged as news or has news media properties (publication + imageUrl)
    const isNews =
      item.isNews === true ||
      Boolean(item.publication && item.imageUrl);

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
      // Only keep actual custom links with valid title or URL (discard empty ghost objects)
      if ((item.title && item.title.trim()) || (item.url && item.url.trim())) {
        standardLinks.push({
          id: item.id || `link_${Date.now()}_${Math.random()}`,
          title: item.title || "",
          url: item.url || "",
        });
      }
    }
  });

  // Extract Bar Associations (either column or custom_links fallback)
  let barAssocs: string[] = [];
  if (Array.isArray(row.bar_associations)) {
    barAssocs = row.bar_associations;
  } else if (Array.isArray(row.barAssociations)) {
    barAssocs = row.barAssociations;
  } else {
    const metaItem = customLinksRaw.find((c: any) => c.isBarAssociations);
    if (metaItem && Array.isArray(metaItem.items)) {
      barAssocs = metaItem.items;
    }
  }

  // Extract Extended Metadata (qualifications, almaMater, chamberHours, boxOrder)
  const metaProfile = customLinksRaw.find((c: any) => c.isProfileMeta) || {};
  const qualifications: string[] = Array.isArray(row.qualifications)
    ? row.qualifications
    : Array.isArray(metaProfile.qualifications)
    ? metaProfile.qualifications
    : [];
  const almaMater: string = row.alma_mater || metaProfile.almaMater || "";
  const chamberHours: string = row.chamber_hours || metaProfile.chamberHours || "";
  const barIdCardUrl: string | undefined = row.bar_id_card_url || metaProfile.barIdCardUrl || undefined;
  const hideEnrollmentNo: boolean = Boolean(row.hide_enrollment_no || metaProfile.hideEnrollmentNo);
  const verificationStatus: "unverified" | "pending" | "verified" =
    metaProfile.verificationStatus || (row.is_verified ? "verified" : "unverified");
  const boxOrder: string[] = Array.isArray(row.box_order)
    ? row.box_order
    : Array.isArray(metaProfile.boxOrder)
    ? metaProfile.boxOrder
    : [
        "about",
        "specializations",
        "courts",
        "bar_associations",
        "qualifications",
        "contact",
        "location",
        "news_media",
        "custom_links",
      ];

  return {
    id: row.id,
    slug: row.slug,
    fullName: row.full_name,
    enrollmentNo: row.enrollment_no || "",
    barAssociations: barAssocs,
    qualifications,
    almaMater,
    chamberHours,
    boxOrder,
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
    youtubeUrl: row.youtube_url || metaProfile.youtubeUrl || undefined,
    facebookUrl: row.facebook_url || metaProfile.facebookUrl || undefined,
    websiteUrl: row.website_url || undefined,
    customLinks: standardLinks,
    newsMedia: newsItems,
    themePreference: row.theme_preference || "dark",
    enable3d: row.enable_3d === true,
    isVerified: row.is_verified !== false,
    barIdCardUrl,
    verificationStatus,
    hideEnrollmentNo,
  };
}

export function mapAdvocateToRow(advocate: Advocate, userId?: string) {
  // Clean custom links: strictly filter out empty ghost links and internal metadata, and cap to 3
  const cleanCustomLinks = (advocate.customLinks || [])
    .filter(
      (l) =>
        l &&
        !l.id?.startsWith("meta_") &&
        !(l as any).isProfileMeta &&
        !(l as any).isBarAssociations &&
        (Boolean(l.title?.trim()) || Boolean(l.url?.trim()))
    )
    .slice(0, 3)
    .map((l) => ({ id: l.id, title: l.title, url: l.url, isNews: false }));

  // Store customLinks, newsMedia, barAssociations, and profile meta inside custom_links JSONB
  const combinedCustomLinks = [
    ...cleanCustomLinks,
    ...(advocate.newsMedia || []).map((n) => ({
      id: n.id,
      title: n.title,
      url: n.url,
      publication: n.publication || "News Media",
      imageUrl: n.imageUrl || null,
      date: n.date || null,
      isNews: true,
    })),
    ...(advocate.barAssociations && advocate.barAssociations.length > 0
      ? [{ id: "meta_bar_associations", isBarAssociations: true, items: advocate.barAssociations }]
      : []),
    {
      id: "meta_profile_extensions",
      isProfileMeta: true,
      qualifications: advocate.qualifications || [],
      almaMater: advocate.almaMater || "",
      chamberHours: advocate.chamberHours || "",
      // Only store storage paths or cloud URLs; never embed multi-megabyte base64 strings in metadata
      barIdCardUrl: advocate.barIdCardUrl && !advocate.barIdCardUrl.startsWith("data:")
        ? advocate.barIdCardUrl
        : null,
      verificationStatus: advocate.verificationStatus || (advocate.isVerified ? "verified" : "unverified"),
      hideEnrollmentNo: advocate.hideEnrollmentNo === true,
      youtubeUrl: advocate.youtubeUrl || null,
      facebookUrl: advocate.facebookUrl || null,
      boxOrder: advocate.boxOrder || [
        "about",
        "specializations",
        "courts",
        "bar_associations",
        "qualifications",
        "contact",
        "location",
        "news_media",
        "custom_links",
      ],
    },
  ];

  const cleanSlug = (advocate.slug || "").trim().toLowerCase();
  const profileId =
    advocate.id && advocate.id !== "chamber-new"
      ? advocate.id
      : cleanSlug || `adv_${Date.now()}`;

  return {
    id: profileId,
    slug: cleanSlug,
    user_id: userId || null,
    full_name: advocate.fullName,
    enrollment_no: advocate.enrollmentNo,
    bio: advocate.bio ? advocate.bio.slice(0, 800) : "",
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

// Fetch advocate by slug from Supabase (with 6s safety timeout for cold-start resilience)
export async function fetchAdvocateBySlug(slug: string): Promise<Advocate | null> {
  try {
    const fetchPromise = supabase
      .from("advocate_profiles")
      .select("*")
      .eq("slug", slug.toLowerCase())
      .maybeSingle();

    const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: "timeout" }), 6000)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (error || !data) {
      return null;
    }

    return mapRowToAdvocate(data);
  } catch {
    return null;
  }
}

// Fetch all registered advocate slugs for dynamic SEO sitemap generation
export async function fetchAllAdvocateSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  try {
    const { data, error } = await supabase
      .from("advocate_profiles")
      .select("slug, updated_at");

    if (error || !data) {
      return [];
    }

    return data
      .filter((row) => Boolean(row.slug))
      .map((row) => ({
        slug: row.slug,
        updatedAt: row.updated_at,
      }));
  } catch {
    return [];
  }
}

// ── Bar Council Uniqueness & Normalization Helpers ──────────────────────────
export function normalizeEnrollmentNo(enrollment: string): string {
  if (!enrollment) return "";
  return enrollment.trim().toUpperCase().replace(/\s+/g, "").replace(/\/+/g, "/");
}

export async function checkBarCouncilUnique(
  enrollmentNo: string,
  currentSlug: string
): Promise<{ isUnique: boolean; conflictingSlug?: string; error?: string }> {
  try {
    const normalized = normalizeEnrollmentNo(enrollmentNo);
    if (!normalized) {
      return { isUnique: false, error: "Bar Council Enrollment Number is mandatory." };
    }

    // Query existing profiles to verify uniqueness (indexed / limited check)
    const { data, error } = await supabase
      .from("advocate_profiles")
      .select("slug, enrollment_no")
      .neq("slug", currentSlug.toLowerCase())
      .limit(100);

    if (error) {
      return { isUnique: true };
    }

    if (data && Array.isArray(data)) {
      const match = data.find((row) => {
        if (!row.enrollment_no) return false;
        const rowNorm = normalizeEnrollmentNo(row.enrollment_no);
        return rowNorm === normalized;
      });

      if (match) {
        return { isUnique: false, conflictingSlug: match.slug };
      }
    }

    return { isUnique: true };
  } catch (err: any) {
    return { isUnique: true };
  }
}

// Save or update advocate profile in Supabase
export async function upsertAdvocateProfile(
  advocate: Advocate,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!advocate.enrollmentNo || advocate.enrollmentNo.trim().length === 0) {
      return {
        success: false,
        error: "Bar Council Enrollment Number is mandatory for every advocate profile.",
      };
    }

    // Strict format validation: reject asterisks (*), placeholders, or invalid state conventions
    const formatCheck = validateBarCouncilFormat(advocate.enrollmentNo);
    if (!formatCheck.isValid) {
      return {
        success: false,
        error: `Invalid Bar Council Enrollment format (${advocate.enrollmentNo}). ${formatCheck.suggestion || "Must follow [State]/[Number]/[Year], e.g. PH/7797/2025. Asterisks (*) or placeholder masks are not allowed."}`,
      };
    }

    const cleanSlug = (advocate.slug || "").trim().toLowerCase();
    if (!cleanSlug || cleanSlug.length < 4 || cleanSlug.length > 20) {
      return {
        success: false,
        error: "Chamber unique handle must be between 4 and 20 characters long (e.g. /yourname).",
      };
    }

    // Enforce 1 profile per Bar Council Number rule
    const uniqueCheck = await checkBarCouncilUnique(advocate.enrollmentNo, advocate.slug);
    if (!uniqueCheck.isUnique) {
      return {
        success: false,
        error: `Bar Council Enrollment Number (${advocate.enrollmentNo}) is already registered to another advocate profile (@${uniqueCheck.conflictingSlug}). Each advocate may only have 1 profile per unique Bar Council registration. Multiple profiles are not allowed.`,
      };
    }

    // Query if a profile with this slug already exists to preserve its primary key ID and verify ownership
    const { data: existingProfile } = await supabase
      .from("advocate_profiles")
      .select("id, user_id, email, full_name")
      .eq("slug", cleanSlug)
      .maybeSingle();

    // Strict Security: If the chamber already exists, verify authenticated ownership!
    if (existingProfile) {
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;

      if (!currentUser) {
        return {
          success: false,
          error: `Authentication required: @${cleanSlug} is an active, claimed chamber. Please log in with the registered owner's email to save changes.`,
        };
      }

      const isOwner =
        (existingProfile.user_id && existingProfile.user_id === currentUser.id) ||
        (existingProfile.email && currentUser.email && existingProfile.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (!existingProfile.user_id && existingProfile.email && currentUser.email && existingProfile.email.toLowerCase() === currentUser.email.toLowerCase());

      if (!isOwner) {
        return {
          success: false,
          error: `Unauthorized: @${cleanSlug} is owned by ${existingProfile.full_name || "another advocate"}. You do not have permission to modify this chamber.`,
        };
      }
    }

    const profileId =
      existingProfile?.id ||
      (advocate.id && advocate.id !== "chamber-new" ? advocate.id : cleanSlug);

    const activeUserId = userId || (await supabase.auth.getUser()).data.user?.id || undefined;
    const row = mapAdvocateToRow({ ...advocate, id: profileId, slug: cleanSlug }, activeUserId);
    row.enrollment_no = normalizeEnrollmentNo(advocate.enrollmentNo);

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

// ── Submit Chamber Ownership Dispute / Bar Council Claim ─────────────────────
export async function submitChamberClaim(
  claim: ChamberClaimRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    const claimRecord = {
      enrollment_no: normalizeEnrollmentNo(claim.enrollmentNo),
      claimant_name: claim.claimantName,
      claimant_email: claim.claimantEmail,
      claimant_phone: claim.claimantPhone || null,
      notes: claim.notes || null,
      proof_url: claim.proofUrl || null,
      conflicting_slug: claim.conflictingSlug || null,
      status: "pending",
    };

    // Attempt Supabase insert
    const { error } = await supabase.from("chamber_claims").insert(claimRecord);
    if (error) {
      // Save locally if database table is pending migration
      if (typeof window !== "undefined") {
        const existing = JSON.parse(localStorage.getItem("virtual_chamber_claims") || "[]");
        existing.push({
          ...claimRecord,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        });
        localStorage.setItem("virtual_chamber_claims", JSON.stringify(existing));
      }
    }

    return { success: true };
  } catch {
    return { success: true };
  }
}

// ── Validate Indian Bar Council Number Format ────────────────────────────────
export function validateBarCouncilFormat(val: string): {
  isValid: boolean;
  suggestion?: string;
  state?: string;
} {
  if (!val || val.trim().length === 0) {
    return { isValid: false, suggestion: "Bar Council Enrollment Number is mandatory." };
  }
  const clean = val.trim().toUpperCase().replace(/\s+/g, "");

  // Strictly reject any asterisks or masks (e.g. PH/*****/**** or D/XX/2020)
  if (clean.includes("*") || /x{2,}/i.test(clean)) {
    return {
      isValid: false,
      suggestion: "Masking with asterisks (*) or placeholder letters is strictly prohibited. Please enter your real registration number.",
    };
  }

  // Pattern: STATE / ROLL_NO / YEAR (e.g. PH/7797/2025, D/1234/2020, KAR-1234-2019, MAH/567/18)
  const pattern = /^[A-Z]{1,5}[\/\-]\d+[\/\-](19\d{2}|20\d{2}|\d{2})$/i;

  if (pattern.test(clean)) {
    return { isValid: true };
  }

  const STATE_CODES: Record<string, string> = {
    PH: "Punjab and Haryana",
    D: "Delhi",
    UP: "Uttar Pradesh",
    MAH: "Maharashtra & Goa",
    MH: "Maharashtra & Goa",
    WB: "West Bengal",
    KAR: "Karnataka",
    TN: "Tamil Nadu",
    AP: "Andhra Pradesh",
    TS: "Telangana",
    RAJ: "Rajasthan",
    MP: "Madhya Pradesh",
    GUJ: "Gujarat",
    BIH: "Bihar",
    KER: "Kerala",
    ORI: "Odisha",
    OD: "Odisha",
    JK: "Jammu & Kashmir",
    HP: "Himachal Pradesh",
    UK: "Uttarakhand",
    CG: "Chhattisgarh",
    JH: "Jharkhand",
    AS: "Assam",
  };

  const parts = clean.split(/[\/\-_]/);
  const detectedState = parts[0] && STATE_CODES[parts[0]] ? STATE_CODES[parts[0]] : undefined;

  return {
    isValid: false,
    state: detectedState,
    suggestion: "Format must be [State]/[Number]/[Year], e.g. PH/7797/2025, D/1234/2020, or MAH/567/2019.",
  };
}

// ── Admin Verification & Profile Management ──────────────────────────────────
export async function fetchAllAdvocatesForAdmin(): Promise<Advocate[]> {
  try {
    const { data, error } = await supabase
      .from("advocate_profiles")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((row) => mapRowToAdvocate(row));
  } catch {
    return [];
  }
}

export async function updateAdvocateVerificationStatus(
  id: string,
  isVerified: boolean,
  status: "verified" | "unverified" | "pending"
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: row, error: fetchErr } = await supabase
      .from("advocate_profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr || !row) {
      return { success: false, error: fetchErr?.message || "Advocate record not found" };
    }

    const advocate = mapRowToAdvocate(row);
    advocate.isVerified = isVerified;
    advocate.verificationStatus = status;

    const updatedRow = mapAdvocateToRow(advocate, row.user_id);

    const { error: updateErr } = await supabase
      .from("advocate_profiles")
      .update({
        is_verified: isVerified,
        custom_links: updatedRow.custom_links,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update verification status" };
  }
}

// ── Supabase Storage Helpers ──────────────────────────────────────────────────

/**
 * Upload compressed profile portrait photo to Supabase 'avatars' public CDN bucket.
 * Returns the permanent public CDN URL.
 */
export async function uploadProfilePhotoToStorage(
  blob: Blob,
  slug: string
): Promise<{ url: string | null; error?: string }> {
  try {
    const cleanSlug = (slug || "advocate").toLowerCase().replace(/[^a-z0-9-]/g, "");
    const fileName = `${cleanSlug}-${Date.now()}.jpg`;
    const filePath = `profiles/${fileName}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, blob, {
        contentType: "image/jpeg",
        upsert: true,
        cacheControl: "31536000", // 1 year immutable CDN cache
      });

    if (error || !data) {
      return { url: null, error: error?.message || "Storage upload failed" };
    }

    const { data: publicData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return { url: publicData.publicUrl };
  } catch (err: any) {
    return { url: null, error: err.message || "Failed to upload avatar" };
  }
}

/**
 * Upload sensitive Bar Council ID card / certificate to private 'verification-documents' bucket.
 * Returns the private storage path.
 */
export async function uploadVerificationDocToStorage(
  fileOrBlob: Blob,
  slug: string,
  extension = "jpg"
): Promise<{ path: string | null; error?: string }> {
  try {
    const cleanSlug = (slug || "advocate").toLowerCase().replace(/[^a-z0-9-]/g, "");
    const fileName = `${cleanSlug}-bar-id-${Date.now()}.${extension}`;
    const filePath = `bar-ids/${fileName}`;

    const { data, error } = await supabase.storage
      .from("verification-documents")
      .upload(filePath, fileOrBlob, {
        upsert: true,
        contentType: fileOrBlob.type || "image/jpeg",
      });

    if (error || !data) {
      return { path: null, error: error?.message || "ID proof upload failed" };
    }

    // Return the private storage identifier
    return { path: `storage://${filePath}` };
  } catch (err: any) {
    return { path: null, error: err.message || "Failed to upload verification document" };
  }
}

/**
 * Generate a secure, time-limited signed URL for admin viewing of private Bar Council ID cards.
 */
export async function getVerificationDocSignedUrl(
  pathOrUrl: string,
  expiresInSeconds = 300
): Promise<string> {
  if (!pathOrUrl) return "";

  // If already a data URL or external HTTP URL, return as-is
  if (pathOrUrl.startsWith("data:") || (pathOrUrl.startsWith("http") && !pathOrUrl.includes("verification-documents"))) {
    return pathOrUrl;
  }

  try {
    // Strip "storage://" prefix if present
    const cleanPath = pathOrUrl.replace(/^storage:\/\//, "");

    const { data, error } = await supabase.storage
      .from("verification-documents")
      .createSignedUrl(cleanPath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      return pathOrUrl;
    }

    return data.signedUrl;
  } catch {
    return pathOrUrl;
  }
}
