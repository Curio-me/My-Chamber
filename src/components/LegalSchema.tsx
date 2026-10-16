import { Advocate } from "@/lib/types";

export function generateLegalSchema(advocate: Advocate, baseUrl = "https://my-chamber.vercel.app") {
  const profileUrl = `${baseUrl}/${advocate.slug}`;

  const credentials = (advocate.qualifications || []).map((deg) => ({
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "degree",
    name: deg,
  }));

  const memberships = [
    ...(advocate.enrollmentNo
      ? [
          {
            "@type": "Organization",
            name: `Bar Council Registration: ${advocate.enrollmentNo}`,
          },
        ]
      : []),
    ...(advocate.barAssociations || []).map((bar) => ({
      "@type": "Organization",
      name: bar,
    })),
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": ["Attorney", "LegalService", "ProfessionalService"],
    name: advocate.fullName,
    alternateName: advocate.slug ? `Adv. ${advocate.slug}` : undefined,
    jobTitle: "Advocate",
    description: advocate.bio || `Official Virtual Chamber profile of ${advocate.fullName}.`,
    url: profileUrl,
    image: advocate.photoUrl || undefined,
    telephone: advocate.mobile || undefined,
    email: advocate.email || undefined,
    address: advocate.officeAddress
      ? {
          "@type": "PostalAddress",
          streetAddress: advocate.officeAddress,
          addressCountry: "IN",
        }
      : undefined,
    ...(advocate.almaMater
      ? {
          alumniOf: {
            "@type": "EducationalOrganization",
            name: advocate.almaMater,
          },
        }
      : {}),
    ...(credentials.length > 0 ? { hasCredential: credentials } : {}),
    ...(memberships.length > 0 ? { memberOf: memberships } : {}),
    ...(advocate.specializations && advocate.specializations.length > 0
      ? { knowsAbout: advocate.specializations }
      : {}),
    ...(advocate.chamberHours ? { openingHours: advocate.chamberHours } : {}),
  };

  return schema;
}

export default function LegalSchema({ advocate }: { advocate: Advocate }) {
  const schema = generateLegalSchema(advocate);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
