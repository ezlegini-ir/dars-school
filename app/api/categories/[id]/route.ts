import { categoryFormSchema } from "@/lib/ValidationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { id } = await params;

  const body: { name: string } = await req.json();

  // VALIDATION
  const validation = categoryFormSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json({ error: "Invalid" }, { status: 400 });

  try {
    // UPDATE CATEGORY
    await prisma.category.update({
      where: {
        id: +id,
      },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(
      { success: "Category Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { id } = await params;

  try {
    await prisma.category.delete({
      where: { id: +id },
    });

    return NextResponse.json(
      { success: "Category Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
