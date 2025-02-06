import prisma from "@/prisma/client";

export async function getResetPasswordTokenByToken(token: string) {
  try {
    return await prisma.resetPasswordToken.findUnique({
      where: { token },
    });
  } catch (error) {
    return null;
  }
}

export async function getResetPasswordTokenByEmail(email: string) {
  try {
    return await prisma.resetPasswordToken.findUnique({
      where: { email },
    });
  } catch (error) {
    return null;
  }
}
