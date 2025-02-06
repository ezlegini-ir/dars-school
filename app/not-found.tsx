import React from "react";
import NavBar from "./(home)/(Home_Components)/NavBar";
import Image from "next/image";
import { notFound } from "@/public/images";
import Footer from "./(home)/(Home_Components)/Footer";
import BackButton from "./components/BackButton";
import { Metadata } from "next";
import Link from "next/link";

const notFount = () => {
  return (
    <div className="max-w-screen-xl mx-auto py-3 h-screen grid grid-rows-[auto_1fr_auto]">
      <NavBar />
      <div className="flex flex-col items-center justify-center select-none">
        <Image
          src={notFound}
          alt="not-found"
          width={1000}
          height={1000}
          draggable={false}
        />
        <div className="flex gap-3">
          <Link href={"/"} className="btn btn-primary py-3">
            Home
          </Link>
          <BackButton />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default notFount;

export const metadata: Metadata = {
  title: "404 Not Found ☹️",
};
