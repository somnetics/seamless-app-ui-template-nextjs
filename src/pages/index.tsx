import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
import { Inter } from "next/font/google";
import { Sun, Moon, Home, Search, Menu } from "lucide-react";

const bokor = Inter({
  subsets: ["latin"]
});

export default function Index() {
  const [open, setOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`${bokor.className} min-h-screen text-black text-sm bg-gray-100`}>
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        Home

        <button
          className="cursor-pointer flex items-center justify-center rounded-full bg-white hover:bg-gray-100 border-gray-200 h-10 w-10" >
          <Menu size={22} className="text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </button>
      </div>

      <div className={"bg-gray-700 fixed top-0 h-full w-[300px] duration-300 " + (isMenuOpen ? "left-0" : "-left-[300px]")}>
        menu
        <button className="cursor-pointer bg-amber-600" onClick={() => setIsMenuOpen(false)}>Close</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 p-4">
        <div className="sm:col-span-3 border bg-white border-gray-200 rounded-lg p-4">

        </div>
        <div className="border- bg-white border-gray-200 rounded-lg p-4 shadow-2xs">

        </div>
      </div>
    </div>
  );
}
