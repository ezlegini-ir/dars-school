import PageForm from "@/app/components/forms/PageForm";
import { getPageById } from "@/data/page";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;

  const page = await getPageById(+id);

  if (!page) return notFound();

  return (
    <div>
      <PageForm type="UPDATE" page={page} />
    </div>
  );
};

export default page;
