import React from "react";
import UsersList from "./UsersList";
import prisma from "@/prisma/client";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{ page: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page } = await searchParams;
  const pageSize = 10;

  //GET USERS
  const users = await prisma.user.findMany({
    orderBy: {
      id: "desc",
    },
    omit: {
      password: true,
    },
    include: {
      image: true,
      _count: {
        select: {
          Post: true,
        },
      },
    },
    skip: (+page - 1) * pageSize || 0,
    take: pageSize,
  });
  const usersCount = await prisma.user.count();

  return (
    <div className="card">
      <UsersList usersCount={usersCount} users={users} />
    </div>
  );
};

export default page;

export const metadata: Metadata = {
  title: "Users",
};
