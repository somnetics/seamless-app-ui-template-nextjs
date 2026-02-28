import { SessionData } from "@/libs/session";
import { checkSession } from "@/libs/checkSession";
import Page from "@/components/Page";
import Form from "@/components/Form";
import AutoSuggest from "@/components/AutoSuggest";
import Button from "@/components/Button";
import Login from "@/components/Login";

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
      <Login/>
    </>
  )
}


export const getServerSideProps = checkSession;
