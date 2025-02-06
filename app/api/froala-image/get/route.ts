import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allImages = await prisma.image.findMany({
      orderBy: { id: "desc" },
      where: {
        type: {
          in: ["CONTENT", "POST"],
        },
      },
    });

    if (!allImages || allImages.length === 0) {
      return NextResponse.json({ error: "No Images Found" }, { status: 404 });
    }

    const images = allImages.map((img) => ({
      url: img.url,
    }));

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
