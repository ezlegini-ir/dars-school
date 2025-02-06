import prisma from "@/prisma/client";
import { placeHolder } from "@/public/images";
import Image from "next/image";
import Link from "next/link";

const LastPostBanner = async () => {
  const lastPost = await prisma.post.findFirst({
    orderBy: {
      id: "desc",
    },
    include: {
      image: true,
    },
  });

  if (!lastPost) return <p>No Posts</p>;

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="aspect-square md:aspect-video">
        <Image
          height={1300}
          width={1300}
          src={lastPost.image?.url || placeHolder}
          alt="LAST_POST"
          className="w-full h-full object-cover"
        />
      </div>

      <Link href={`/blog/${lastPost.url}`}>
        <div className="w-full h-full absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </Link>

      <div className="absolute bottom-0 left-0 p-4 md:p-10 text-white">
        <p className="text-sm uppercase tracking-wide mb-3">Latest Post</p>
        <h2 className="text-3xl font-bold">{lastPost.title}</h2>
        <p className="text-sm">
          How to create packaging in less than 5 minutes...
        </p>
      </div>
    </div>
  );
};

export default LastPostBanner;
