import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import Page from "@/components/Page";
import Form from "@/components/Form";
import Button from "@/components/Button";
import DataTable from "@/components/DataTable";
import SearchTable from "@/components/SearchTable";
import Link from "next/link";
import { Trash2, Download, Edit2, Copy } from "lucide-react";
import AutoSuggest from "@/components/AutoSuggest";

export default function FormPage({ session }: { session: SessionData }) {
  // const arr = ["TAB", "CAP", "TSP", "DRPS", "MG", "MCG", "ML", "IU", "G", "UG", "UNITS", "PUFFS", "VIAL"]
  const arr = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ]

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    // setValues(selectedOptions)

    console.log(selectedOptions);
  }

  return (
    <>
      <Page session={session} title="Seamless Developer Console" breadcrumbs={[{ link: "/", name: "Home" }]}>
        <div className="mx-auto flex max-w-screen-2xl flex-col">
          {/* <Form
            size="md"
            rounded="md"
            method="POST"
            endpoint="http://172.30.10.46:4000/user"
            formFields={[
              { id: "username", field: "username", label: "Username", width: 6, required: true },
              { field: "fullname", label: "Full Name", width: 6, required: false, disabled: true },
              {
                id: "status", field: "status", label: "Status", width: 6, required: false, type: "dropdown", options: [
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ], defaultValue: "Active"
              },
              { id: "date", field: "date", label: "Date", width: 6, type: "date", required: false },
              { id: "time", field: "time", label: "Time", width: 6, type: "time", required: false },
              { id: "password", field: "password", label: "Password", width: 6, type: "password", required: true },
              { id: "fileinput", field: "fileinput", label: "Input File", width: 12, type: "fileinput", required: false },
              { id: "multiplefileinput", field: "multiplefileinput", label: "Multiple File Input", width: 12, type: "fileinput", required: false, multiple: true },
              { field: "textarea", label: "Textarea", width: 12, type: "textarea", required: true },
            ]}
          /> */}

          <div className="my-3">
            <DataTable
              name="medicine"
              columns={[
                { name: "id", label: "id", type: "hidden" },
                // {
                //   name: "name", label: "Name", type: "text", width: "550px",
                //   endpoint: "http://172.30.10.46:4000/api/options", searchField: "name", descriptionField: "composition"
                // },
                { name: "name", label: "Name", width: "80px", type: "text", options: arr },
                { name: "value", label: "Value", width: "105px", type: "text", options: arr },
                { name: "type", label: "Type", width: "155px", type: "text", options: arr },
                { name: "description", label: "Description", width: "130px", type: "text", options: arr },
              ]}
              // value={JSON.stringify(data.medicine)}
              onAddFocusField="name"
            />
          </div>

          <SearchTable
            columns={[
              { field: "username", label: "Username", render: (value, row) => <Link href={"/services/bpmn-workflow/modeler/" + row.id} className="text-primary-500 hover:text-primary-600">{value}</Link> },
              { field: "firstName", label: "First Name" },
              { field: "lastName", label: "Last Name" },
              { field: "email", label: "Email" },
              {
                field: "status", label: "Status", type: "select", options: [
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ], defaultValue: "Active"
              },
            ]}
            isSelectable={true}
            isSearchable={false}
            // endpoint={endpoint}
            resultVariable="users"
            actions={[
              { label: "Edit", icon: <Edit2 size={16} className="text-primary-500 hover:text-primary-600" />, onClick: (e, selected) => { console.log(selected); }, multiple: false },
              { label: "Trash", icon: <Trash2 size={16} className="text-red-500 hover:text-red-600" />, onClick: (e, selected) => { console.log(selected); } },
              { label: "Download", icon: <Download size={16} className="text-green-500 hover:text-green-600" />, onClick: (e, selected) => { console.log(selected); } },
            ]}
            session={session} endpoint={""} style={undefined} />
        </div>
      </Page>
    </>
  )
}

export const getServerSideProps = checkSession;
