"use client";
import { placeHolder } from "@/public/images";
import { Image, Post } from "@prisma/client";
import NextImage from "next/image";
import Link from "next/link";
import { convert } from "html-to-text";

interface Props {
  post: {
    image: Image | null;
  } & Post;
}

const PostCard = ({ post }: Props) => {
  const plainContent = convert(post.content);

  return (
    <Link href={`/blog/${post.url}`}>
      <div className="space-y-2 hover:text-blue-800">
        <div className="aspect-video">
          <NextImage
            width={280}
            height={280}
            src={post.image?.url || placeHolder}
            alt="post"
            className="rounded-xl object-cover w-full h-full"
          />
        </div>
        <h5 className="font-bold">{post.title}</h5>
        <p className="text-gray-400 text-xs text-wrap">
          {plainContent.slice(0, 90)}...
        </p>
      </div>
    </Link>
  );
};

export default PostCard;
