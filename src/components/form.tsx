type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
import styles from "./Button.module.css";
import Button from "@/components/Button";

export default function Form() {
  return (
    <form className="space-y-6 pt-4">
      <div className={"relative grid gap-10 py-12 px-8 w-4/5 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 text-sm rounded-xl z-1"}>
        <div className="flex gap-2 flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Form Name</h1>
          <p className="text-center text-[13px]">Lets get started to build something interesting.</p>
        </div>
        <div className="grid gap-6 mb-6- md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="">
              Username
            </label>
            <div className="outline-2 outline-gray-700 focus-within:outline-indigo-600 rounded-md">
              <input type="text" name="username" className="outline-none p-2 w-full" placeholder="Enter Username" defaultValue="" required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="">
              Password
            </label>
            <div className="outline-2 outline-gray-700 focus-within:outline-indigo-600 rounded-md">
              <input type="password" name="password" className="outline-none p-2 w-full" placeholder="Enter Password" defaultValue="" required />
            </div>
          </div>
        </div>
        <div className="grid gap-6 mb-6- md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="">
              First Name
            </label>
            <div className="outline-2 outline-gray-700 focus-within:outline-indigo-600 rounded-md">
              <input type="text" name="firstname" className="outline-none p-2 w-full" placeholder="Enter First Name" defaultValue="" required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="">
              Last Name
            </label>
            <div className="outline-2 outline-gray-700 focus-within:outline-indigo-600 rounded-md">
              <input type="password" name="lastname" className="outline-none p-2 w-full" placeholder="Enter Last Name" defaultValue="" required />
            </div>
          </div>
        </div>
        <div className="grid gap-4 mb-6-">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="">
              Address
            </label>
            <div className="outline-2 outline-gray-700 focus-within:outline-indigo-600 rounded-md">
              <textarea name="address" className="outline-none p-2 w-full" placeholder="Enter Address" defaultValue="" required />
            </div>
          </div>
        </div>
        <div className="grid gap-6 mb-6- md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="">
              Phone
            </label>
            <div className="outline-2 outline-gray-700 focus-within:outline-indigo-600 rounded-md">
              <input type="number" name="phone" className="outline-none p-2 w-full" placeholder="Enter Phone Number" defaultValue="" required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="">
              Email
            </label>
            <div className="outline-2 outline-gray-700 focus-within:outline-indigo-600 rounded-md">
              <input type="email" name="email" className="outline-none p-2 w-full" placeholder="Enter E-mail" defaultValue="" required />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="">
            Gender
          </label>
          {/* <select className="border border-indigo-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"> */}
          <select className="border border-gray-700 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
            <option selected>Choose countries</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
          </select>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label htmlFor="" className="">
            Days
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="accent-indigo-600 hover:accent-indigo-700 mr-2" /> Monday
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="accent-indigo-600 hover:accent-indigo-700 mr-2" /> Tuesday
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="accent-indigo-600 hover:accent-indigo-700 mr-2" /> Wednesday
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="accent-indigo-600 hover:accent-indigo-700 mr-2" /> Thursday
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="accent-indigo-600 hover:accent-indigo-700 mr-2" /> Friday
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="accent-indigo-600 hover:accent-indigo-700 mr-2" /> Saturday
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="accent-indigo-600 hover:accent-indigo-700 mr-2" /> Sunday
          </label>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label htmlFor="" className="">
            Status
          </label>
          <div className="flex items-center">
            <input checked id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Active</label>
          </div>
          <div className="flex items-center">
            <input checked id="default-radio-2" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Inactive</label>
          </div>
        </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="accent-indigo-600 hover:accent-indigo-700 mr-2" /> Remember me
            </label>
            <a href="#" className="text-indigo-600 hover:text-indigo-700">
              Forgot password?
            </a>
          </div>
          <Button type="submit" className="justify-center h-11 w-2xs">
            Submit
          </Button>
        </div>
    </form>
  );
}