import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { LoginFormType } from "@/lib/ValidationSchema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password }: LoginFormType = await req.json();

  const existingUser = await getUserByEmail(email);

  if (!existingUser)
    return NextResponse.json({ error: "Email or password wrong" });

  const isValidPassword = await bcrypt.compare(password, existingUser.password);
  if (!isValidPassword)
    return NextResponse.json({ error: "Email or password wrong" });

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return NextResponse.json({
      success: "Confirmation Email Sent",
      type: "verify",
    });
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json(
      { success: "Logged In successfully", type: "login" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error || "Something went wrong" },
      { status: 500 }
    );
  }
}
