import { auth } from "@/auth";
import { getImageByUserId } from "@/data/image";
import { getUserById } from "@/data/user";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { updateUserFormSchema, UserFormType } from "@/lib/ValidationSchema";
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { id } = await params;

  try {
    // GET DATA
    const formData = await req.formData();
    const imageFile = formData.get("image") || undefined;
    const body = Object.fromEntries(formData.entries()) as UserFormType;
    const { name, password, role } = body;

    //USER LOOKUP
    const user = await getUserById(+id);
    if (!user)
      return NextResponse.json({ error: "No User Found" }, { status: 404 });

    // VALIDATION
    const validation = updateUserFormSchema.safeParse({
      ...body,
      image: imageFile,
    });
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid Values" }, { status: 400 });
    }

    //* UPDATE USER
    //*  HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    //*  UPDATE USER
    await prisma.user.update({
      where: { id: +id },
      data: {
        name,
        password: password ? hashedPassword : user.password,
        role,
      },
    });

    //!FORM CONTAINS IMAGE
    //* STORE IMAGE
    if (imageFile && imageFile instanceof File) {
      //*   UPDATE IMAGE DB
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      //IMAGE LOOKUP
      const existingImage = await getImageByUserId(+id);

      // UPLOAD IMAGE ON CLOUDINARY
      const { secure_url, public_id } = (await uploadImage(buffer, {
        folder: "users",
        width: 500,
        public_id: `user${id}`,
      })) as UploadApiResponse;

      if (!existingImage) {
        // CREATE NEW IMAGE (DB)
        await prisma.image.create({
          data: {
            type: "USER",
            url: secure_url,
            public_id,
            user: {
              connect: {
                id: +id,
              },
            },
          },
        });
      } else {
        // UPDATE IMAGE (DB)
        await prisma.image.update({
          where: {
            userId: +id,
          },
          data: {
            url: secure_url,
          },
        });
      }
    }

    return NextResponse.json(
      { success: "User Updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { id } = await params;

  const session = await auth();
  const role = session?.user.role;

  if (role !== "ADMIN")
    return NextResponse.json(
      { error: "You are not allowed to delete users" },
      { status: 401 }
    );

  try {
    //DELETE USER IMAGE
    const image = await getImageByUserId(+id);

    if (image) {
      await deleteImage(image.public_id);
      //* USERS PHOTO IN DB WILL BE DELETED AUTOMATICALLY BY PRISMA SCHEMA SETTINGS
    }

    // FIND POSTS
    const isAnyPostRelatedToThisUser = await prisma.post.findMany({
      where: {
        authorId: +id,
      },
    });

    if (isAnyPostRelatedToThisUser) {
      const adminUser = await prisma.user.findFirst({
        where: {
          role: "ADMIN",
        },
      });

      if (!adminUser) return;

      await prisma.post.updateMany({
        where: {
          authorId: +id,
        },
        data: {
          authorId: adminUser.id,
        },
      });
    }

    // DELETE USER
    await prisma.user.delete({
      where: {
        id: +id,
      },
    });

    return NextResponse.json(
      { success: "User Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something Wrong" + error },
      { status: 500 }
    );
  }
}
