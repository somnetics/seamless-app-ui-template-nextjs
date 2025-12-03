import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import Page from "@/components/Page";
import AutoComplete from "@/components/Autocomplete";

export default function TestPage({ session }: { session: SessionData }) {

    return (
        <>
            <Page session={session} title="Seamless Developer Console" breadcrumbs={[{ link: "/", name: "Home" }]}>
                <div>This is the test page</div>
                {/* <AutoComplete
                    id="dropdown"
                    size="sm"
                    rounded="sm"
                    name="dropdown"
                    optionItems={[
                        { label: "Active", value: "Active" },
                        { label: "Inactive", value: "Inactive" },
                    ]}
                /> */}
                <AutoComplete
                    optionItems={
                        ["Web Development", "AI & ML", "Cybersecurity", "Cloud Computing", "Apple", "Ant", "Apex", "Anchor", "Automation",
                            "Backend", "Binary", "Blockchain", "Bugfix", "Bootstrap",
                            "Data", "Database", "Debug", "Deployment",
                            "Machine", "Matrix", "Middleware", "Model",
                            "Cyber", "Cipher", "Cypher", "Compute", "Cloud",
                            "Processing", "Programming", "Compression", "Connection", "Encryption",
                            "Web", "Website", "WebApp", "Workflow",
                            "AI", "Algorithm", "Analytics",
                            "Container", "Cluster", "Cache"
                        ]
                    }
                    placeholder="Search or select a category..."
                    multipleSelect={true}

                />
            </Page>
        </>
    )
}


export const getServerSideProps = checkSession;
