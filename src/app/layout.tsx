import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Plus Jakarta Sans — modern, geometric, exceptionally clear and readable (similar to Google Sans)
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Adv. Ramesh Kumar Sharma | Virtual Chamber",
  description:
    "Official Virtual Chamber profile. Practice areas, Bar Council registration, office location, and direct contact channels.",
  keywords: ["advocate", "lawyer", "virtual chamber", "Delhi High Court", "legal"],
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
