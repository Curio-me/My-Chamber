import { Advocate } from "./types";

// Demo advocate profile — used for the static preview
export const DEMO_ADVOCATE: Advocate = {
  id: "demo-1",
  slug: "adv-ramesh-kumar-sharma",
  fullName: "Adv. Ramesh Kumar Sharma",
  enrollmentNo: "D/5678/2004",
  bio: "Senior Advocate with 20+ years of experience practicing at the Delhi High Court and District Courts. I have handled over 500+ criminal cases, 300+ civil matters, and have a strong track record in property and family disputes. My mission is to ensure every client receives fair representation and justice, regardless of their background.",
  photoUrl: undefined, // Will use initials avatar
  mobile: "+91-98765-43210",
  officePhone: "011-23456789",
  email: "ramesh.sharma@virtualchamber.in",
  officeAddress:
    "Chamber No. 45, Block-C, Lawyers' Block, Saket District Court Complex, New Delhi – 110017",
  mapUrl: "https://maps.google.com/?q=Saket+District+Court+Complex+New+Delhi",
  yearsExp: 20,
  courts: [
    "Delhi High Court",
    "District Court",
    "Sessions Court",
    "Family Court",
  ],
  specializations: [
    "Criminal Law",
    "Family Law",
    "Property Law",
    "Civil Law",
    "Cheque Bounce (NI Act)",
  ],
  languages: ["Hindi", "English", "Punjabi"],
  instagramUrl: "https://instagram.com/advramesh",
  twitterUrl: "https://twitter.com/advramesh",
  linkedinUrl: "https://linkedin.com/in/advramesh",
  websiteUrl: undefined,
  themePreference: "dark",
  enable3d: true,
  isVerified: true,
};
