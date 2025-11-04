import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import MainMenu from "@/components/MainMenu";
import Header from "@/components/Header";
import Page from "@/components/Page";
import Button from "@/components/Button";
import Form from "@/components/Form";
import { Home, Trash } from "lucide-react";

import Form1 from "@/mdx/form.mdx";

export default function Documentation({ session }: { session: SessionData }) {
  // const [open, setOpen] = useState(true);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Page session={session} title="Seamless Developer Console" breadcrumbs={[{ link: "/", name: "Home" }]}>
        <div className="mx-auto flex max-w-screen-2xl flex-col">
          {/* <div className="mt-8 w-full px-5 lg:mt-12">
            <div className="flex w-full items-center justify-between">
              <div className="bg-blue-500 flex-one h-[100px] w-[100px]">Hello</div>
              <div className="bg-blue-600 flex-one h-[100px] w-[100px]">Hello - 600</div>

              <Button>
                <Home size={16} strokeWidth={2} />
                <span className="text-sm">Home</span>
              </Button>
              <Button color="danger">
                <Trash size={16} strokeWidth={2} />
                Delete
              </Button>
              <Button color="success" processing={true}>
                <Home size={16} strokeWidth={2} />
                Save
              </Button>
              <Button disabled={true}>
                <Home size={16} strokeWidth={2} />
                Disabled
              </Button>
            </div>
          </div> */}
          {/* <Form /> */}
          <div className="container-lg">
            <body className="bg-gray-950 text-gray-200 font-inter">
              <div className="flex flex-col lg:flex-row justify-between max-w-7xl mx-auto px-6 py-16">
                <div className="lg:w-3/4 space-y-10">
                  <div className="prose dark:prose-invert prose-h1:font-bold prose-h1:text-[28px] prose-a:text-blue-600 prose-p:text-justify prose-img:rounded-xl -prose-headings:underline">
                    <Form1 />
                  </div>
                </div>
                <div className="lg:w-1/4 mt-16 lg:mt-0 border-l border-gray-800 pl-6">
                  <ul className="space-y-3 text-gray-400 text-sm">
                    <li><a href="#" className="text-white font-medium">Installation</a></li>
                    <li><a href="#" className="hover:text-white">Importing the module in your application</a></li>
                    <li><a href="#" className="hover:text-white">Dark mode support</a></li>
                  </ul>
                </div>
              </div>
            </body>
          </div>
        </div>
      </Page>
    </>
  );
}

export const getServerSideProps = checkSession;
