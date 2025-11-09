import "@/styles/globals.css";
import "@/styles/components.css";
import "@/components/Markdown/style.css";

import type { AppProps } from "next/app";
import { GlobalStateProvider } from "@/context/globalState";
import { ThemeProvider } from "next-themes";
import { ProgressProvider } from "@/components/Progress";
import { ToastProvider } from "@/components/Toast";
import { ModalProvider } from '@/components/Modal';
import { SessionProvider } from "@/components/Session";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <ProgressProvider>
        <ToastProvider>
          <ModalProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
              <SessionProvider>
                <Component {...pageProps} />
              </SessionProvider>
            </ThemeProvider>
          </ModalProvider>
        </ToastProvider>
      </ProgressProvider>
    </GlobalStateProvider>
  );
}
