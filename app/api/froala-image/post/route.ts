import { uploadImage } from "@/lib/cloudinary";
import prisma from "@/prisma/client";
import { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop(); // Extract extension
    const cleanName = slugify(file.name.replace(`.${fileExt}`, ""), {
      lower: true, // Convert to lowercase
    });
    const buffer = Buffer.from(await file.arrayBuffer());

    // Write the file
    const { secure_url, public_id } = (await uploadImage(buffer, {
      folder: "posts/post-content",
      width: 1500,
      public_id: `${cleanName}-${Date.now()}`,
    })) as UploadApiResponse;

    await prisma.image.create({
      data: {
        type: "CONTENT",
        url: secure_url,
        public_id,
      },
    });

    return NextResponse.json({ link: secure_url }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
