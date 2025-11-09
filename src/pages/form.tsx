import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import Page from "@/components/Page";
import Form from "@/components/CreateForm";
import Button from "@/components/Button";

export default function FormPage({ session }: { session: SessionData }) {

  return (
    <>
      <Page session={session} title="Seamless Developer Console" breadcrumbs={[{ link: "/", name: "Home" }]}>
        <div className="mx-auto flex max-w-screen-2xl flex-col">
          <Form type="TextBox"/>
        </div>
      </Page>
    </>
  )
}

export const getServerSideProps = checkSession;
