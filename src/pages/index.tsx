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
import Form from "@/components/FormOld";
import { Home, Trash } from "lucide-react";

export default function Index({ session }: { session: SessionData }) {
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
            <div className="prose dark:prose-invert prose-h1:font-bold prose-h1:text-[28px] prose-a:text-blue-600 prose-p:text-justify prose-img:rounded-xl -prose-headings:underline">
              {/* <Form1 /> */}              
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}

export const getServerSideProps = checkSession;
