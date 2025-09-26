import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import MainMenu from "@/components/MainMenu";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Form from "@/components/form";
import { Home, Trash } from "lucide-react";

export default function Index({ session }: { session: SessionData }) {
  // const [open, setOpen] = useState(true);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Seamless Developer Console</title>
      </Head>
      <div className="relative grid grid-cols-1 text-gray-700 dark:text-gray-200 sm:grid-cols-[auto_minmax(0,1fr)]">
        <MainMenu session={session} />
        <main className="max-w-[100vw] flex-1">
          <Header session={session} />
          <div className="mx-auto flex max-w-screen-2xl flex-col">
            <div className="mt-8 w-full px-5 lg:mt-12">
              <div className="flex w-full items-center justify-between">
                <Button>
                  <Home size={16} strokeWidth={2} />
                  <span className="text-sm">Home</span>
                </Button>
                <Button color="danger">
                  <Trash size={16} strokeWidth={2} />
                  Delete
                </Button>
                <Button color="danger" processing={true}>
                  <Home size={16} strokeWidth={2} />
                  Save
                </Button>
                <Button disabled={true}>
                  <Home size={16} strokeWidth={2} />
                  Disabled
                </Button>
              </div>
            </div>
            <Form />
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = checkSession;
