import Link from "next/link";
import Menu from "./(Panel_Components)/Menu";
import Image from "next/image";
import { DarsLogo, DarsLogoIcon } from "@/public/images";
import { User } from "lucide-react";

const SideBar = () => {
  return (
    <div className="flex flex-col h-full gap-10 justify-between overflow-hidden">
      <div className="flex gap-10 flex-col items-center md:items-start">
        <Link href={"/"}>
          <Image
            src={DarsLogo}
            width={100}
            height={100}
            alt=""
            className="hidden md:block"
          />
          <Image
            src={DarsLogoIcon}
            width={20}
            height={20}
            alt=""
            className="block md:hidden mt-3"
          />
        </Link>
        <Menu />
      </div>

      <div className="flex flex-col gap-3 text-gray-500 mb-3">
        <Link
          className="flex gap-3 hover:text-blue-800 justify-center items-center md:justify-start"
          href={"/panel/me"}
        >
          <User />
          <span className="hidden md:block">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
