import React from "react";
import PagesList from "./PagesList";
import prisma from "@/prisma/client";

const page = async () => {
  const pageSize = 10;

  const pages = await prisma.pages.findMany({
    orderBy: {
      id: "desc",
    },
    skip: (+page - 1) * pageSize || 0,
    take: pageSize,
  });
  const pagesCount = await prisma.pages.count();

  return (
    <div className="card">
      <PagesList pages={pages} pagesCount={pagesCount} />
    </div>
  );
};

export default page;
1;
