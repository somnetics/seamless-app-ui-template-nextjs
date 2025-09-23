import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GlobalStateProvider } from "@/context/globalState";
import { ThemeProvider } from "next-themes";
import { ProgressProvider } from "@/components/Progress";
import { ToastProvider } from "@/components/Toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <ProgressProvider>
        <ToastProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
            <Component {...pageProps} />
          </ThemeProvider>
        </ToastProvider>
      </ProgressProvider>
    </GlobalStateProvider>
  );
}
