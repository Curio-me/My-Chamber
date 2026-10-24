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
  title: {
    default: "My Chamber — Digital Profiles for Indian Advocates",
    template: "%s | My Chamber",
  },
  description:
    "My Chamber is a distinguished digital chamber infrastructure for advocates in India. Showcase office contact, bar enrollment, specializations, and office location.",
  keywords: ["advocate", "lawyer", "my chamber", "virtual chamber", "High Court", "legal", "India"],
  openGraph: {
    title: "My Chamber — Digital Profiles for Indian Advocates",
    description:
      "Every advocate deserves a digital presence. Shareable chamber profile with practice areas, direct contact, and map location.",
    siteName: "My Chamber",
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
