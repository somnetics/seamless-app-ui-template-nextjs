import Head from "next/head";
// import StoreContext from "@/context/StoreContext";
import { useContext } from "react";

export default function Header({ title }: { title: string }) {
  // const storeContext = useContext(StoreContext);

  return (
    <Head>
      <title>{process.env.NEXT_PUBLIC_APP_TITLE as string} - {process.env.NEXT_PUBLIC_APP_VERSION as string} - {title}</title>
      <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover" />
      <meta name="description" content={process.env.NEXT_PUBLIC_APP_DESCRIPTION as string} />
      {/* <meta name="theme-color" content={storeContext.theme == "dark" ? "#161a1f" : "#ffffff"} /> */}
      <link rel="icon" href="/icons/favicon.ico" />
      {/* <link rel="manifest" href="/manifest.json" /> */}
      {/* <link rel="apple-touch-icon" href="/images/logos/icon-maskable-512.png" /> */}
      {/* <link rel="icon" href="/images/logos/icon-maskable-512.png" /> */}
    </Head>
  )
}