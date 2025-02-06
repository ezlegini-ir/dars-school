import prisma from "@/prisma/client";

export async function getUserById(id: number) {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    return null;
  }
}
