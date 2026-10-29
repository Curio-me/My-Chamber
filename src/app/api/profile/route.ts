import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Advocate } from "@/lib/types";
import { fetchAdvocateBySlug, upsertAdvocateProfile } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  // 1. Attempt to fetch from Supabase
  const dbProfile = await fetchAdvocateBySlug(slug);
  if (dbProfile) {
    return NextResponse.json(dbProfile);
  }

  return NextResponse.json({ found: false }, { status: 404 });
}

export async function POST(request: Request) {
  try {
    const profile: Advocate = await request.json();
    if (!profile || !profile.slug) {
      return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
    }

    // Upsert into Supabase database (validates mandatory & unique Bar Council enrollment)
    const result = await upsertAdvocateProfile(profile);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Database error" }, { status: 400 });
    }

    // Immediately revalidate the chamber's Edge CDN cache so visitors get fresh data instantly
    try {
      revalidatePath(`/${profile.slug}`);
      revalidatePath(`/${profile.slug}`, "page");
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, slug: profile.slug });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
