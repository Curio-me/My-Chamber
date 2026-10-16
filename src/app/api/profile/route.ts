import { NextResponse } from "next/server";
import { Advocate } from "@/lib/types";

// Server memory cache for serverless lifecycle
const profileCache: Record<string, Advocate> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  const profile = profileCache[slug];
  if (!profile) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function POST(request: Request) {
  try {
    const profile: Advocate = await request.json();
    if (!profile || !profile.slug) {
      return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
    }

    profileCache[profile.slug] = profile;

    return NextResponse.json({ success: true, slug: profile.slug });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
