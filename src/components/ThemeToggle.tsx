import { useTheme } from "next-themes";
import { SessionData } from "@/libs/session";
import { useGlobalState } from "@/context/globalState";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ session }: { session: SessionData }) => {
  const globalState = useGlobalState();
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = async () => {
    // get theme
    const theme = currentTheme === "dark" ? "light" : "dark";

    // save data to session
    await globalState.saveThemeToSession(theme);

    // set theme
    setTheme(theme);
  };

  return (
    <button onClick={toggleTheme} className="cursor-pointer flex items-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 p-[9px] hover:bg-surface-2">
      {(globalState.theme || session.theme) == "light" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
};

export default ThemeToggle;
