interface JsonLdProps {
  data: Record<string, unknown>;
}

const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLd;

export const motorcycleDealerSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MotorcycleDealer",
      "@id": "https://pasamotor.com.tr/#organization",
      name: "Paşa Motor",
      url: "https://pasamotor.com.tr",
      telephone: ["+902125868598", "+905348996817"],
      email: "pasamotor@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kızılelma Cad. No:66/A",
        addressLocality: "Fatih",
        addressRegion: "İstanbul",
        postalCode: "34104",
        addressCountry: "TR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "41.0085",
        longitude: "28.9265",
      },
      brand: [
        { "@type": "Brand", name: "TVS" },
        { "@type": "Brand", name: "Hero" },
        { "@type": "Brand", name: "Falcon" },
        { "@type": "Brand", name: "Işıldar" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "19:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "09:00",
          closes: "17:00",
        },
      ],
      priceRange: "$$",
    },
    {
      "@type": "WebSite",
      "@id": "https://pasamotor.com.tr/#website",
      name: "Paşa Motor — İstanbul Fatih Motosiklet Yetkili Bayii",
      url: "https://pasamotor.com.tr",
    },
  ],
};
