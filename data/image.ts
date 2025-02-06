import prisma from "@/prisma/client";

export async function getImageById(id: number) {
  try {
    return await prisma.image.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}

export async function getImageByUserId(userId: number) {
  try {
    return await prisma.image.findUnique({ where: { userId } });
  } catch (error) {
    return null;
  }
}

export async function getImageByPostId(postId: number) {
  try {
    return await prisma.image.findUnique({ where: { postId } });
  } catch (error) {
    return null;
  }
}
