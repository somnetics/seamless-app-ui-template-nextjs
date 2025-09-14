import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        className="cursor-pointer flex items-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 p-[9px] hover:bg-surface-2" >
        {currentTheme == "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </>
  )
}

export default ThemeToggle