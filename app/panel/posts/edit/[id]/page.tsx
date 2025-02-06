import BackButton from "@/app/components/BackButton";
import PostForm from "@/app/components/forms/PostForm";
import prisma from "@/prisma/client";
import { Metadata } from "next";
import Link from "next/link";
import React, { cache } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

const getPost = cache(async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: +postId,
    },
    include: {
      image: true,
      categories: true,
    },
  });
  return post;
});

const page = async ({ params }: Props) => {
  const { id } = await params;

  const cateogires = await prisma.category.findMany();
  const authors = await prisma.user.findMany();
  const post = await getPost(id);
  const author = await prisma.user.findUnique({
    where: { id: post?.authorId },
  });

  if (!post)
    return (
      <p className="alert alert-danger flex flex-col w-[250px] mx-auto items-center gap-3">
        Post Not Found, try again.{" "}
        <Link className="btn btn-secondary text-black" href={"/panel/posts"}>
          Back
        </Link>
      </p>
    );

  return (
    <div className="space-y-3 card">
      <div className="text-nowrap flex justify-between items-center">
        <div className="max-w-32 hidden sm:block">
          <BackButton />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-5 text-xs text-slate-400">
          <p className="flex flex-col">
            Created At: <span>{post.createdAt.toLocaleString()}</span>
          </p>
          <p className="flex flex-col">
            Last Update: <span>{post.updatedAt.toLocaleString()}</span>
          </p>
          <p className="flex flex-col">
            By: <span>{author?.name}</span>
          </p>
        </div>
      </div>

      <PostForm
        id={+id}
        type="UPDATE"
        post={post}
        categories={cateogires}
        authors={authors}
      />
    </div>
  );
};

export default page;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const post = await getPost(id);
  return {
    title: "EDIT: " + post?.title,
  };
}
