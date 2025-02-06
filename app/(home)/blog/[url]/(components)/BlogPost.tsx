"use client";

import { placeHolder } from "@/public/images";
import { Category, Image, Post, User } from "@prisma/client";
import "froala-editor/css/froala_style.min.css";
import NextImage from "next/image";
import Link from "next/link";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import CopyLink from "../../../blog/[url]/(components)/CopyLink";
import Author from "./Author";
import { useCallback, useEffect, useState } from "react";

interface Props {
  post: {
    categories: Category[];
    image: Image | null;
    author: User;
  } & Post;
}

type toc = {
  id: string;
  text: string | null;
  level: string;
}[];

const BlogPost = ({ post }: Props) => {
  const [tocItems, setTocItems] = useState<toc>([]);

  const generateTOC = useCallback(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, "text/html");

    const headings = doc.querySelectorAll("h2, h3, h4");
    const toc = Array.from(headings).map((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      return {
        id,
        text: heading.textContent,
        level: heading.tagName,
      };
    });

    setTocItems(toc);
  }, [post.content]); // Now it only re-runs if post.content changes

  useEffect(() => {
    generateTOC(); // Generate TOC when the component is mounted
  }, [generateTOC]);

  const handleTOCClick = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="space-y-5 mb-16">
        <div className="flex flex-col items-center gap-2 mt-10">
          <div className="space-x-2">
            {post?.categories.map((category) => (
              <Link
                className="btn btn-secondary text-xs"
                key={category.id}
                href={`/?category=${category.name}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
          <h1 className="mb-0 text-center">{post.title}</h1>
          <p className="text-gray-500 text-sm">
            {post.createdAt.toLocaleDateString()}
          </p>
        </div>

        <div className="aspect-square md:aspect-video">
          <NextImage
            height={1300}
            width={1300}
            src={post.image?.url || placeHolder}
            alt="LAST_POST"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <div className="space-y-10">
          <div className="flex flex-wrap md:flex-nowrap gap-5">
            <div className="w-full md:w-3/12 md:sticky top-3 h-min">
              {/* <CardList title={"Content Table"} items={contentTable} /> */}
              <nav className="card">
                <h3 className="text-slate-500">Table of Content</h3>
                <ul>
                  {tocItems.map((item) => (
                    <li
                      key={item.id}
                      className={`hover:text-blue-800 ${
                        item.level === "H3"
                          ? "ml-2 mt-4 text-gray-500"
                          : item.level === "H4"
                          ? "ml-4 text-gray-400 text-sm"
                          : "font-bold mt-2 border-t pt-2 border-dashed"
                      }`}
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTOCClick(item.id);
                        }}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="w-full md:w-9/12">
              <div className="text-center md:text-left">
                <FroalaEditorView model={post?.content} />
              </div>
            </div>
          </div>
          <div className="border border-b-gray-300 border-dashed" />
          <div className="flex justify-between items-center">
            <CopyLink id={post.id} />
            <Author author={post.author} />
          </div>
          {/* RELATED POSTS */}
        </div>
      </div>
      <div></div>
    </>
  );
};

export default BlogPost;
