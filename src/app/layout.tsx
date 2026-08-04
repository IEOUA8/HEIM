import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { eventConfig } from "@/config/event";
import "./globals.css";

// Tipografía principal HEIM — Manrope (§5.4 del documento maestro)
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = "https://heim-caminata.vercel.app";
const title = "Caminata por los animales · HEIM";
const description =
  "Inscríbete a la Caminata por los animales de HEIM — 6 de septiembre de 2026. Tu participación impulsa jornadas de esterilización para animales rescatados. Incluye póliza de seguro y snack para ti y tu perro.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · HEIM",
  },
  description,
  applicationName: "Caminata HEIM",
  keywords: [
    "HEIM",
    "caminata por los animales",
    "inscripción caminata",
    "esterilización animales rescatados",
    "evento con perros",
    "Ángeles de la Calle",
  ],
  authors: [{ name: "HEIM" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteUrl,
    siteName: "HEIM · Caminata por los animales",
    title,
    description,
    images: [
      {
        url: "/og-cover.png?v=2",
        width: 1672,
        height: 941,
        alt: "Caminata por los animales — Formulario de inscripción · 6 de septiembre 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-cover.png?v=2"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#233F35",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Datos estructurados del evento (schema.org) para resultados enriquecidos.
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Caminata por los animales",
    startDate: "2026-09-06T08:00:00-05:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description,
    image: [`${siteUrl}/og-cover.png?v=2`],
    organizer: { "@type": "Organization", name: "HEIM", url: siteUrl },
    location: {
      "@type": "Place",
      name: eventConfig.location.name,
      address: "Colombia",
    },
  };

  return (
    <html lang="es" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
      </body>
    </html>
  );
}
