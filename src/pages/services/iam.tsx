// import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import SideMenu from "@/components/sidemenu";
import Header from "@/components/HeaderBar";
import { Apis, Api } from "@/libs/apis";
import { ExternalLink, Trash2, Download, Edit2, Copy, ArrowLeft, KeySquare, Plus, X, User } from 'lucide-react';
import Button from '@/components/Button';
import { useDrawer } from "@/components/Drawer";
import TagInput from "@/components/TagInput";

interface PageProps {
  service: Api;
  meta: {
    title: string;
    description: string;
    keywords: string;
  }
}

export default function ApiDetails({ meta, service }: PageProps) {
  const { showDrawer } = useDrawer();

  const router = useRouter();



  // const [serviceDetails, setServiceDetails] = useState<Api>();

  // useEffect(() => {
  //   if (router.query.params) {
  //     const serviceName = router.query.params[0];
  //     setServiceDetails(Apis.find((app) => app.name == serviceName))
  //   }
  // }, [router.query.params])

  const userForm = <>
    <div>
      <label className="block text-sm font-medium text-gray-700">First Name</label>
      <input type="text" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter First Name" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Last Name</label>
      <input type="text" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter Last Name" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">User Name</label>
      <input type="text" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter Username" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
      <select id="status" name="status" className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" >
        <option value="male" className="font-medium">Male</option>
        <option value="female" className="font-medium">Female</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input type="email" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter email" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
      <TagInput placeholder="Add tags..." onChange={(tags) => console.log("Tags:", tags)}/>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Mobile</label>
      <input type="tel" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter mobile number" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
      <select id="status" name="status" className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <option value="active" className="font-medium">Active</option>
        <option value="inactive" className="font-medium">Inactive</option>
      </select>
    </div>
  </>

  // add new
  const addNew = (e: any) => {
    e.preventDefault();

    // open model
    showDrawer({
      title: "Add User", body: userForm, onSubmit: async (formData, close) => {
        // // let updated data
        // const taskData: any = { id: task.id, lockVersion: task.lockVersion };

        // // get form value
        // formData.forEach((value, key) => taskData[key] = value);

        // // show progress
        // showProgress(true);

        // // submit task
        // const data = await SubmitTask(session.token, taskData);

        // // on error
        // if (data._type === "Error") {
        //   // show message
        //   addToast(data.message, MessageTypes.Error);
        // } else {
        //   // show message
        //   addToast("Task updated successfully.", MessageTypes.Success, 1500);
        // }

        // // show progress
        // showProgress(false);

        // close window
        // close(true);
      }
    })
  }

  return (
    <>
      <Head>
        <title>Seamless 4.0 - Enterprise Service Platform</title>
      </Head>
      <main className="min-h-screen xl:flex">
        <SideMenu />
        <div className="flex-1 transition-all duration-300 ease-in-out lg:ml-[85px]">
          <HeaderBar />
          {/* include SideDrawerForm Component */}
          {/* <SideDrawerForm /> */}
          <div className="flex w-full item-center justify-between border-b border-gray-200 py-3 px-12">
            <div className="flex items-center">
              <a href="#" onClick={() => router.back()} className="hover:text-blue-500">
                <ArrowLeft size={24} strokeWidth={2} className="text-gray-900 hover:text-blue-600 mx-3" />
              </a>
              <h2 className="text-gray-800 font-semibold">Service Details</h2>
            </div>
            <div className="flex items-center">
              <Button className="hover:bg-blue-100 hover:text-blue-600" onClick={addNew}>
                <Plus size={16} strokeWidth={2} />
                <span className="text-sm">Add</span>
              </Button>
              <button disabled className="group flex items-center gap-2 text-black font-bold py-2 px-4 ms-2 rounded transition">
                <Trash2 size={16} strokeWidth={2} className="text-gray-400 group-hover1:text-red-600" aria-disabled />
                <span className="text-gray-400 text-sm font-semibold group-hover1:text-red-600">Delete</span>
              </button>
            </div>
          </div>
          <div className="px-12 bg-white">
            <div className="w-full p-4 mx-auto1 border-b1 border-gray-2001">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
                <div className="flex items-center">
                  <Image src={service.icon || ""} alt={service.title || ""} width={80} height={80} className="mr-4" />
                  <div className="flex flex-col justify-center">
                    <h2 className="text-[24px] text-gray-800 font-semibold">{service.title}</h2>
                    <p className="text-gray-600 truncate overflow-hidden text-ellipsis">{service.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full p-4 mx-auto1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <div className="flex items-center border-r border-gray-200">
                  <div className="flex flex-col justify-center">
                    <p className="text-gray-800 font-semibold">Name</p>
                    <p className="text-[13px] text-gray-600">{service.title}</p>
                  </div>
                </div>
                <div className="flex items-center border-r border-gray-200">
                  <div className="flex flex-col justify-center">
                    <p className="text-gray-800 font-semibold">Version</p>
                    <p className="text-[13px] text-gray-600">3.5</p>
                  </div>
                </div>
                <div className="flex items-center border-r border-gray-200">
                  <div className="flex flex-col justify-center">
                    <p className="text-gray-800 font-semibold">Type</p>
                    <p className="text-[13px] text-gray-600">Public API</p>
                  </div>
                </div>
                <div className="flex items-center border-r border-gray-200">
                  <div className="flex flex-col justify-center">
                    <p className="text-gray-800 font-semibold">Status</p>
                    <p className="text-[13px] text-gray-600">Active</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex flex-col justify-center">
                    <p className="text-gray-800 font-semibold">Documentation</p>
                    <a href={`/documentation/${service.name}/v3.5`} className="text-[13px] text-blue-600 flex items-center">
                      <span className="me-2">API Documentation</span><ExternalLink size={15} className="text-blue-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700 bg-white">
            <ul className="flex flex-wrap -mb-px text-sm font-medium px-12 text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
              <li className="me-3" role="presentation">
                <button className="inline-block p-4 border-b-2 rounded-t-lg cursor-pointer text-gray-500 hover:text-gray-800 border-gray-300 hover:border-gray-600" id="user-tab" data-tabs-target="#users" type="button" role="tab" aria-controls="users" aria-selected="false">Users</button>
              </li>
              <li className="me-3" role="presentation">
                <button className="inline-block p-4 border-b-2 rounded-t-lg cursor-pointer text-gray-500 hover:text-gray-800 border-gray-300 hover:border-gray-600" id="group-tab" data-tabs-target="#groups" type="button" role="tab" aria-controls="groups" aria-selected="false">Groups</button>
              </li>
              <li className="me-3" role="presentation">
                <button className="inline-block p-4 border-b-2 rounded-t-lg cursor-pointer text-gray-500 hover:text-gray-800 border-gray-300 hover:border-gray-600" id="role-tab" data-tabs-target="#roles" type="button" role="tab" aria-controls="roles" aria-selected="false">Roles</button>
              </li>
            </ul>
          </div>
          <div id="default-tab-content">
            <div className="hidden1 p-4 rounded-lg dark:bg-gray-800 px-12" id="users" role="tabpanel" aria-labelledby="user-tab">
              <table className="table-auto w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="w-[20px] px-4 py-2.5">
                      <input type="checkbox" className="flex" />
                    </th>
                    <th className="text-left p-2.5">Name</th>
                    <th className="text-left p-2.5">Status</th>
                    <th className="p-2.5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="text-left px-4 py-2.5">
                      <input type="checkbox" className="flex" />
                    </td>
                    <td className="text-left p-2.5">Susanta Das</td>
                    <td className="text-left p-2.5">Active</td>
                    <td className="text-left p-2.5">
                      <div className="flex items-center justify-center">
                        <Edit2 size={16} className="text-blue-600 me-3 cursor-pointer" />
                        <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
                        <Download size={16} className="text-gray-600 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="text-left px-4 py-2.5">
                      <input type="checkbox" className="flex" />
                    </td>
                    <td className="text-left p-2.5">Soumen Sardar</td>
                    <td className="text-left p-2.5">Active</td>
                    <td className="text-left p-2.5">
                      <div className="flex items-center justify-center">
                        <Edit2 size={16} className="text-blue-600 me-3 cursor-pointer" />
                        <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
                        <Download size={16} className="text-gray-600 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left px-4 py-2.5">
                      <input type="checkbox" className="flex" />
                    </td>
                    <td className="text-left p-2.5">Sayan Das</td>
                    <td className="text-left p-2.5">Active</td>
                    <td className="text-left p-2.5">
                      <div className="flex items-center justify-center">
                        <Edit2 size={16} className="text-blue-600 me-3 cursor-pointer" />
                        <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
                        <Download size={16} className="text-gray-600 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="hidden p-4 rounded-lg  dark:bg-gray-800" id="groups" role="tabpanel" aria-labelledby="group-tab">
              <table className="table-auto w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="w-[20px] px-4 py-2.5">
                      <input type="checkbox" className="flex" />
                    </th>
                    <th className="text-left p-2.5">Group Name</th>
                    <th className="text-left p-2.5">Status</th>
                    <th className="p-2.5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="text-left px-4 py-2.5">
                      <input type="checkbox" className="flex" />
                    </td>
                    <td className="text-left p-2.5">Webclient</td>
                    <td className="text-left p-2.5">Active</td>
                    <td className="text-left p-2.5">
                      <div className="flex items-center justify-center">
                        <Edit2 size={16} className="text-blue-600 me-3 cursor-pointer" />
                        <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
                        <Download size={16} className="text-gray-600 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="text-left px-4 py-2.5">
                      <input type="checkbox" className="flex" />
                    </td>
                    <td className="text-left p-2.5">Desktop Application</td>
                    <td className="text-left p-2.5">25-03-2025</td>
                    <td className="text-left p-2.5">Soumen Sardar</td>
                    <td className="text-left p-2.5">
                      <a href="#" className="flex items-center">
                        <span className="me-2">9669869441305-cdq...</span><Copy size={15} className="text-green-600" />
                      </a>
                    </td>
                    <td className="text-left p-2.5">
                      <div className="flex items-center justify-center">
                        <Edit2 size={16} className="text-blue-600 me-3 cursor-pointer" />
                        <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
                        <Download size={16} className="text-gray-600 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left px-4 py-2.5">
                      <input type="checkbox" className="flex" />
                    </td>
                    <td className="text-left p-2.5">Mobile Application</td>
                    <td className="text-left p-2.5">27-03-2025</td>
                    <td className="text-left p-2.5">Susanta Das</td>
                    <td className="text-left p-2.5">
                      <a href="#" className="flex items-center">
                        <span className="me-2">4969709441305-acd...</span><Copy size={15} className="text-green-600" />
                      </a>
                    </td>
                    <td className="text-left p-2.5">
                      <div className="flex items-center justify-center">
                        <Edit2 size={16} className="text-blue-600 me-3 cursor-pointer" />
                        <Trash2 size={16} className="text-red-600 me-3 cursor-pointer" />
                        <Download size={16} className="text-gray-600 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="hidden p-4 rounded-lg  dark:bg-gray-800" id="role" role="tabpanel" aria-labelledby="role-tab">
              <p className="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Settings tab&apos;s associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Access context properties with type safety
  const { query, req } = context;

  // set page metadata
  const meta = {
    title: 'Seamless 4.0 Dshboard',
    description: 'This is a great product.',
    keywords: `product, workflow`
  };

  //   // let session = await getIronSession(
  //   //   req,
  //   //   res,
  //   //   sessionOptions
  //   // );

  //   // if (!session.isLoggedIn) {
  //   //   return {
  //   //     redirect: {
  //   //       destination: "/login",
  //   //       permanent: false,
  //   //     },
  //   //   };
  //   // }

  //   // if (typeof session.isLoggedIn === "undefined") {
  //   //   session = { ...defaultSession, ...session };
  //   // }

  // get service details
  // const serviceName = typeof query.params !== "undefined" ? query.params[0] : "";

  // { props: { session, post, meta } };

  return {
    props: {
      meta: meta,
      service: Apis.find((app) => app.name == "iam"),
    },
  };
};
