import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
// import Page from "@/components/Page";

export default function BpmnWorkflow({ session }: { session: SessionData }) {
  return (
    <h1>Hello</h1>
  )
}

export const getServerSideProps = checkSession;
