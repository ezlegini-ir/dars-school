"use client";

import { Image, Post } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PostCard from "./PostCard";

interface Props {
  posts: ({
    image: Image | null;
  } & Post)[];
  postsCount: number;
  postsExist: number;
}

const PostGrid = ({ posts, postsCount, postsExist }: Props) => {
  const router = useRouter();
  const [pageSize, setPageSize] = useState(18);

  const onLoadMore = (pageSize: number) => {
    setPageSize(pageSize);
    router.push(`?pageSize=${pageSize}`, { scroll: false });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {posts?.map((post) => (
          <PostCard post={post} key={post.id} />
        ))}
      </div>
      {postsExist >= 18 && (
        <button
          disabled={postsCount === postsExist}
          onClick={() => onLoadMore(pageSize + 18)}
          className="btn btn-dark mt-10"
        >
          {postsCount === postsExist ? "No More Posts..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default PostGrid;
