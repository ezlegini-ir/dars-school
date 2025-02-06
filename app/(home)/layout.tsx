import Image from "next/image";
import Footer from "./(Home_Components)/Footer";
import NavBar from "./(Home_Components)/NavBar";

import { bgPattern } from "@/public/images";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-screen-xl mx-auto p-3 grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-screen`}
    >
      <NavBar />
      <main className="relative">
        <Image
          width={450}
          height={450}
          src={bgPattern}
          alt=""
          className="absolute -top-40 md:left-52 select-none pointer-events-none -z-10"
        />
        {children}
      </main>
      <Footer />
    </div>
  );
}
