import { getResetPasswordTokenByToken } from "@/data/reset-password-token";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import prisma from "@/prisma/client";

export async function POST(req: NextRequest) {
  const {
    data: { password },
    token,
  }: { data: { password: string }; token: string } = await req.json();

  if (!password || !token)
    return NextResponse.json(
      { error: "Invalid Credentiqals" },
      { status: 400 }
    );

  const existingToken = await getResetPasswordTokenByToken(token);

  if (!existingToken)
    return NextResponse.json({ error: "Invalid Token" }, { status: 400 });

  // LOOK UP USER
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser)
    return NextResponse.json({ error: "No User Found" }, { status: 404 });

  // UPDATE PASSWORD
  // HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      email: existingUser.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.resetPasswordToken.delete({
    where: {
      email: existingUser.email,
    },
  });

  return NextResponse.json(
    { success: "Password Updated Successfully" },
    { status: 200 }
  );
}
