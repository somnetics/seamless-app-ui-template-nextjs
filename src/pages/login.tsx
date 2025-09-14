import Image from "next/image";
import styles from "@/styles/login.module.css";
import { Copyright, Heart } from "lucide-react";

export default function Home() {
  return (
    <main className={styles.LoginBg + " flex h-screen min-h-full flex-col justify-center px-6 py-12 lg:px-8"}>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex gap-2 items-start justify-center mb-8">
          <Image src="/icons/logo-light.svg" alt="" height={40} width={175} />
          <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 inset-ring inset-ring-purple-400/30">Beta v4.0</span>
        </div>
        <div className={styles.Card}>
          <div className={"relative grid gap-6 py-12 px-8 w-full text-gray-100 bg-gray-900 text-sm rounded-xl z-1"}>
            <div className="flex gap-2 flex-col items-center justify-center">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-gray-300">
                Lets get started to build something interesting.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="">
                Username
              </label>
              <div className="outline-2 outline-gray-700 focus-within:outline-blue-600 rounded-md">
                <input
                  type="text"
                  className="outline-none p-2 w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="">
                Password
              </label>
              <div className="outline-2 outline-gray-700 focus-within:outline-blue-600 rounded-md">
                <input
                  type="password"
                  className="outline-none p-2 w-full"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="accent-blue-700 hover:accent-blue-600 mr-2" /> Remember me
              </label>
              <a href="#" className="text-blue-700 hover:text-blue-600">
                Forgot password?
              </a>
            </div>
            <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 px-2 rounded-lg cursor-pointer">Sign in to your account</button>
            {/* <button type="submit" className="w-full bg-blue-400/10 text-blue-400 inset-ring inset-ring-blue-400/30 hover:bg-blue-400/20 font-medium py-3 px-2 rounded-lg cursor-pointer">Sign in to your account</button> */}
          </div>
        </div>
        <div className="flex flex-col gap-1 text-gray-300 items-center text-sm justify-center mt-8">
          <p className="flex items-center">
            <span className="me-1">Designed with passion, made with</span>
            <Heart size={14} strokeWidth={0} fill="#f6339a" />
          </p>
          <p className="flex items-center">
            <Copyright size={14} />
            <span className="ms-1">2025 Som Imaging Informatics Pvt. Ltd.</span>
          </p>
        </div>
      </div>
    </main>
  );
}
