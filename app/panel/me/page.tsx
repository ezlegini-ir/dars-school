import ProfileForm from "@/app/components/forms/ProfileForm";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Metadata } from "next";
import React from "react";

const page = async () => {
  const session = await auth();

  if (!session?.user.id) return <p className="card">User Not Found</p>;

  const user = await prisma.user.findUnique({
    where: {
      id: +session.user.id,
    },
    include: {
      image: true,
    },
    omit: {
      password: true,
    },
  });

  if (!user) return <p className="card">User Not Found</p>;

  return (
    <div className="card max-w-sm mx-auto">
      <ProfileForm user={user} />
    </div>
  );
};

export default page;

export const metadata: Metadata = {
  title: "Profile",
};
