import UserBar from "@/app/components/UserBar";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { DarsLogo } from "@/public/images";
// import { DarsLogo } from "@/public/images";
import Image from "next/image";
import Link from "next/link";

const NavBar = async () => {
  const session = await auth();
  const id = session?.user.id;
  let user = null;

  if (id) {
    user = await prisma.user.findUnique({
      where: {
        id: +id,
      },
      include: {
        image: true,
      },
      omit: {
        password: true,
      },
    });
  }

  const isLoggedIn = !!session?.user;

  return (
    <nav className="flex justify-between items-center mb-3">
      <Link href={"/"}>
        <Image
          src={DarsLogo}
          width={100}
          height={100}
          alt=""
          draggable={false}
        />
      </Link>

      {isLoggedIn ? (
        <UserBar user={user} />
      ) : (
        <Link className="btn btn-primary px-10" href={"/panel"}>
          Panel
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
