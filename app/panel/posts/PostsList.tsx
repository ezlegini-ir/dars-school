import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import { placeHolder } from "@/public/images";
import { Category, Image, Post, User } from "@prisma/client";
import { Pencil } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";

type PostItem = {
  id: number;
  image?: { url: string };
  author: { name: string };
  categories: { name: string }[];
  title: string;
  published: boolean;
  url: string;
};

interface Props {
  posts: ({
    author: User;
    image: Image | null;
    categories: Category[];
  } & Post)[];
  postsCount: number;
}

const PostsList = ({ posts, postsCount }: Props) => {
  return (
    <div className="space-y-5">
      <Table columns={columns} data={posts} renderRows={renderRows} />
      <Pagination pageSize={10} itemCount={postsCount} />
    </div>
  );
};

const renderRows = (post: PostItem) => {
  const categoryCell = post.categories.map((category) => category.name);
  return (
    <tr
      key={post.id}
      className="border-b border-gray-200 even:bg-slate-50  text-sm hover:bg-blue-50"
    >
      <td className="flex gap-2 items-center p-3">
        <NextImage
          width={75}
          height={75}
          src={post.image?.url || placeHolder}
          alt=""
          className="rounded-lg aspect-video object-cover"
        />
        <p className="text-sm font-semibold md:text-base hover:text-blue-800">
          <Link href={`/blog/${post.url}`}>
            {post.title.length > 50 ? (
              <span>{post.title.slice(0, 50)}...</span>
            ) : (
              <span>{post.title}</span>
            )}
          </Link>
        </p>
      </td>

      <td className="hidden lg:table-cell">
        {post.published ? (
          <p className="badge badge-success w-1/2">Publiahed</p>
        ) : (
          <p className="badge badge-secondary w-1/2">Draft</p>
        )}
      </td>

      <td className="text-gray-500 hidden lg:table-cell text-sm">
        {post.author.name}
      </td>

      <td className="text-gray-500 hidden md:table-cell text-sm">
        {categoryCell.length < 3 ? (
          categoryCell.join(", ")
        ) : (
          <span>
            {categoryCell.slice(0, 2).join(", ")} + {categoryCell.length - 2}...
          </span>
        )}
      </td>

      <td className="flex gap-2 justify-end pr-2">
        <Link href={`/panel/posts/edit/${post.id}`}>
          <div className="h-8 w-8 btn-icon relative">
            <Pencil
              size={18}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />{" "}
          </div>
        </Link>
      </td>
    </tr>
  );
};

const columns = [
  { key: "post", label: "Post", className: "w-5/6" },
  {
    key: "published",
    label: "Published",
    className: "hidden lg:table-cell w-2/6",
  },
  {
    key: "author",
    label: "Author",
    className: "hidden lg:table-cell w-2/6",
  },
  {
    key: "category",
    label: "Category",
    className: "hidden md:table-cell w-1/6",
  },
  { key: "actions", label: "Actions", className: "w-1/6 text-right" },
];

export default PostsList;
