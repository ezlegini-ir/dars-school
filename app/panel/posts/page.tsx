import prisma from "@/prisma/client";
import Link from "next/link";
import PostsList from "./PostsList";
import Pagination from "@/app/components/Pagination";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{ page: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page } = await searchParams;
  const pageSize = 10;

  const posts = await prisma.post.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      image: true,
      categories: true,
      author: true,
    },
    skip: (+page - 1) * pageSize || 0,
    take: pageSize,
  });

  const postsCount = await prisma.post.count();

  return (
    <div className="card space-y-3">
      <div className="flex justify-between items-center mb-5">
        <h3 className="mb-0">Posts</h3>
        <Link className="btn btn-primary" href={"/panel/posts/new"}>
          New Post
        </Link>
      </div>

      <PostsList posts={posts} postsCount={0} />
      <Pagination pageSize={pageSize} itemCount={postsCount} />
    </div>
  );
};

export default page;

export const metadata: Metadata = {
  title: "Posts",
};
