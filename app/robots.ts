import { MetadataRoute } from "next";

const baseUrl = process.env.NEXTAUTH_URL ?? "https://chipin-bice.vercel.app/";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/a-propos"],
        disallow: ["/dashboard", "/admin", "/api", "/login", "/cagnotte"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
