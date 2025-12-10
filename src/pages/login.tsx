import Image from "next/image";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { checkLogin } from "@/libs/checkSession";
import { useProgress } from "@/components/Progress";
import { useToast, MessageTypes } from "@/components/Toast";
import { Copyright, Heart } from "lucide-react";
import Button from "@/components/Button";
import Textbox from "@/components/Textbox";
// import Textbox from "@/components/Textbox_test";
import CheckRadio from "@/components/CheckRadio";
import styles from "@/styles/login.module.css";

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

        if (response.status === 500) {
          throw new Error('500 Internal Server Error');
        } else {
          // get response data
          const data = await response.json();

          // pause
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
              // activate page progress
              showProgress(false);

              // redirect to home page
              router.replace("/");

              // pause
              setTimeout(() => {
                // show message
                addToast(data.message, MessageTypes.Success, 1500);
              }, 500);
            }
          }, 500);
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
      <Header title="Sign-in" />
      <main className={styles.LoginBg + " flex h-screen min-h-full flex-col justify-center px-6 py-12 lg:px-8"}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex gap-2 items-start justify-center mb-8">
            <Image className="block" src="/icons/logo-light.svg" alt="" width={175} height={37} />
            <span className="inline-flex items-center rounded-sm px-1 py-[2px] leading-tight text-xs font-medium inset-ring bg-blue-light-400/20 text-blue-light-400 inset-ring-blue-light-400/30">v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
          </div>
          <div className={styles.Card}>
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className={"relative grid gap-6 py-12 px-8 w-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 text-sm rounded-xl z-1"}>
                <div className="flex gap-2 flex-col items-center justify-center">
                  <h1 className="text-2xl font-bold">Welcome Back</h1>
                  <p className="text-center text-[13px]">Lets get started to build something interesting.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="">
                    Username
                  </label>
                  {/* <div className="outline-2 outline-gray-300 dark:outline-gray-600 focus-within:outline-blue-600 rounded-md">
                    <input type="text" name="username" className="outline-none p-2 w-full" defaultValue="soumen.sardar" />
                  </div> */}
                  <Textbox type="text" name="username" defaultValue="soumen.sardar" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="">
                    Password
                  </label>
                  {/* <div className="outline-2 outline-gray-300 focus-within:outline-blue-600 rounded-md">
                    <input type="password" name="password" className="outline-none p-2 w-full" defaultValue="admin123" />
                  </div> */}
                  <Textbox type="password" name="password" defaultValue="admin123" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  {/* <label className="flex items-center">
                    <input type="checkbox" className="accent-blue-600 hover:accent-blue-700 mr-2" /> Remember me
                  </label> */}
                  <CheckRadio type="checkbox">Remember me</CheckRadio>
                  <a href="#" className="text-primary-500 hover:text-primary-600">
                    Forgot password?
                  </a>
                </div>
                <Button type="submit" className="justify-center h-11">
                  Sign in to your account
                </Button>
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
