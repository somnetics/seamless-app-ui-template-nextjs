import "@/styles/globals.css";
import "@/styles/components.css";

import type { AppProps } from "next/app";
import { GlobalStateProvider } from "@/context/globalState";
import { ThemeProvider } from "next-themes";
import { ProgressProvider } from "@/components/Progress";
import { ToastProvider } from "@/components/Toast";
import { ModalProvider } from '@/components/Modal';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <ProgressProvider>
        <ToastProvider>
          <ModalProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
              <Component {...pageProps} />
            </ThemeProvider>
          </ModalProvider>
        </ToastProvider>
      </ProgressProvider>
    </GlobalStateProvider>
  );
}
