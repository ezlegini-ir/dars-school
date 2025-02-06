import prisma from "@/prisma/client";
import CategoriesList from "./CategoriesList";
import { Metadata } from "next";

const page = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });
  const categoriesCount = await prisma.category.count();

  return (
    <div className="card">
      <CategoriesList
        categories={categories}
        categoriesCount={categoriesCount}
      />
    </div>
  );
};

export default page;

export const metadata: Metadata = {
  title: "Categories",
};
