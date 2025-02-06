import { Metadata } from "next";
import SideBar from "./SideBar";
import PanelNavBar from "./(Panel_Components)/PanelNavBar";
import { SessionProvider } from "next-auth/react";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex md:flex-nowrap">
      <aside className="w-[12%] sm:w-1/6 bg-white border-r-[1px] md:border-r-2 border-r-slate-300 p-2 md:p-4 h-screen sticky top-0">
        <SideBar />
      </aside>
      <main className="w-[88%] sm:w-5/6 p-2 md:p-4 space-y-5">
        <SessionProvider>
          <PanelNavBar />
          {children}
        </SessionProvider>
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: {
    default: "Panel",
    template: "%s - Panel",
  },
  description: "Packaging Blog Website Panel",
};
