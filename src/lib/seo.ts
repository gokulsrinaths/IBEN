import type { Metadata } from "next";
import { organization } from "./data";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | IBEN`,
      description,
      url: path,
      type: "website",
      siteName: organization.name,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: organization.tagline,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | IBEN`,
      description,
      images: [{ url: "/opengraph-image", alt: organization.tagline }],
    },
  };
}
