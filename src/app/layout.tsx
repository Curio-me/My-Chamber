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
    default: "Virtual Chamber — Digital Profiles for Indian Advocates",
    template: "%s | Virtual Chamber",
  },
  description:
    "Virtual Chamber is a digital profile platform for advocates in India. Showcase office contact, bar enrollment, specializations, and office location.",
  keywords: ["advocate", "lawyer", "virtual chamber", "High Court", "legal", "India"],
  openGraph: {
    title: "Virtual Chamber — Digital Profiles for Indian Advocates",
    description:
      "Every advocate deserves a digital presence. Shareable chamber profile with practice areas, direct contact, and map location.",
    siteName: "Virtual Chamber",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0e0e10] text-[#f1f3f4] font-sans">
        {children}
      </body>
    </html>
  );
}
