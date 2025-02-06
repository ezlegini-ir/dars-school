import { getResetPasswordTokenByEmail } from "@/data/reset-password-token";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import prisma from "@/prisma/client";
import { v4 as uuid } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { email },
    });
  }

  return await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};

export const generateResetPasswordToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getResetPasswordTokenByEmail(email);

  if (existingToken) {
    await prisma.resetPasswordToken.delete({
      where: { email },
    });
  }

  return await prisma.resetPasswordToken.create({
    data: {
      email,
      expires,
      token,
    },
  });
};
