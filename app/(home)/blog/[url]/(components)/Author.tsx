import { noAvatar } from "@/public/images";
import { User } from "@prisma/client";
import Image from "next/image";

interface Props {
  author: User & {
    image?: {
      url: string;
    };
  };
}

const Author = ({ author }: Props) => {
  return (
    <p className="flex gap-3 items-center text-gray-500">
      Author:{" "}
      <Image
        width={40}
        height={40}
        src={author.image?.url || noAvatar}
        alt="author"
        className="rounded-full"
      />
      {author.name}
    </p>
  );
};

export default Author;
