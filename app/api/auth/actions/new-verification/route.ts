import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // GET TOKEN
    const body = await req.json();

    if (!body.token)
      return NextResponse.json({ error: "Missing Token" }, { status: 400 });

    // LOOK UP TOKEN
    const existingToken = await getVerificationTokenByToken(body.token);
    if (!existingToken)
      return NextResponse.json({ error: "Token Invalid" }, { status: 404 });

    // CHECK EXPIRATION
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired)
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });

    // FIND USER
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser)
      return NextResponse.json({ error: "User not found" }, { status: 400 });

    // CONFIRM USER
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date() },
    });

    // DELETE TOKEN FROM DB
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return NextResponse.json(
      { success: "Email Verified Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
