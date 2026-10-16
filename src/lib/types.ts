// Types for Virtual Chamber advocate profiles

export interface Advocate {
  id: string;
  slug: string;
  fullName: string;
  enrollmentNo: string;
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
  themePreference?: "dark" | "light";
  enable3d?: boolean;
  isVerified: boolean;
}

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
