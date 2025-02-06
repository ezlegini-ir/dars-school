import PostGrid from "@/app/(home)/(Home_Components)/PostGrid";
import prisma from "@/prisma/client";
import Link from "next/link";
import AuthorsChart from "./(carts)/AuthorsChart";
import CategoriesChart from "./(carts)/CategoriesChart";
import ViewsChart from "./(carts)/ViewsChart";

const Dashboard = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  const authors = await prisma.user.findMany({
    omit: {
      password: true,
    },
    include: {
      _count: {
        select: {
          Post: true,
        },
      },
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      id: "desc",
    },
    include: {
      image: true,
    },
  });
  const postsCount = await prisma.post.count();

  return (
    <div className="space-y-5">
      <div className="flex gap-3 flex-wrap md:flex-nowrap">
        <div className="w-full md:w-2/5  min-h-[350px]">
          <CategoriesChart data={categories} />
        </div>
        <div className="w-full md:w-2/5  min-h-[350px]">
          <AuthorsChart authors={authors} />
        </div>
        <div className="w-full md:w-3/5  min-h-[350px]">
          <ViewsChart />
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-5">
          <h2 className="mb-0">Latest Posts</h2>
          <Link className="btn btn-primary" href={"/panel/posts/new"}>
            New Post
          </Link>
        </div>
        <div>
          <PostGrid
            posts={posts}
            postsCount={postsCount}
            postsExist={posts.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
