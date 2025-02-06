"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const CardList = ({ title, items }: { title: string; items: any[] }) => {
  const searchParams = useSearchParams();
  const cateogryQuery = searchParams.get("category");

  return (
    <div className="card">
      <h4>{title}</h4>
      <ul className="space-y-2 md:space-y-4 pl-3 capitalize columns-2 md:columns-1 ">
        <li className="text-gray-500 hover:text-blue-800">
          <Link href={`/`} scroll={false}>
            All Posts
          </Link>
        </li>
        {items?.map((item) => (
          <li className={`text-gray-500 hover:text-blue-800 `} key={item.id}>
            <Link
              href={`?category=${item.name}`}
              className={`${
                cateogryQuery === item.name && "text-blue-800 font-bold"
              }`}
              scroll={false}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardList;
