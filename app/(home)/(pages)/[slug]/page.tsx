import { notFound } from "next/navigation";
import prisma from "@/prisma/client";
import { Metadata } from "next";
import { getPageByUrl } from "@/data/page";
import { convert } from "html-to-text";

export async function generateStaticParams() {
  const pages = await prisma.pages.findMany({
    select: { url: true }, // Fetch only URLs
  });

  return pages.map((page) => ({ slug: page.url }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await getPageByUrl(slug);

  if (!page) return notFound(); // Show 404 if the page does not exist

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="text-3xl font-bold mb-10 text-center">
        <h1 className="text-blue-600 mb-1">{page.title}</h1>
        <p>{page.description}</p>
      </div>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </main>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const page = await getPageByUrl(slug);

  if (!page) return notFound();

  const plainContent = convert(page?.content);

  return {
    title: page?.title,
    description: plainContent.slice(0, 200),
  };
}
