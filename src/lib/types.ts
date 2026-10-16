export interface NewsMediaItem {
  id: string;
  title: string;
  publication?: string; // e.g. "The Tribune", "Times of India", "LiveLaw", "Bar & Bench"
  url: string; // Target link
  imageUrl?: string; // Article image thumbnail or clipping
  date?: string; // e.g. "Oct 2024"
}

export interface Advocate {
  id: string;
  slug: string;
  fullName: string;
  enrollmentNo: string;
  barAssociations?: string[]; // e.g. ["Panchkula Bar Association", "Punjab and Haryana High Court Bar Association"]
  qualifications?: string[]; // e.g. ["B.A. LL.B. (Hons.)", "LL.M. (Constitutional Law)"]
  almaMater?: string; // e.g. "Department of Laws, Panjab University, Chandigarh"
  chamberHours?: string; // e.g. "Mon – Sat: 10:00 AM – 7:30 PM (Consultations by Prior Appointment)"
  bio: string;
  photoUrl?: string;
  bannerUrl?: string;
  mobile: string;
  officePhone?: string;
  email: string;
  officeAddress: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  yearsExp: number;
  courts: string[];
  specializations: string[];
  languages: string[];
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  customLinks?: { id: string; title: string; url: string }[];
  newsMedia?: NewsMediaItem[];
  themePreference?: "dark" | "light";
  enable3d?: boolean;
  isVerified: boolean;
  boxOrder?: string[]; // Custom arrangement of profile boxes e.g. ["qualifications", "about", ...]
}

export interface BoxMeta {
  id: string;
  name: string;
  shortDesc: string;
  category: string;
}

export const DEFAULT_BOX_ORDER: string[] = [
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

export const ALL_BOXES: BoxMeta[] = [
  { id: "about", name: "About & Chamber Overview", shortDesc: "Biography and practice overview", category: "Bio" },
  { id: "specializations", name: "Specialized in Law", shortDesc: "Practice areas & legal expertise", category: "Practice" },
  { id: "courts", name: "Courts of Practice", shortDesc: "High Courts, District Courts & Tribunals", category: "Practice" },
  { id: "bar_associations", name: "Enrolled Bar Associations", shortDesc: "Bar Council & Association memberships", category: "Bar" },
  { id: "qualifications", name: "Academic Qualifications & Alma Mater", shortDesc: "Degrees, Law Faculty & Certifications", category: "Credentials" },
  { id: "contact", name: "Chamber Contacts", shortDesc: "Mobile, WhatsApp, Email and Landline", category: "Contact" },
  { id: "location", name: "Office Location & Google Maps", shortDesc: "Chamber address, interactive map & 1-tap directions", category: "Location" },
  { id: "news_media", name: "Newspaper & Press Coverage", shortDesc: "Interactive press articles & rulings carousel", category: "Media" },
  { id: "custom_links", name: "Key Links & Publications", shortDesc: "External case orders, judgment links & websites", category: "Links" },
];

// Popular / Common Bar Associations in India
export const COMMON_BAR_ASSOCIATIONS = [
  "Punjab and Haryana High Court Bar Association",
  "Panchkula Bar Association",
  "Supreme Court Bar Association (SCBA)",
  "Delhi High Court Bar Association (DHCBA)",
  "Chandigarh District Bar Association",
  "Bombay Bar Association",
  "Madras High Court Advocates Association (MHAA)",
  "Calcutta High Court Bar Association",
  "Allahabad High Court Bar Association",
  "District & Sessions Court Bar Association",
];

// Common Legal Degrees & Academic Qualifications in India
export const COMMON_QUALIFICATIONS = [
  "B.A. LL.B. (Hons.)",
  "LL.B.",
  "LL.M. (Constitutional Law)",
  "LL.M. (Corporate & Commercial Law)",
  "LL.M. (Criminal Law)",
  "Ph.D. in Law",
  "Diploma in Cyber Law",
  "Diploma in ADR & Arbitration",
];

// All possible specializations
export const ALL_SPECIALIZATIONS = [
  "Criminal Law",
  "Civil Law",
  "Family Law",
  "Property Law",
  "Corporate Law",
  "Labour Law",
  "Tax Law",
  "Constitutional Law",
  "Consumer Law",
  "Cyber Law",
  "Intellectual Property",
  "Matrimonial Law",
  "Cheque Bounce (NI Act)",
  "Motor Accident Claims",
  "Banking & Finance",
  "Environmental Law",
];

// All 25 High Courts in India + Supreme Court & Major Forums
export const ALL_COURTS = [
  "Supreme Court of India",
  "Allahabad High Court",
  "Andhra Pradesh High Court",
  "Bombay High Court",
  "Calcutta High Court",
  "Chhattisgarh High Court",
  "Delhi High Court",
  "Gauhati High Court",
  "Gujarat High Court",
  "Himachal Pradesh High Court",
  "Jammu & Kashmir and Ladakh High Court",
  "Jharkhand High Court",
  "Karnataka High Court",
  "Kerala High Court",
  "Madhya Pradesh High Court",
  "Madras High Court",
  "Manipur High Court",
  "Meghalaya High Court",
  "Orissa High Court",
  "Patna High Court",
  "Punjab and Haryana High Court",
  "Rajasthan High Court",
  "Sikkim High Court",
  "Telangana High Court",
  "Tripura High Court",
  "Uttarakhand High Court",
  "District & Sessions Court",
  "Family Court",
  "Labour Court / Industrial Tribunal",
  "NCLT / NCLAT (Company Law)",
  "Debt Recovery Tribunal (DRT / DRAT)",
  "Consumer Forum / NCDRC",
  "Armed Forces Tribunal (AFT)",
  "Central Administrative Tribunal (CAT)",
  "National Green Tribunal (NGT)",
];
