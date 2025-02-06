import prisma from "@/prisma/client";

export async function getVerificationTokenByToken(token: string) {
  try {
    return await prisma.verificationToken.findUnique({
      where: { token },
    });
  } catch (error) {
    return null;
  }
}

export async function getVerificationTokenByEmail(email: string) {
  try {
    return await prisma.verificationToken.findUnique({
      where: { email },
    });
  } catch (error) {
    return null;
  }
}
