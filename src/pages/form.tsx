import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import Page from "@/components/Page";
import Form from "@/components/Form";
import Button from "@/components/Button";

export default function FormPage({ session }: { session: SessionData }) {

  return (
    <>
      <Page session={session} title="Seamless Developer Console" breadcrumbs={[{ link: "/", name: "Home" }]}>
        <div className="mx-auto flex max-w-screen-2xl flex-col">
          <Form
            size="md"
            rounded="md"  
            formFields={[
              { field: "username", label: "Username", width: 6, required: true },
              { field: "fullname", label: "Full Name", width: 6, required: true },
              {
                field: "status", label: "Status", width: 6, required: false, type: "dropdown", options: [
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ], defaultValue: "Active"
              },
              { field: "date", label: "Date", width: 6, type: "date", required: false },
              { field: "password", label: "Password", width: 6, type: "password", required: true },
              { field: "fileinput", label: "Input File", width: 12, type: "fileinput", required: false },
              { field: "textarea", label: "Textarea", width: 12, type: "textarea", required: true },
            ]}
          />
        </div>
      </Page>
    </>
  )
}

export const getServerSideProps = checkSession;
