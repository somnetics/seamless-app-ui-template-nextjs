import Image from "next/image";
import styles from "@/styles/login.module.scss";

export default function Home() {
  return (
    <main className={styles.LoginBg + " flex h-screen min-h-full flex-col justify-center px-6 py-12 lg:px-8"}>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex gap-2 items-start justify-center mb-8">
          <Image src="/icons/logo-light.svg" alt="" height={40} width={175} />
          <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 inset-ring inset-ring-purple-400/30">Beta v4.0</span>
        </div>
        <div>
          <div className={"relative grid gap-6 py-12 px-8 w-full text-gray-100 bg-black/20 backdrop-blur-sm text-sm rounded-xl shadow-lg z-1"}>
            <div className="flex gap-1 flex-col items-center justify-center">
              <h1 className="text-xl font-bold">Welcome Back</h1>
              <p className="text-gray-400">Lets start building something interesting.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="">
                Username
              </label>
              <input type="text" className="w-full rounded-lg p-2 border-2 border-gray-700 focus:ring-blue-500 focus:outline-blue-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="">
                Password
              </label>
              <input type="text" className="w-full rounded-lg p-2 border-2 border-gray-700 focus:ring-blue-500 focus:outline-blue-500" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="accent-blue-500 hover:accent-blue-400 mr-2" /> Remember me
              </label>
              <a href="#" className="text-blue-500 hover:text-blue-400">
                Forgot password?
              </a>
            </div>
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-white font-medium py-3 px-2 rounded-lg cursor-pointer">
              Sign in to your account
            </button>
            {/* <button type="submit" className="w-full bg-yellow-400/10 text-yellow-400 inset-ring inset-ring-yellow-400/30 hover:bg-yellow-400/20 font-medium py-3 px-2 rounded-lg cursor-pointer">Sign in to your account</button> */}
          </div>
        </div>
        <div className="flex flex-col gap-1 items-center text-sm justify-center mt-8">
          <p>Designed with passion, made with &hearts;.</p>
          <p className="text-gray-400 font-thin">&copy; 2025 Som Imaging Informatics Pvt. Ltd.</p>
          {/* <Image src="/icons/logo-light.svg" alt="" height={40} width={175} /> */}
          {/* <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 inset-ring inset-ring-purple-400/30">Beta v4.0</span> */}
        </div>
      </div>
      {/* <footer className="fixed bottom-0 left-0 right-0 bg-gray-800/40 backdrop-blur-sm text-white p-4 z-50">
        <span className="text-white">This is a fixed footer.</span>
      </footer> */}
    </main>
  );
}
