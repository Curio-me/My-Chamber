/**
 * Utility functions for smart social URL normalization and handle extraction.
 * Allows advocates to enter full URLs, handles with '@', or plain usernames,
 * ensuring they always resolve to valid external https:// links.
 */

export type SocialPlatform =
  | "instagram"
  | "linkedin"
  | "twitter"
  | "youtube"
  | "facebook"
  | "website";

export function normalizeSocialUrl(platform: SocialPlatform, input: string): string {
  if (!input) return "";
  let val = input.trim();
  if (!val) return "";

  // Strip trailing slashes for clean processing
  val = val.replace(/\/+$/, "");

  switch (platform) {
    case "instagram": {
      // If already a full URL
      if (/^https?:\/\//i.test(val)) {
        return val.replace(/^http:\/\//i, "https://");
      }
      if (/^(www\.)?instagram\.com\//i.test(val)) {
        return `https://${val.replace(/^www\./i, "www.")}`;
      }
      // Strip leading @ or slashes
      const cleanHandle = val.replace(/^[@/]+/, "");
      return `https://www.instagram.com/${cleanHandle}`;
    }

    case "linkedin": {
      if (/^https?:\/\//i.test(val)) {
        return val.replace(/^http:\/\//i, "https://");
      }
      if (/^(www\.)?linkedin\.com\//i.test(val)) {
        return `https://${val.replace(/^www\./i, "www.")}`;
      }
      const cleanHandle = val.replace(/^[@/]+/, "");
      if (cleanHandle.startsWith("in/") || cleanHandle.startsWith("company/")) {
        return `https://www.linkedin.com/${cleanHandle}`;
      }
      return `https://www.linkedin.com/in/${cleanHandle}`;
    }

    case "twitter": {
      if (/^https?:\/\//i.test(val)) {
        return val.replace(/^http:\/\//i, "https://");
      }
      if (/^(www\.)?(twitter|x)\.com\//i.test(val)) {
        return `https://${val.replace(/^www\./i, "www.")}`;
      }
      const cleanHandle = val.replace(/^[@/]+/, "");
      return `https://x.com/${cleanHandle}`;
    }

    case "youtube": {
      if (/^https?:\/\//i.test(val)) {
        return val.replace(/^http:\/\//i, "https://");
      }
      if (/^(www\.)?youtube\.com\//i.test(val)) {
        return `https://${val.replace(/^www\./i, "www.")}`;
      }
      const clean = val.replace(/^\/+/, "");
      if (clean.startsWith("@") || clean.startsWith("channel/") || clean.startsWith("c/")) {
        return `https://www.youtube.com/${clean}`;
      }
      return `https://www.youtube.com/@${clean}`;
    }

    case "facebook": {
      if (/^https?:\/\//i.test(val)) {
        return val.replace(/^http:\/\//i, "https://");
      }
      if (/^(www\.)?facebook\.com\//i.test(val)) {
        return `https://${val.replace(/^www\./i, "www.")}`;
      }
      const cleanHandle = val.replace(/^[@/]+/, "");
      return `https://www.facebook.com/${cleanHandle}`;
    }

    case "website": {
      if (/^https?:\/\//i.test(val)) {
        return val;
      }
      return `https://${val}`;
    }

    default:
      return val;
  }
}

/**
 * Extracts a concise display handle from a social URL for clean UI badges.
 * e.g. "https://www.instagram.com/thecatalyst_9" -> "@thecatalyst_9"
 */
export function extractSocialHandle(platform: SocialPlatform, url?: string): string {
  if (!url) return "";
  const trimmed = url.trim().replace(/\/+$/, "");

  try {
    switch (platform) {
      case "instagram": {
        const match = trimmed.match(/(?:instagram\.com\/)([^/?#]+)/i);
        if (match && match[1]) return `@${match[1]}`;
        return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
      }
      case "twitter": {
        const match = trimmed.match(/(?:(?:twitter|x)\.com\/)([^/?#]+)/i);
        if (match && match[1]) return `@${match[1]}`;
        return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
      }
      case "youtube": {
        const match = trimmed.match(/(?:youtube\.com\/(?:@)?)([^/?#]+)/i);
        if (match && match[1]) return `@${match[1].replace(/^@/, "")}`;
        return "YouTube Channel";
      }
      case "linkedin": {
        const match = trimmed.match(/(?:linkedin\.com\/in\/)([^/?#]+)/i);
        if (match && match[1]) return match[1];
        return "Professional Profile";
      }
      case "facebook": {
        const match = trimmed.match(/(?:facebook\.com\/)([^/?#]+)/i);
        if (match && match[1]) return match[1];
        return "Chamber Page";
      }
      case "website": {
        return trimmed.replace(/^https?:\/\/(www\.)?/i, "").split("/")[0] || "Official Website";
      }
      default:
        return trimmed;
    }
  } catch {
    return trimmed;
  }
}
