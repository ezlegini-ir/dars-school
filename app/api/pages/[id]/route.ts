import { getPageById, getPageByUrl } from "@/data/page";
import { pageFormSchema, PageFormType } from "@/lib/ValidationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const body: PageFormType = await req.json();
  const { title, content, url, description } = body;
  const { id } = await params;

  const existingPage = await getPageById(+id);
  if (!existingPage)
    return NextResponse.json({ error: "No Page found" }, { status: 400 });

  const validation = pageFormSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json({ error: "Invalid Inputs" }, { status: 400 });

  const urlEncoded = slugify(url, { lower: true, strict: true, trim: true });

  const uniquePageByUrl = await getPageByUrl(urlEncoded);

  if (uniquePageByUrl) {
    if (uniquePageByUrl.id !== existingPage?.id) {
      return NextResponse.json(
        { error: "Post with this URL already exists." },
        { status: 400 }
      );
    }
  }

  const updatedPage = await prisma.pages.update({
    where: { id: +id },
    data: {
      title,
      url,
      content,
      description,
    },
  });

  return NextResponse.json(
    { success: "Page Updated Successfully", data: updatedPage },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { id } = await params;

  const page = await getPageById(+id);
  if (!page)
    return NextResponse.json({ error: "No Page Exists" }, { status: 400 });

  await prisma.pages.delete({
    where: { id: +id },
  });

  return NextResponse.json(
    { success: "Post Deleted Successfully" },
    { status: 200 }
  );
}
