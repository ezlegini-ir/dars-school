import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { deleteImage } from "@/lib/cloudinary";
import { extractPublicId } from "cloudinary-build-url";

export async function DELETE(req: NextRequest) {
  try {
    // Parse formData from the request
    const formData = await req.formData();

    const imageSrc = formData.get("src")?.toString();

    if (!imageSrc) {
      return NextResponse.json(
        { error: "No Source Provided" },
        { status: 400 }
      );
    }

    const public_id = extractPublicId(imageSrc);

    await deleteImage(public_id);

    // DELETE FROM DB
    await prisma.image.delete({
      where: {
        url: imageSrc,
      },
    });

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}
