import { categoryFormSchema } from "@/lib/ValidationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: { name: string } = await req.json();

  // VALIDATION
  const validation = categoryFormSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json({ error: "Invalid" }, { status: 400 });

  try {
    const newCategory = await prisma.category.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(
      { success: "Category Created Successfully", data: newCategory },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
