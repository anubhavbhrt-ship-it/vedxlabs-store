import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/products", "/orders"],
        disallow: ["/admin/", "/api/", "/checkout/", "/pay/", "/success"],
      },
    ],
    sitemap: "https://vedxlabs.dev/sitemap.xml",
  };
}
