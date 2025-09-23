import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { Menu } from "lucide-react";
import MainMenu from "@/components/MainMenu";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { Home, Trash } from "lucide-react";

export default function Index() {
  const [open, setOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative grid grid-cols-1 text-gray-700 dark:text-gray-200 sm:grid-cols-[auto_minmax(0,1fr)]">
      <MainMenu />
      <main className="max-w-[100vw] flex-1">
        <Header />
        <div className="mx-auto flex max-w-screen-2xl flex-col">
          <div className="mt-8 w-full px-5 lg:mt-12">
            <div className="flex w-full items-center justify-between">
              <h1 className="text-blue">Hello</h1>
              <a href="" className="btn items-center transition-colors duration-[300ms] no-underline inline-flex py-[10px] sprinkles-text-base font-semibold rounded-[6px] whitespace-nowrap bg-blue text-white hover:bg-blue-700 h-11 px-4 leading-tight xl:h-12">
                Home
              </a>
              <Button className="bg-gray-400/10 hover:bg-blue-400/10 text-shadow-gray-200 hover:text-blue-500 hover:inset-ring hover:inset-ring-blue-500/30">
                <Home size={16} strokeWidth={2} />
                <span className="text-sm">Home</span>
              </Button>
              <Button className="bg-gray-400/10 hover:bg-red-400/10 text-shadow-gray-200 hover:text-red-500 hover:inset-ring hover:inset-ring-red-500/30">
                <Trash size={16} strokeWidth={2} />
                <span className="text-sm">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
