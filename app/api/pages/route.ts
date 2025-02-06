import { getPageByUrl } from "@/data/page";
import { pageFormSchema, PageFormType } from "@/lib/ValidationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  const body: PageFormType = await req.json();
  const { content, title, url, description } = body;

  const validation = pageFormSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json({ error: "Invalid Inputs" }, { status: 400 });

  const urlEncoded = slugify(url, { lower: true, strict: true, trim: true });

  const existingPage = await getPageByUrl(urlEncoded);

  if (existingPage)
    return NextResponse.json(
      { error: "this URL already exists" },
      { status: 400 }
    );

  const newPage = await prisma.pages.create({
    data: {
      content,
      title,
      url: urlEncoded,
      description,
    },
  });

  return NextResponse.json(
    { success: "Post Created Successfully", data: newPage },
    { status: 201 }
  );
}
