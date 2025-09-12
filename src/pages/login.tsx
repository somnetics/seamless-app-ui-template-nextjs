import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className="flex h-screen min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-r from-blue-500 to-cyan-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex flex-col items-center justify-center">
          <Image src="/icons/logo-light.svg" className="my-5" alt="" height={40} width={150} />
        </div>
        <div className="grid gap-6 py-12 px-8 w-full bg-white text-black rounded-xl shadow-md">
          <div className="flex gap-1 flex-col items-center justify-center">
            <h1 className="text-xl font-bold text-gray-700">Welcome Back</h1>
            <p className="text-sm text-gray-400">
              Lets get started with the application
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full bg-gray-700 rounded-lg p-2 text-white border border-gray-600 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-gray-700">
              Password
            </label>
            <input
              type="text"
              className="w-full bg-gray-700 rounded-lg p-2 text-white border border-gray-600 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <label>
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-4"
          >
            Sign in to your account
          </button>
        </div>
      </div>
    </main>
  );
}
