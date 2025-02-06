import prisma from "@/prisma/client";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPost from "./(components)/BlogPost";
import { convert } from "html-to-text";
import { cache } from "react";

interface Props {
  params: Promise<{ url: string }>;
}

const getPost = cache(async (postUrl: string) => {
  const post = await prisma.post.findUnique({
    where: {
      url: postUrl,
    },
    include: {
      categories: true,
      image: true,
      author: {
        include: {
          image: true,
        },
      },
    },
  });
  return post;
});

const BlogPage = async ({ params }: Props) => {
  const { url } = await params;

  const post = await getPost(url);

  if (!post) notFound();

  return (
    <div>
      <BlogPost post={post} />
    </div>
  );
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { url } = await params;

  const post = await getPost(url);

  if (!post) {
    return {
      title: "Not Found",
    };
  }

  const plainContent = convert(post.content);

  return {
    title: post.title,
    description: plainContent.slice(0, 200),
    openGraph: {
      url: post.image?.url,
    },
  };
}

export default BlogPage;
