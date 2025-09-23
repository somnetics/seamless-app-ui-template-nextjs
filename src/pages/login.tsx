import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { checkLogin } from "@/libs/checkSession";
import { useProgress } from "@/components/Progress";
import { useToast, MessageTypes } from "@/components/Toast";
import { Copyright, Heart } from "lucide-react";
import styles from "@/styles/login.module.css";
import Button from "@/components/Button";
import { LogIn } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { addToast } = useToast();
  const { showProgress } = useProgress();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // get form
    const form = e.currentTarget;

    // set fprm validation
    form.classList.remove("was-validated");

    // set fprm validation
    form.querySelectorAll(".form-field").forEach((ele: any) => {
      // add invalid field
      ele.classList.remove("is-invalid");
    });

    // add wiggle
    document.querySelector(".card")?.classList.remove("invalid-login");

    // if form is valid
    if (form.checkValidity()) {
      // get form data
      const formData = Object.fromEntries(new FormData(form).entries());

      // activate page progress
      showProgress(true);

      try {
        // call api
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          if (response.status === 500) {
            throw new Error('500 Internal Server Error');
          } else {
            // get response data
            const data = await response.json();

            setTimeout(() => {
              // on error
              if (data.status == "error") {
                // set fprm validation
                form.querySelectorAll(".form-field").forEach((ele) => {
                  // add invalid field
                  ele.classList.add("is-invalid");
                });

                setTimeout(() => {
                  // add wiggle
                  document.querySelector(".card")?.classList.add("invalid-login");
                }, 100);

                // show message
                addToast(data.message, MessageTypes.Error);

                // activate page progress
                showProgress(false);
              } else {
                // show message
                addToast(data.message, MessageTypes.Success, 1500);

                setTimeout(() => {
                  // activate page progress
                  showProgress(false);

                  // redirect to home page
                  router.replace("/");
                }, 2000);
              }
            }, 500);
          }
        }
      } catch (err: any) {
        setTimeout(() => {
          // show message
          addToast(err.message, MessageTypes.Error, 1500);

          // activate page progress
          showProgress(false);
        }, 500);
      }
    } else {
      // set form validation
      form.classList.add("was-validated");
    }
  };

  return (
    <>
      <Head>
        <title>Seamless - Developer Console</title>
      </Head>
      <main className={styles.LoginBg + " flex h-screen min-h-full flex-col justify-center px-6 py-12 lg:px-8"}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex gap-2 items-start justify-center mb-8">
            <Image className="h-auto" src="/icons/logo-light.svg" alt="" width={175} height={36.89} />
            <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 inset-ring inset-ring-purple-400/30">Beta v4.0</span>
          </div>
          <div className={styles.Card}>
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className={"relative grid gap-6 py-12 px-8 w-full text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 text-sm rounded-xl z-1"}>
                <div className="flex gap-2 flex-col items-center justify-center">
                  <h1 className="text-2xl font-bold">Welcome Back</h1>
                  <p className="text-center text-[13px]">Lets get started to build something interesting.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="">
                    Username
                  </label>
                  <div className="outline-2 outline-gray-700 focus-within:outline-blue-600 rounded-md">
                    <input type="text" name="username" className="outline-none p-2 w-full" defaultValue="soumen.sardar" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="">
                    Password
                  </label>
                  <div className="outline-2 outline-gray-700 focus-within:outline-blue-600 rounded-md">
                    <input type="password" name="password" className="outline-none p-2 w-full" defaultValue="admin123" />
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
                {/* <Button className="bg-gray-400/10 hover:bg-blue-400/10 text-shadow-gray-200 text-blue-500 inset-ring inset-ring-blue-500/30">
                  <LogIn size={16} strokeWidth={2} />
                  <span className="text-sm">Sign in to your account</span>
                </Button> */}
                <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 px-2 rounded-lg cursor-pointer">
                  Sign in to your account
                </button>
                {/* <button type="submit" className="w-full bg-blue-400/10 text-blue-400 inset-ring inset-ring-blue-400/30 hover:bg-blue-400/20 font-medium py-3 px-2 rounded-lg cursor-pointer">Sign in to your account</button> */}
              </div>
            </form>
          </div>
          <div className="flex flex-col gap-1 text-gray-300 items-center justify-center mt-8 text-[13px]">
            <p className="flex items-center leading-tight">
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
    </>
  );
}

export const getServerSideProps = checkLogin;
