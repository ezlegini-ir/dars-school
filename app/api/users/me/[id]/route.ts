import { getUserById } from "@/data/user";
import {
  updateProfileFormSchema,
  UpdateProfileFormType,
} from "@/lib/ValidationSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/prisma/client";
import { getImageByUserId } from "@/data/image";
import { uploadImage } from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { auth } from "@/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const session = await auth();
  const sessionId = session?.user.id;

  if (sessionId)
    if (+id !== +sessionId)
      return NextResponse.json(
        { error: "You think we are fool?" },
        { status: 401 }
      );

  try {
    // GET DATA
    const formData = await req.formData();
    const imageFile = formData.get("image") || undefined;
    const body = Object.fromEntries(
      formData.entries()
    ) as UpdateProfileFormType;
    const { name, newPassword, oldPassword } = body;

    //USER LOOKUP
    const existingUser = await getUserById(+id);
    if (!existingUser)
      return NextResponse.json({ error: "No User Found" }, { status: 404 });

    // VALIDATION
    const validation = updateProfileFormSchema.safeParse({
      ...body,
      image: imageFile,
    });
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid Values" }, { status: 400 });
    }

    //* UPDATE USER
    //* PASSWORD VALIDITY
    let hashedPassword;
    if (oldPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(
        oldPassword,
        existingUser.password
      );

      if (!isValidPassword)
        return NextResponse.json(
          { error: "Old Password is not correct" },
          { status: 400 }
        );

      //*  HASH PASSWORD
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    //*  UPDATE USER
    await prisma.user.update({
      where: { id: +id },
      data: {
        name,
        password: newPassword ? hashedPassword : existingUser.password,
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
      { success: "User Updated Successully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error || "Something Happended" },
      { status: 500 }
    );
  }
}
