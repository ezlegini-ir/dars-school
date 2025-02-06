import { getImageByPostId } from "@/data/image";
import { getPostById, getPostByUrl } from "@/data/post";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { postFormSchema } from "@/lib/ValidationSchema";
import prisma from "@/prisma/client";
import { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

type Body = { [k: string]: string };

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { id } = await params;

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

    const existingPost = await getPostById(+id);
    if (!existingPost)
      return NextResponse.json(
        { error: "Post doesn't exist." },
        { status: 404 }
      );

    const urlEncoded = slugify(url, { lower: true, strict: true, trim: true });
    const uniquePostByUrl = await getPostByUrl(urlEncoded);
    if (uniquePostByUrl) {
      if (uniquePostByUrl.id !== existingPost.id) {
        return NextResponse.json(
          { error: "Post with this URL already exists." },
          { status: 400 }
        );
      }
    }

    //* UPDATE PSOT
    await prisma.post.update({
      where: { id: +id },
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
    //* STORE IMAGE
    if (imageFile && imageFile instanceof File) {
      //*   UPDATE IMAGE DB
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      //IMAGE LOOKUP
      const existingImage = await getImageByPostId(+id);

      const { secure_url, public_id } = (await uploadImage(buffer, {
        folder: "posts",
        width: 1500,
        public_id: `post${id}`,
      })) as UploadApiResponse;

      if (!existingImage) {
        // CREATE NEW IMAGE (DB)
        await prisma.image.create({
          data: {
            type: "POST",
            url: secure_url,
            public_id,
            post: {
              connect: {
                id: +id,
              },
            },
          },
        });
      } else {
        //UPDATE IMAGE (DB)
        await prisma.image.update({
          where: {
            postId: +id,
          },
          data: {
            url: secure_url,
          },
        });
      }
    }

    return NextResponse.json(
      { success: "Post Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { id } = await params;
  try {
    // DELETE POST
    const deletedPost = await prisma.post.delete({
      where: { id: +id },
      include: {
        image: true,
      },
    });

    if (deletedPost.image) {
      await deleteImage(deletedPost.image.public_id);
    }

    return NextResponse.json(
      { success: "Post Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
