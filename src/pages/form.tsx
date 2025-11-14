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
            formFields={[
              { field: "username", label: "Username", width: 6, size: "md" },
              { field: "fullname", label: "Full Name", width: 6 },
              {
                field: "status", label: "Status", width: 6, type: "dropdown", options: [
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ], defaultValue: "Active"
              },
              { field: "date", label: "Date", width: 6, type: "date" },
              { field: "password", label: "Password", width: 6, type: "password" },
              { field: "fileinput", label: "Input File", width: 12, type: "fileinput" },
              { field: "textarea", label: "Textarea", width: 12, type: "textarea" },
            ]}
          />
        </div>
      </Page>
    </>
  )
}

export const getServerSideProps = checkSession;
