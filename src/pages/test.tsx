import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import Page from "@/components/Page";
import AutoComplete from "@/components/Autocomplete";

export default function TestPage({ session }: { session: SessionData }) {

    return (
        <>
            <Page session={session} title="Seamless Developer Console" breadcrumbs={[{ link: "/", name: "Home" }]}>
                <div>This is the test page</div>
                <AutoComplete
                    option={[
                        { label: "Web", value: "Web" },
                        { label: "Data", value: "Data" },
                        { label: "Cyber", value: "Cyber" },
                        { label: "Database", value: "Database" },
                        { label: "Matrix", value: "Matrix" },
                        { label: "Algorithm", value: "Algorithm" },
                    ]}
                    // endpoint="http://172.30.10.46:4000/api/options"
                    // method="GET"
                    placeholder="Search or select a category..."
                    multipleSelect={false}

                />
            </Page>
        </>
    )
}


export const getServerSideProps = checkSession;
