import PostForm from "@/app/components/forms/PostForm";
import prisma from "@/prisma/client";
import { Metadata } from "next";
import React from "react";

const page = async () => {
  const cateogires = await prisma.category.findMany();
  const authors = await prisma.user.findMany();

  return (
    <div className="card">
      <h3>Create a new post</h3>

      <PostForm type="CREATE" categories={cateogires} authors={authors} />
    </div>
  );
};

export default page;

export const metadata: Metadata = {
  title: "Create a New Post",
};
