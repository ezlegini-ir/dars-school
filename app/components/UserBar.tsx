"use client";
import { noAvatar } from "@/public/images";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Plus,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  user:
    | ({
        image: {
          url: string;
        } | null;
      } & {
        name: string;
        role: string;
      })
    | null;
}

interface UserBar {
  setOpen: (value: boolean) => void;
  open: boolean;
  user?:
    | ({
        image: {
          url: string;
        } | null;
      } & {
        name: string;
        role: string;
      })
    | null;
}

const UserBar = ({ user }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative space-y-1.5">
      <UserBarButton open={open} user={user} setOpen={setOpen} />

      {open && <UserBarMenu open={open} setOpen={setOpen} />}
    </div>
  );
};

const UserBarButton = ({ user, open, setOpen }: UserBar) => {
  return (
    <div className="select-none">
      <div
        onClick={() => setOpen(!open)}
        className="flex text-slate-500 items-center gap-3 bg-slate-200 hover:bg-slate-300 py-1.5 px-4 rounded-lg cursor-pointer"
      >
        <ChevronDown size={20} />
        <div className="hidden sm:block">
          <p>{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.role}</p>
        </div>

        <Image
          className="rounded-full h-9 w-9 object-cover"
          width={40}
          height={40}
          src={user?.image?.url || noAvatar}
          alt="user"
        />
      </div>
    </div>
  );
};

const UserBarMenu = ({ setOpen, open }: UserBar) => {
  const router = useRouter();

  const menuClassName =
    "block px-4 py-2 w-full text-left hover:bg-gray-100 text-gray-500 hover:text-black";

  return (
    <div
      id="dropdown"
      className="z-10 w-full min-w-44 absolute top-12 right-0 bg-white divide-y divide-gray-100 rounded-lg card px-0 py-2"
    >
      <ul className="splace-y-5" aria-labelledby="dropdownDefaultButton">
        {menuItems.map((item) => (
          <li key={item.href}>
            <button
              onClick={() => {
                router.push(item.href);
                setOpen(!open);
              }}
              className={menuClassName}
            >
              <div className="flex gap-3 items-center">
                {item.icon}
                <span className="capitalize">{item.label}</span>
              </div>
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={async () => {
              await signOut();
            }}
            className={menuClassName}
          >
            <div className="flex gap-3 items-center hover:text-red-400">
              <LogOut size={18} />
              <span>Log Out</span>
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
};

const menuItems = [
  {
    label: "dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/panel",
  },
  { label: "new post", icon: <Plus size={18} />, href: "/panel/posts/new" },
  { label: "posts", icon: <Newspaper size={18} />, href: "/panel/posts" },
];

export default UserBar;
