import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import Page from "@/components/Page";
import Form from "@/components/Form";
import AutoSuggest from "@/components/AutoSuggest";
import Button from "@/components/Button";

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
          endpoint={"/identity-demo/organizations/onboard"}
          // formFields={[
          //   { id: "username", field: "username", label: "Username", width: 6, required: false },
          //   { field: "fullname", label: "Full Name", width: 6, required: false, disabled: true, defaultValue: "apple" },
          //   {
          //     id: "status", field: "status", label: "Status", width: 6, required: false, type: "dropdown", disabled: false, options: [
          //       { label: "Active", value: "Active" },
          //       { label: "Inactive", value: "Inactive" },
          //     ], defaultValue: "Active"
          //   },
          //   { id: "date", field: "date", label: "Date", width: 6, type: "date", required: false },
          //   { id: "time", field: "time", label: "Time", width: 6, type: "time", required: false },
          //   { id: "password", field: "password", label: "Password", width: 6, type: "password", required: true, disabled: true },
          //   { id: "fileinput", field: "fileinput", label: "Input File", width: 12, type: "fileinput", required: false },
          //   { id: "multiplefileinput", field: "multiplefileinput", label: "Multiple File Input", width: 12, type: "fileinput", required: false, multiple: true },
          //   {
          //     id: "autocomplete", field: "autocomplete", label: "Auto Complete", width: 12, type: "autocomplete", required: false, multiple: true, placeholder: "Search or select a category...",
          //     endpoint: "https://restcountries.com/v3.1/all?fields=name", method: "GET", labelField: "name.common", valueField: "name.common",
          //     // renderField: (item) => {
          //     //    return { label: `${item.name.common} - [${item.name.official}]`, value: item.name.common }
          //     // },
          //     options:
          //       [
          //         { label: "Web", value: "web" },
          //         { label: "Data", value: "data" },
          //         { label: "Cyber", value: "cyber" },
          //         { label: "Database", value: "database" },
          //         { label: "Matrix", value: "matrix" },
          //         { label: "Algorithm", value: "algorithm" },
          //       ]
          //   },
          //   { field: "textarea", label: "Textarea", width: 12, type: "textarea", required: false },
          // ]}
          formFields={[
            { id: "legal_name", field: "legal_name", label: "legal Name ", width: 6, required: true },
            { id: "trade_name", field: "trade_name", label: "trade Name ", width: 6, required: true },
            { id: "owner", field: "owner", label: "owner", width: 6, required: true },
            { id: "country_code", field: "contact.country_code", label: "country code", width: 6, required: true },
            { id: "number", field: "contact.number", label: "Number", width: 6, required: true },
            { id: "primary_email", field: "primary_email", label: "Primary Email", width: 6, required: true },
            { id: "secondary_email", field: "secondary_email", label: "Secondary Email", width: 6, required: true },
            { id: "location", field: "registered_address.location", label: "Location", width: 6, required: true },
            { id: "city", field: "registered_address.city", label: "City", width: 6, required: true },
            { id: "state", field: "registered_address.state", label: "State", width: 6, required: true },
            { id: "country", field: "registered_address.country", label: "Country", width: 6, required: true },
            { id: "postal_code", field: "registered_address.postal_code", label: "Postal Code", width: 6, required: true },
            { id: "latitude", field: "registered_address.latitude", label: "Latitude", width: 6, required: false },
            { id: "longitude", field: "registered_address.longitude", label: "Longitude", width: 6, required: false },
            { id: "location", field: "headquarter_address.location", label: "Location", width: 6, required: true },
            { id: "city", field: "headquarter_address.city", label: "City", width: 6, required: true },
            { id: "state", field: "headquarter_address.state", label: "State", width: 6, required: true },
            { id: "country", field: "headquarter_address.country", label: "Country", width: 6, required: true },
            { id: "postal_code", field: "headquarter_address.postal_code", label: "Postal Code", width: 6, required: true },
            { id: "latitude", field: "headquarter_address.latitude", label: "Latitude", width: 6, required: false },
            { id: "longitude", field: "headquarter_address.longitude", label: "Longitude", width: 6, required: false },
            { id: "official_website", field: "official_website", label: "Official website", width: 6, required: true },
            { id: "linked_in", field: "linked_in", label: "Linkedin", width: 6, required: false },
            { id: "type", field: "type", label: "Type", width: 6, required: true },
            { id: "founding_year", field: "founding_year", label: "Founding Year", width: 6, required: true },
          ]}
          session={session}
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
