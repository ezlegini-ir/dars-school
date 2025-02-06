import prisma from "@/prisma/client";

export async function getPageByUrl(url: string) {
  try {
    return await prisma.pages.findUnique({ where: { url } });
  } catch (error) {
    return null;
  }
}

export async function getPageById(id: number) {
  try {
    return await prisma.pages.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}
