import prisma from "@/prisma/client";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany();
  const pages = await prisma.pages.findMany();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/${post.url}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
  }));

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/${page.url}`,
    changeFrequency: "yearly",
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/about`,
    },
    ...postEntries,
    ...pageEntries,
  ];
}
