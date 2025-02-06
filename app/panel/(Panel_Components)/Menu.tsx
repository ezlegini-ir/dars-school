"use client";

import {
  LayoutDashboard,
  Newspaper,
  Logs,
  Users,
  PanelTop,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { JSX } from "react";

const Menu = () => {
  const pathName = usePathname();

  return (
    <ul className="space-y-2 w-full">
      {menuItems.map((item) => (
        <li key={item.label}>
          <Link href={item.path}>
            <p
              className={`p-3 flex justify-center items-center md:justify-start gap-3 rounded-lg capitalize ${
                pathName === item.path
                  ? "text-blue-800 hover:text-blue-800 sm:bg-blue-50 sm:hover:bg-blue-50 cursor-auto font-semibold"
                  : "text-gray-500 hover:bg-slate-100 hover:text-black"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="hidden md:block">{item.label}</span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Menu;

const menuItems: { label: string; icon: JSX.Element | string; path: string }[] =
  [
    { label: "dashboard", icon: <LayoutDashboard />, path: "/panel" },
    { label: "pages", icon: <PanelTop />, path: "/panel/pages" },
    { label: "posts", icon: <Newspaper />, path: "/panel/posts" },
    {
      label: "categories",
      icon: <Logs />,
      path: "/panel/categories",
    },
    { label: "users", icon: <Users />, path: "/panel/users" },
  ];
