import prisma from "@/prisma/client";
import CardList from "../components/CardList";
import LastPostBanner from "./(Home_Components)/LastPostBanner";
import PostGrid from "./(Home_Components)/PostGrid";
import Link from "next/link";
import { Youtube } from "lucide-react";

interface Props {
  searchParams: Promise<{ pageSize: string; category: string }>;
}

const HomePage = async ({ searchParams }: Props) => {
  const { pageSize, category } = await searchParams;

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      categories: category
        ? {
            some: {
              name: category, // Adjust based on how categories are stored (use `id` if needed)
            },
          }
        : undefined,
    },
    include: {
      image: true,
    },
    orderBy: { id: "desc" },
    take: +pageSize || 18,
  });
  const postsCount = await prisma.post.count({ where: { published: true } });
  const categories = await prisma.category.findMany({
    where: {
      posts: {
        some: {},
      },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-center my-10 text-2xl md:text-4xl">
        Master <span className="text-blue-600">Packaging</span> and{" "}
        <span className="text-blue-600">Label</span> <br /> Design with
        educational Blog
      </h1>
      <LastPostBanner />
      <div className="flex gap-6 flex-wrap md:flex-nowrap">
        <div className="w-full md:w-1/3 lg:w-1/5 space-y-3">
          <CardList title={"Categories"} items={categories} />
          <div>
            <Link
              className="bg-red-500 hover:bg-red-600 text-white p-3 text-sm text-nowrap rounded-xl shadow-lg shadow-red-300 flex items-center justify-center gap-2"
              href={"https://youtube.com/@igraphical"}
              target="_blank"
            >
              <Youtube size={26} />
              Videos in Youtube Channel
            </Link>
          </div>
        </div>
        <div className="w-full md:w-2/3 lg:w-4/5">
          <PostGrid
            posts={posts}
            postsExist={posts.length}
            postsCount={postsCount}
          />
          <div className="text-blue-500 "></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
