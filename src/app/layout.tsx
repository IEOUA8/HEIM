import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

// Tipografía principal HEIM — Manrope (§5.4 del documento maestro)
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HEIM · Caminata por los animales",
  description:
    "Inscríbete a la caminata solidaria de HEIM. Tu participación impulsa jornadas de esterilización para animales rescatados.",
};

export const viewport: Viewport = {
  themeColor: "#233F35",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
