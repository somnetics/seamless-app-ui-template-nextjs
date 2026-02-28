import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Progress.module.css";

type ProgressContextType = {
  showProgress: (show: boolean) => void;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside ProgressProvider");
  return context;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [progresss, setProgresss] = useState<boolean>(false);

  const showProgress = (show: boolean) => {
    setProgresss(show);
  };

  useEffect(() => {
    // on router loading complete
    router.events.on("routeChangeComplete", (e) => {
      // activate form Progress
      showProgress(false);
    });
  }, [router.events]);

  return (
    <ProgressContext.Provider value={{ showProgress }}>
      {children}
      <div className={styles.progressBar + (progresss ? " " + styles.progressBarActive : "")}>
        <div className={styles.ProgressBarValue}></div>
      </div>
    </ProgressContext.Provider>
  );
}
