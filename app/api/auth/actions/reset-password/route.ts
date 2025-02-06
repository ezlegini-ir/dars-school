import { getUserByEmail } from "@/data/user";
import { sendResetPasswordEmail } from "@/lib/mail";
import { generateResetPasswordToken } from "@/lib/tokens";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email }: { email: string } = await req.json();

  try {
    // USER LOOK UP
    const user = await getUserByEmail(email);
    if (!user)
      return NextResponse.json(
        { error: "There is no user with specified email" },
        { status: 400 }
      );

    const resetPasswordToken = await generateResetPasswordToken(user.email);

    await sendResetPasswordEmail(user.email, resetPasswordToken.token);

    return NextResponse.json(
      { success: `Reset email sent to ${email}` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
