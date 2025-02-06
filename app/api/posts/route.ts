import { getPostByUrl } from "@/data/post";
import { uploadImage } from "@/lib/cloudinary";
import { postFormSchema } from "@/lib/ValidationSchema";
import prisma from "@/prisma/client";
import { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

type Body = { [k: string]: string };

export async function POST(req: NextRequest) {
  // GET DATA
  const formData = await req.formData();
  const imageFile = formData.get("image") || undefined;
  const body = Object.fromEntries(formData.entries()) as Body;
  const { title, author, categories, content, status, url } = body;
  const parsedCategories: string[] = JSON.parse(categories);
  const categoryConnections = parsedCategories.map((id: string) => ({
    id: +id,
  }));

  try {
    // VALIDATION
    const validation = postFormSchema.safeParse({
      ...body,
      categories: parsedCategories,
      image: imageFile,
    });
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid Values" }, { status: 400 });
    }

    const urlEncoded = slugify(url, { lower: true, strict: true, trim: true });

    const existingPost = await getPostByUrl(urlEncoded);
    if (existingPost)
      return NextResponse.json(
        { error: "Post with this URL already exists." },
        { status: 400 }
      );

    //* CREATE NEW PSOT
    const newPost = await prisma.post.create({
      data: {
        title,
        url: urlEncoded,
        content,
        authorId: +author,
        published: +status === 1 ? true : false,
        categories: { connect: categoryConnections },
      },
    });

    //! CONTAINS IMAGE
    //*  STORE IMAGE
    if (imageFile && imageFile instanceof File) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const { secure_url, public_id } = (await uploadImage(buffer, {
        folder: "posts",
        width: 1500,
        public_id: `post${newPost.id}`,
      })) as UploadApiResponse;

      // CREATE IMAGE
      await prisma.image.create({
        data: {
          type: "POST",
          url: secure_url,
          public_id,
          post: {
            connect: {
              id: newPost.id,
            },
          },
        },
      });
    }

    return NextResponse.json(
      { success: "Post Created Successfully", data: newPost },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
