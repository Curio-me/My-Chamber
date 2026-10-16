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

// All major courts in India
export const ALL_COURTS = [
  "Supreme Court of India",
  "Delhi High Court",
  "Bombay High Court",
  "Madras High Court",
  "Calcutta High Court",
  "Allahabad High Court",
  "Rajasthan High Court",
  "Gujarat High Court",
  "Karnataka High Court",
  "Telangana High Court",
  "District Court",
  "Sessions Court",
  "Family Court",
  "Consumer Forum",
  "Labour Court",
  "Debt Recovery Tribunal",
];
