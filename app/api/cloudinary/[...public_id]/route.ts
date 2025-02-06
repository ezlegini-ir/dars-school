import { deleteImage } from "@/lib/cloudinary";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ public_id: string[] }>;
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { public_id } = await params;

  try {
    const deletedImage = await prisma.image.delete({
      where: { public_id: public_id.join("/") },
    });

    const deleteResponse = (await deleteImage(deletedImage.public_id)) as {
      result: string;
    };

    if (deleteResponse.result !== "ok")
      return NextResponse.json({
        error: "Couldn not remove image",
        detail: deleteResponse,
      });

    return NextResponse.json({ success: "Image Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something happended." + error },
      { status: 500 }
    );
  }
}
