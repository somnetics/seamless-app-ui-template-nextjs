import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import Page from "@/components/Page";
import Form from "@/components/Form";
import AutoSuggest from "@/components/AutoSuggest";

export default function TestPage({ session }: { session: SessionData }) {
  const arr = ["TAB", "CAP", "TSP", "DRPS", "MG", "MCG", "ML", "IU", "G", "UG", "UNITS", "PUFFS", "VIAL"]

  //on change from keyboard
  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    // setValues(selectedOptions)

    console.log(selectedOptions);
  }

  return (
    <>
      <Page session={session} title="Seamless Developer Console" breadcrumbs={[{ link: "/", name: "Home" }]}>
        {/* <AutoComplete
                    // options={[
                    //     { label: "Web", value: "Web" },
                    //     { label: "Data", value: "Data" },
                    //     { label: "Cyber", value: "Cyber" },
                    //     { label: "Database", value: "Database" },
                    //     { label: "Matrix", value: "Matrix" },
                    //     { label: "Algorithm", value: "Algorithm" },
                    // ]}
                    endpoint="http://172.30.10.46:4001/api/options"
                    method="GET"
                    placeholder="Search or select a category..."
                    multiple={true}
                /> */}

        <Form
          size="md"
          rounded="md"
          method="POST"
          endpoint="http://172.30.10.46:4000/user"
          formFields={[
            { id: "username", field: "username", label: "Username", width: 6, required: false },
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
            {
              id: "autocomplete", field: "autocomplete", label: "Auto Complete", width: 12, type: "autocomplete", required: false, multiple: true, placeholder: "Search or select a category...",
              endpoint: "https://restcountries.com/v3.1/all?fields=name", method: "GET", labelField: "name.common", valueField: "name.common",
              // renderField: (item) => {
              //    return { label: `${item.name.common} - [${item.name.official}]`, value: item.name.common }
              // },
              options:
                [
                  { label: "Web", value: "web" },
                  { label: "Data", value: "data" },
                  { label: "Cyber", value: "cyber" },
                  { label: "Database", value: "database" },
                  { label: "Matrix", value: "matrix" },
                  { label: "Algorithm", value: "algorithm" },
                ]
            },
            { field: "textarea", label: "Textarea", width: 12, type: "textarea", required: false },
          ]}
        />


        <div className="p-5">
          {/* <AutoSuggest
            name="autosuggest"
            options={[
              { label: "Web", value: "web" },
              { label: "Data", value: "data" },
              { label: "Cyber", value: "cyber" },
              { label: "Database", value: "database" },
              { label: "Matrix", value: "matrix" },
              { label: "Algorithm", value: "algorithm" },
            ]}
            multiple={true}
            endpoint={"https://restcountries.com/v3.1/all?fields=name"}
            method={"GET"}
            labelField={"name.common"}
            valueField={"name.common"}
            // renderField={formField.renderField}
            onChange={onChange}
            value={"ss"}
          /> */}
        </div>
      </Page>
    </>
  )
}


export const getServerSideProps = checkSession;
