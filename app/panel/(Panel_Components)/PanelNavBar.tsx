import UserBar from "@/app/components/UserBar";
import { auth } from "@/auth";
import prisma from "@/prisma/client";

const PanelNavBar = async () => {
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

  return (
    <div className="flex justify-end sm:justify-between">
      <h3 className="font-normal hidden sm:block">
        Welcome, <span className="text-blue-800">{user?.name}</span>
      </h3>

      <UserBar user={user} />
    </div>
  );
};

export default PanelNavBar;
