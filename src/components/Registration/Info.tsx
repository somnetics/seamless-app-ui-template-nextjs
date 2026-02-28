import { SessionData } from "@/libs/session";
import Button from "../Button"
import Textbox from '@/components/Textbox';
import Tags, { TagsType } from '@/components/Tags';
import { Preview } from "@/components/Markdown/Preview";

import Form from "@/components/Form";

export default function Info({ session }: { session: SessionData }) {

  return (
    <>
      <Form
        size="md"
        rounded="md"
        method="POST"
        endpoint="http://172.30.10.46:4000/user"
        formFields={[
          // { id: "id", field: "id", label: "Id", width: 6, required: false },
          { field: "fullname", label: "Full Name", width: 12, required: false, disabled: false, defaultValue: "" },
          { id: "username", field: "username", label: "Username", width: 6, required: false },
          { id: "password", field: "password", label: "Password", width: 6, type: "password", required: true, disabled: false },
          {
            id: "status", field: "status", label: "Status", width: 6, required: false, type: "dropdown", disabled: false, options: [
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ], defaultValue: "Active"
          },
          // { id: "date", field: "date", label: "Date", width: 6, type: "date", required: false },
          // { id: "time", field: "time", label: "Time", width: 6, type: "time", required: false },
         
          // { id: "fileinput", field: "fileinput", label: "Input File", width: 12, type: "fileinput", required: false },
          // { id: "multiplefileinput", field: "multiplefileinput", label: "Multiple File Input", width: 12, type: "fileinput", required: false, multiple: true },
          // {
          //   id: "autocomplete", field: "autocomplete", label: "Auto Complete", width: 12, type: "autocomplete", required: false, multiple: true, placeholder: "Search or select a category...",
          //   endpoint: "https://restcountries.com/v3.1/all?fields=name", method: "GET", labelField: "name.common", valueField: "name.common",
          //   options:
          //     [
          //       { label: "Web", value: "web" },
          //       { label: "Data", value: "data" },
          //       { label: "Cyber", value: "cyber" },
          //       { label: "Database", value: "database" },
          //       { label: "Matrix", value: "matrix" },
          //       { label: "Algorithm", value: "algorithm" },
          //     ]
          // },
          // { field: "textarea", label: "Textarea", width: 12, type: "textarea", required: false },
        ]}
      />
      {/* <Button color="primary" size="md" >Button</Button> */}
    </>
  )
}