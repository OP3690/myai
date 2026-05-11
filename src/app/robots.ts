import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://fixaiprompt.com/sitemap.xml",
    host: "https://fixaiprompt.com",
  };
}
