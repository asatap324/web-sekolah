// components/homepage-structured-data.tsx
export function HomepageStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "SMP Negeri 04 Muncar Satu Atap",
    description: "Sekolah Menengah Pertama Negeri di Banyuwangi",
    url: "https://smpn4muncarsatuatap.sch.id",
    logo: "https://smpn4muncarsatuatap.sch.id/logo-smp.png",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Dusun Kabatmantren Rt. 03 Rw. 06, Kecamatan Muncar, Kabupaten Banyuwangi",
      addressLocality: "Muncar",
      addressRegion: "Jawa Timur",
      postalCode: "68472",
      addressCountry: "ID",
    },
    telephone: "(0333) 590094",
    email: "smpn4muncar_satuatap@yahoo.com",
    sameAs: [
      "https://www.instagram.com/smpn4muncar_satuatap?utm_source=ig_web_button_share_sheet&igsh=NXRpZ280b2xoeTJv",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
