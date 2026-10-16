import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const parsedUrl = new URL(targetUrl);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: "Invalid URL protocol" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch page: HTTP ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();

    // 1. Extract OpenGraph or Twitter Image
    let imageUrl =
      html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)?.[1] ||
      html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i)?.[1] ||
      html.match(/<link[^>]*rel=["']image_src["'][^>]*href=["']([^"']+)["']/i)?.[1];

    if (imageUrl) {
      // Decode HTML entities
      imageUrl = imageUrl.replace(/&amp;/g, "&");
      try {
        imageUrl = new URL(imageUrl, targetUrl).href;
      } catch {}
    }

    // 2. Extract Title / Headline
    let title =
      html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i)?.[1] ||
      html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];

    if (title) {
      title = title
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 3. Extract Site Name / Publication
    let publication =
      html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:site_name["']/i)?.[1];

    if (!publication) {
      const hostname = parsedUrl.hostname.toLowerCase();
      if (hostname.includes("tribuneindia")) publication = "The Tribune";
      else if (hostname.includes("livelaw")) publication = "LiveLaw";
      else if (hostname.includes("barandbench")) publication = "Bar & Bench";
      else if (hostname.includes("timesofindia")) publication = "Times of India";
      else if (hostname.includes("thehindu")) publication = "The Hindu";
      else if (hostname.includes("indianexpress")) publication = "The Indian Express";
      else if (hostname.includes("hindustantimes")) publication = "Hindustan Times";
      else {
        // Derive clean brand name from domain (e.g. example.com -> Example)
        publication = hostname.replace(/^www\./, "").split(".")[0];
        publication = publication.charAt(0).toUpperCase() + publication.slice(1);
      }
    }

    return NextResponse.json({
      success: true,
      title: title || "News Article",
      imageUrl: imageUrl || null,
      publication: publication || "News Media",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to extract metadata" },
      { status: 500 }
    );
  }
}
