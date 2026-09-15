import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import { Header } from "@/components/navigation";
import { Footer } from "@/components/ui";
import { organization } from "@/lib/data";
import "./globals.css";
const sans = Manrope({ subsets: ["latin"], variable: "--font-body" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});
export const metadata: Metadata = {
  metadataBase: new URL(organization.url),
  title: { default: organization.name, template: "%s | IBEN" },
  description: organization.description,
  openGraph: { siteName: organization.name, type: "website", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: organization.name,
              alternateName: "IBEN",
              url: organization.url,
              description: organization.description,
              ...(organization.emails.general
                ? { email: organization.emails.general }
                : {}),
            }).replace(/</g, "\u003c"),
          }}
        />
      </body>
    </html>
  );
}
