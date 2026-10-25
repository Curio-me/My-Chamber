import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Plus Jakarta Sans — modern, geometric, exceptionally clear and readable
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mychamber.me"),
  title: {
    default: "My Chamber — Digital Profiles for Indian Advocates",
    template: "%s | My Chamber",
  },
  description:
    "The Link in Bio & Digital Chamber platform built exclusively for Indian advocates. Verified Bar Council credentials, 1-tap phonebook vCard, printable desk QR codes, and client consultations.",
  keywords: [
    "advocate",
    "lawyer",
    "my chamber",
    "digital chamber",
    "High Court",
    "Supreme Court of India",
    "District Court",
    "Bar Council of India",
    "legal",
    "India",
    "vCard",
    "visiting card QR",
    "acrylic desk stand QR",
  ],
  authors: [{ name: "My Chamber" }],
  creator: "My Chamber",
  publisher: "My Chamber",
  alternates: {
    canonical: "https://mychamber.me",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mychamber.me",
    siteName: "My Chamber",
    title: "My Chamber — Digital Profiles for Indian Advocates",
    description:
      "A distinguished digital chamber infrastructure for advocates in India. Bar Council verification, 1-tap vCard, desk QR code, and court particulars.",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Chamber — Digital Profiles for Indian Advocates",
    description:
      "A distinguished digital chamber infrastructure for advocates in India. Bar Council verification, 1-tap vCard, desk QR code, and court particulars.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#FAF7F2] text-[#14231C] font-sans">
        {children}
      </body>
    </html>
  );
}
