import { Advocate } from "@/lib/types";

export function generateLegalSchema(advocate: Advocate, baseUrl = "https://mychamber.me") {
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

  const socialLinks = [
    advocate.websiteUrl,
    advocate.linkedinUrl,
    advocate.twitterUrl,
    advocate.instagramUrl,
  ].filter((link): link is string => Boolean(link && link.trim().startsWith("http")));

  const practiceAreas = (advocate.specializations || []).map((spec) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: `Legal Advisory & Representation in ${spec}`,
      serviceType: spec,
    },
  }));

  const courtsServed = (advocate.courts || []).map((court) => ({
    "@type": "AdministrativeArea",
    name: court,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": ["Attorney", "LegalService", "ProfessionalService"],
    "@id": `${profileUrl}#attorney`,
    name: advocate.fullName,
    alternateName: advocate.slug
      ? [`Adv. ${advocate.slug}`, advocate.fullName.replace(/^Adv\.\s*/i, "")].filter(Boolean)
      : undefined,
    jobTitle: "Advocate",
    description:
      advocate.bio ||
      `Official digital chamber profile of ${advocate.fullName}. Practicing advocate at ${
        advocate.courts?.[0] || "High Court"
      }. Bar Council Registration: ${advocate.enrollmentNo || "Registered"}.`,
    url: profileUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": profileUrl,
    },
    image: advocate.photoUrl && advocate.photoUrl.startsWith("http") ? advocate.photoUrl : undefined,
    telephone: advocate.mobile || undefined,
    email: advocate.email || undefined,
    address: advocate.officeAddress
      ? {
          "@type": "PostalAddress",
          streetAddress: advocate.officeAddress,
          addressCountry: "IN",
        }
      : undefined,
    ...(advocate.latitude && advocate.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: advocate.latitude,
            longitude: advocate.longitude,
          },
        }
      : {}),
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
    ...(practiceAreas.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Legal Practice Areas & Services",
            itemListElement: practiceAreas,
          },
        }
      : {}),
    ...(courtsServed.length > 0 ? { areaServed: courtsServed } : {}),
    ...(advocate.chamberHours ? { openingHours: advocate.chamberHours } : {}),
    ...(socialLinks.length > 0 ? { sameAs: socialLinks } : {}),
    priceRange: "₹₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Bank Transfer, Net Banking",
  };

  return schema;
}

export default function LegalSchema({ advocate }: { advocate: Advocate }) {
  const schema = generateLegalSchema(advocate);
  const profileUrl = `https://mychamber.me/${encodeURIComponent(advocate.slug || "")}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "My Chamber",
        item: "https://mychamber.me",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: advocate.fullName,
        item: profileUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
