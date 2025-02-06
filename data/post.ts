import prisma from "@/prisma/client";

export async function getPostByUrl(url: string) {
  try {
    return await prisma.post.findUnique({ where: { url } });
  } catch (error) {
    return null;
  }
}

export async function getPostById(id: number) {
  try {
    return await prisma.post.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}
