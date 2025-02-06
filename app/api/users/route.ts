import { getUserByEmail } from "@/data/user";
import { uploadImage } from "@/lib/cloudinary";
import { UserFormType, updateUserFormSchema } from "@/lib/ValidationSchema";
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  //TODO: ROLE BASED CREATE USER

  // GET DATA
  const formData = await req.formData();
  const imageFile = formData.get("image") || undefined;
  const body = Object.fromEntries(formData.entries()) as UserFormType;
  const { email, name, password, role } = body;

  try {
    // VALIDATION
    const validation = updateUserFormSchema.safeParse({
      ...body,
      image: imageFile,
    });
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid Values" }, { status: 400 });
    }

    // USER LOOK UP
    const existingUser = await getUserByEmail(email);
    if (existingUser)
      return NextResponse.json(
        { error: "User with specified Email exists." },
        { status: 400 }
      );

    //* CREATE NEW USER
    //*  HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    //*  CREATE USER
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
    });

    //! FORM CONTAINS IMAGE
    //*  STORE IMAGE
    if (imageFile && imageFile instanceof File) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const { secure_url, public_id } = (await uploadImage(buffer, {
        folder: "users",
        width: 500,
        public_id: `user${newUser.id}`,
      })) as UploadApiResponse;

      // CREATE IMAGE
      await prisma.image.create({
        data: {
          type: "USER",
          url: secure_url,
          public_id,
          user: {
            connect: {
              id: newUser.id,
            },
          },
        },
      });
    }

    return NextResponse.json(
      { success: "User Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
